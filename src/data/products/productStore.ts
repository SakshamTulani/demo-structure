import type { HttpClient } from "@/shared/api"

import { BaseCacheStore, type QueryObserver } from "../core"
import type { DataEvents } from "../events"
import { type ApiNewProduct, type ApiProduct, toApiNewProduct, toProduct } from "./productMappers"
import { newProductInputSchema } from "./schemas"
import type { NewProductInput, Product, ProductPage, ProductQuery } from "./types"

export const PAGE_SIZE = 12

/** Every cache key this store uses. invalidateQueries() takes these, or a prefix of one. */
export const productKeys = {
  lists: (categoryId: number) => ["products", "list", categoryId] as const,
  list: (q: ProductQuery) => ["products", "list", q.categoryId, q.search, q.page] as const,
  details: () => ["products", "detail"] as const,
  detail: (productId: number) => ["products", "detail", productId] as const,
}

/** How long each read stays fresh, in ms. */
const TTL = {
  list: 60_000,
  detail: 5 * 60_000,
}

type Signal = { signal: AbortSignal }

export type ProductStoreDeps = { http: HttpClient; events: DataEvents }

export class ProductStore extends BaseCacheStore {
  private readonly deps: ProductStoreDeps

  constructor(deps: ProductStoreDeps) {
    super()
    this.deps = deps
    // Products carry their category's name. CategoryStore owns the rename and
    // announces it; this store refreshes its own queries that show the old name.
    deps.events.on("category/renamed", (e) => {
      this.invalidateQueries(productKeys.lists(e.categoryId))
      this.invalidateQueries(productKeys.details())
    })
  }

  // ── Queries: cached reads, wire → entity ──

  getProducts(q: ProductQuery): QueryObserver<ProductPage> {
    return this.queryCache.getQuery(
      productKeys.list(q),
      async ({ signal }) => {
        // One extra row tells whether a next page exists.
        const rows = await this.listProducts(q, PAGE_SIZE + 1, { signal })
        return { items: rows.slice(0, PAGE_SIZE).map(toProduct), hasNext: rows.length > PAGE_SIZE }
      },
      { ttl: TTL.list }
    )
  }

  getProduct(productId: number): QueryObserver<Product> {
    return this.queryCache.getQuery(
      productKeys.detail(productId),
      async ({ signal }) => toProduct(await this.productById(productId, { signal })),
      { ttl: TTL.detail }
    )
  }

  // ── Mutations: validate, write, then invalidate ──

  async createProduct(input: NewProductInput): Promise<Product> {
    const valid = newProductInputSchema.parse(input) // a bad input never reaches the server
    const created = toProduct(await this.postProduct(toApiNewProduct(valid)))
    // Every page of that category's list may now differ: refresh them.
    this.invalidateQueries(productKeys.lists(valid.categoryId))
    return created
  }

  // ── API: one method per endpoint. HTTP only; wire types in and out ──

  private listProducts(q: ProductQuery, limit: number, opts: Signal) {
    const params = new URLSearchParams({
      categoryId: String(q.categoryId),
      offset: String((q.page - 1) * PAGE_SIZE),
      limit: String(limit),
    })
    if (q.search) params.set("title", q.search)
    return this.deps.http.get<ApiProduct[]>(`/products?${params}`, opts)
  }

  private productById(productId: number, opts: Signal) {
    return this.deps.http.get<ApiProduct>(`/products/${productId}`, opts)
  }

  private postProduct(body: ApiNewProduct) {
    return this.deps.http.post<ApiProduct>("/products", body)
  }
}
