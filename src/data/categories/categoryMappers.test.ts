import { describe, expect, it } from "@rstest/core"

import { toCategory } from "./categoryMappers"
import { buildApiCategory } from "./testing"

describe("categoryMappers", () => {
  it("keeps an http image URL", () => {
    expect(toCategory(buildApiCategory()).imageUrl).toBe("https://i.imgur.com/QkIa5tT.jpeg")
  })

  it("drops an image that isn't a URL, so the UI shows its placeholder", () => {
    expect(toCategory(buildApiCategory({ image: "not-a-url" })).imageUrl).toBeNull()
  })

  it("reads updatedAt as a Date", () => {
    expect(toCategory(buildApiCategory()).updatedAt).toEqual(new Date("2026-11-02T21:10:38.000Z"))
  })
})
