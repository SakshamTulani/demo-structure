import { useAppState, useValue } from "@/bindings/react"

/** Global app-state hook: the category every screen shows, and a way to change it. */
export function useSelectedCategory() {
  const { selectedCategoryId } = useAppState()
  const categoryId = useValue(selectedCategoryId)
  return [categoryId, (id: number) => selectedCategoryId.set(id)] as const
}
