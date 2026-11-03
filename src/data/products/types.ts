export type Product = {
  id: number
  title: string
  /** US dollars. */
  price: number
  description: string
  categoryId: number
  categoryName: string
  imageUrl: string | null
  createdAt: Date
}

/** Which products to list. Hooks pass app and module state in as these arguments. */
export type ProductQuery = {
  categoryId: number
  search: string
  /** 1-based. */
  page: number
}

export type ProductPage = {
  items: Product[]
  hasNext: boolean
}

export type NewProductInput = {
  title: string
  price: number
  description: string
  categoryId: number
  imageUrl: string
}
