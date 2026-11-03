import type { NewProductInput, Product } from "./types"

// Wire types: exactly what the Platzi API sends and accepts.
type ApiProductCategory = { id: number; name: string }
export type ApiProduct = {
  id: number
  title: string
  slug: string
  price: number
  description: string
  category: ApiProductCategory
  images: string[]
  creationAt: string
  updatedAt: string
}
export type ApiNewProduct = {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

/**
 * The sandbox sometimes stores an image list as one JSON string split across
 * entries ('["https://a.jpg"'). Strip the brackets and quotes, keep the first URL.
 */
export function firstImageUrl(images: string[]): string | null {
  for (const raw of images) {
    const url = raw.replace(/[[\]"]/g, "").trim()
    if (/^https?:\/\//.test(url)) return url
  }
  return null
}

export const toProduct = (d: ApiProduct): Product => ({
  id: d.id,
  title: d.title,
  price: d.price,
  description: d.description,
  categoryId: d.category.id,
  categoryName: d.category.name,
  imageUrl: firstImageUrl(d.images),
  createdAt: new Date(d.creationAt),
})

export const toApiNewProduct = (input: NewProductInput): ApiNewProduct => ({
  title: input.title,
  price: input.price,
  description: input.description,
  categoryId: input.categoryId,
  images: [input.imageUrl],
})
