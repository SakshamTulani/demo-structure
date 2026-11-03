import { useQuery, useStores } from "@/bindings/react"

/** Data hook: the first page of a category's products, to show a rename taking effect. */
export function useCategoryPreviewQuery(categoryId: number) {
  return useQuery(useStores().products.getProducts({ categoryId, search: "", page: 1 }))
}
