import type { Category, RenameCategoryInput } from "./types"

// Wire types: exactly what the Platzi API sends and accepts.
export type ApiCategory = {
  id: number
  name: string
  slug: string
  image: string
  creationAt: string
  updatedAt: string
}
export type ApiRenameCategory = { name: string }

export const toCategory = (d: ApiCategory): Category => ({
  id: d.id,
  name: d.name,
  imageUrl: /^https?:\/\//.test(d.image) ? d.image : null,
  updatedAt: new Date(d.updatedAt),
})

export const toApiRenameCategory = (input: RenameCategoryInput): ApiRenameCategory => ({
  name: input.name,
})
