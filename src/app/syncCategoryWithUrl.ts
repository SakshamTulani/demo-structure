import type { AppState } from "@/state"

type Subscribe = (listener: () => void) => () => void

/**
 * Keeps ?category= and the selected category in step, so a reload or a shared
 * link keeps it. onNavigate is the router's subscribe: a navigation to another
 * path drops the query string, so it is written back after each one.
 */
export function syncCategoryWithUrl(state: AppState, onNavigate?: Subscribe): () => void {
  const fromUrl = Number(new URLSearchParams(window.location.search).get("category"))
  if (Number.isInteger(fromUrl) && fromUrl > 0) state.selectedCategoryId.set(fromUrl)

  const write = () => {
    const url = new URL(window.location.href)
    const categoryId = state.selectedCategoryId.get()
    const wanted = categoryId ? String(categoryId) : null
    if (url.searchParams.get("category") === wanted) return
    if (wanted) url.searchParams.set("category", wanted)
    else url.searchParams.delete("category")
    window.history.replaceState(window.history.state, "", url)
  }

  const offState = state.selectedCategoryId.subscribe(write)
  const offNavigate = onNavigate?.(write)
  return () => {
    offState()
    offNavigate?.()
  }
}
