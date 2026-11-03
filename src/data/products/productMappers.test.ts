import { describe, expect, it } from "@rstest/core"

import { firstImageUrl, toApiNewProduct, toProduct } from "./productMappers"
import { buildApiProduct } from "./testing"

describe("productMappers", () => {
  it("reads the category's id and name from the nested category", () => {
    const product = toProduct(buildApiProduct({ category: { id: 4, name: "Shoes" } }))

    expect(product.categoryId).toBe(4)
    expect(product.categoryName).toBe("Shoes")
  })

  it("cleans an image list stored as one JSON string", () => {
    expect(firstImageUrl(['["https://i.imgur.com/a.jpeg"', '"https://i.imgur.com/b.jpeg"]'])).toBe(
      "https://i.imgur.com/a.jpeg"
    )
  })

  it("has no image when no entry is a URL", () => {
    expect(firstImageUrl(["", "[]"])).toBeNull()
  })

  it("sends the image URL as the one-item images array the API expects", () => {
    const body = toApiNewProduct({
      title: "Mug",
      price: 12,
      description: "A ceramic mug.",
      categoryId: 1,
      imageUrl: "https://placehold.co/600x400",
    })

    expect(body.images).toEqual(["https://placehold.co/600x400"])
  })
})
