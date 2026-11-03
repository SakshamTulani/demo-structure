import { State } from "./State"

export type CatalogView = "grid" | "list"

/**
 * App state: choices that decide which data to show. Not server data, so it
 * lives outside src/data/; hooks pass these values to stores as arguments.
 * Built once in src/app/App.tsx, and fresh per test in src/test/render.tsx.
 */
export function createAppState(initial: { categoryId?: number | null } = {}) {
  return {
    // Global: every screen reads it, and the URL keeps it (app/syncCategoryWithUrl.ts).
    selectedCategoryId: new State<number | null>(initial.categoryId ?? null),

    // Module-level: only the catalog module's hooks read these. They live here,
    // not in a component, so they survive the user leaving the catalog and coming back.
    catalog: {
      search: new State(""),
      view: new State<CatalogView>("grid"),
    },
  }
}

export type AppState = ReturnType<typeof createAppState>
