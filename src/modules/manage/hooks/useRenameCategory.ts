import { useMutation, useStores } from "@/bindings/react"
import type { RenameCategoryInput } from "@/data"

/** Write hook. CategoryStore refreshes its list and tells ProductStore; callers refresh nothing. */
export function useRenameCategory() {
  const { categories } = useStores()
  return useMutation((input: RenameCategoryInput) => categories.renameCategory(input))
}
