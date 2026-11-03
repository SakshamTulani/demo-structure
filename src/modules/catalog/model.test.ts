import { describe, expect, it } from "@rstest/core"

import type { Product } from "@/data"

import { isPremium, PREMIUM_FROM } from "./model"

const product = (price: number): Product => ({
  id: 1,
  title: "Mug",
  price,
  description: "A ceramic mug.",
  categoryId: 1,
  categoryName: "Home",
  imageUrl: null,
  createdAt: new Date(0),
})

describe("isPremium", () => {
  it("catalog/REQ-4: marks a product priced exactly at the threshold as Premium", () => {
    expect(isPremium(product(PREMIUM_FROM))).toBe(true)
  })

  it("catalog/REQ-4: doesn't mark a product just below the threshold", () => {
    expect(isPremium(product(PREMIUM_FROM - 0.01))).toBe(false)
  })
})
