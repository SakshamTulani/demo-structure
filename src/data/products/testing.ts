// Test data builders for the products domain. Only tests import this file.
import type { ApiProduct } from "./productMappers"

export const buildApiProduct = (overrides: Partial<ApiProduct> = {}): ApiProduct => ({
  id: 1,
  title: "Majestic Mountain Graphic T-Shirt",
  slug: "majestic-mountain-graphic-t-shirt",
  price: 44,
  description: "A soft black t-shirt with a monochrome mountain range graphic.",
  category: { id: 1, name: "Clothes" },
  images: ["https://i.imgur.com/QkIa5tT.jpeg"],
  creationAt: "2026-11-02T21:10:38.000Z",
  updatedAt: "2026-11-02T21:10:38.000Z",
  ...overrides,
})

/** n products in one category, ids 1…n. */
export const buildApiProducts = (n: number, overrides: Partial<ApiProduct> = {}): ApiProduct[] =>
  Array.from({ length: n }, (_, i) =>
    buildApiProduct({ id: i + 1, title: `Product ${i + 1}`, ...overrides })
  )
