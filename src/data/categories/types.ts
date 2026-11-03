export type Category = {
  id: number
  name: string
  imageUrl: string | null
  updatedAt: Date
}

export type RenameCategoryInput = {
  categoryId: number
  name: string
}
