import { useAppState, useValue } from "@/bindings/react"
import type { CatalogView } from "@/state"

/** Module-state hook: grid or list. Kept while the user is on another screen. */
export function useCatalogView() {
  const { catalog } = useAppState()
  const view = useValue(catalog.view)
  return [view, (next: CatalogView) => catalog.view.set(next)] as const
}
