import { useQuery, useStores } from "@/bindings/react"
import type { ProductQuery } from "@/data"

/** Data hook: one page of a category's products, filtered by title. */
export function useProductsQuery(q: ProductQuery) {
  return useQuery(useStores().products.getProducts(q))
}
