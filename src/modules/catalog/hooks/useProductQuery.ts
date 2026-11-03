import { useQuery, useStores } from "@/bindings/react"

/** Data hook: one product. */
export function useProductQuery(productId: number) {
  return useQuery(useStores().products.getProduct(productId))
}
