import type { HttpClient } from "@/shared/api"

import { BaseCacheStore, type QueryObserver } from "../core"
import type { DataEvents } from "../events"
import {
  type ApiCategory,
  type ApiRenameCategory,
  toApiRenameCategory,
  toCategory,
} from "./categoryMappers"
import { renameCategoryInputSchema } from "./schemas"
import type { Category, RenameCategoryInput } from "./types"

/** Every cache key this store uses. invalidateQueries() takes these, or a prefix of one. */
export const categoryKeys = {
  all: () => ["categories"] as const,
}

/** How long each read stays fresh, in ms. */
const TTL = {
  all: 5 * 60_000,
}

type Signal = { signal: AbortSignal }

export type CategoryStoreDeps = { http: HttpClient; events: DataEvents }

export class CategoryStore extends BaseCacheStore {
  private readonly deps: CategoryStoreDeps

  constructor(deps: CategoryStoreDeps) {
    super()
    this.deps = deps
  }

  // ── Queries: cached reads, wire → entity ──

  getCategories(): QueryObserver<Category[]> {
    return this.queryCache.getQuery(
      categoryKeys.all(),
      async ({ signal }) => (await this.listCategories({ signal })).map(toCategory),
      { ttl: TTL.all }
    )
  }

  // ── Mutations: validate, write, then invalidate ──

  async renameCategory(input: RenameCategoryInput): Promise<Category> {
    const valid = renameCategoryInputSchema.parse(input) // a bad input never reaches the server
    const saved = toCategory(
      await this.updateCategory(valid.categoryId, toApiRenameCategory(valid))
    )
    // Its own query: invalidate it directly.
    this.invalidateQueries(categoryKeys.all())
    // Products show their category's name, and ProductStore owns them: announce it.
    this.deps.events.emit({ type: "category/renamed", categoryId: valid.categoryId })
    return saved
  }

  // ── API: one method per endpoint. HTTP only; wire types in and out ──

  private listCategories(opts: Signal) {
    return this.deps.http.get<ApiCategory[]>("/categories", opts)
  }

  private updateCategory(categoryId: number, body: ApiRenameCategory) {
    return this.deps.http.put<ApiCategory>(`/categories/${categoryId}`, body)
  }
}
