import { useAppState, useValue } from "@/bindings/react"

/** Module-state hook: the catalog's committed search. Kept while the user is on another screen. */
export function useCatalogSearch() {
  const { catalog } = useAppState()
  const search = useValue(catalog.search)
  return [search, (term: string) => catalog.search.set(term)] as const
}
