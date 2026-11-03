import { afterEach, describe, expect, it } from "@rstest/core"

import { createAppState } from "@/state"

import { syncCategoryWithUrl } from "./syncCategoryWithUrl"

describe("syncCategoryWithUrl", () => {
  afterEach(() => window.history.replaceState(null, "", "/"))

  it("catalog/REQ-1: selects the category named in the URL", () => {
    window.history.replaceState(null, "", "/catalog?category=4")
    const state = createAppState()

    syncCategoryWithUrl(state)

    expect(state.selectedCategoryId.get()).toBe(4)
  })

  it("ignores a category in the URL that isn't a positive whole number", () => {
    window.history.replaceState(null, "", "/catalog?category=abc")
    const state = createAppState()

    syncCategoryWithUrl(state)

    expect(state.selectedCategoryId.get()).toBeNull()
  })

  it("catalog/REQ-1: writes the selected category into the URL", () => {
    const state = createAppState()
    syncCategoryWithUrl(state)

    state.selectedCategoryId.set(3)

    expect(new URLSearchParams(window.location.search).get("category")).toBe("3")
  })

  it("catalog/REQ-1: writes the category back after a navigation drops the query string", () => {
    const state = createAppState({ categoryId: 2 })
    let navigated = () => {}
    syncCategoryWithUrl(state, (listener) => {
      navigated = listener
      return () => {}
    })

    window.history.pushState(null, "", "/manage")
    navigated()

    expect(window.location.pathname).toBe("/manage")
    expect(new URLSearchParams(window.location.search).get("category")).toBe("2")
  })
})
