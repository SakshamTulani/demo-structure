import { useQuery, useStores } from "@/bindings/react"

/** Data hook: every category. */
export function useCategoriesQuery() {
  return useQuery(useStores().categories.getCategories())
}
