// Test data builders for the categories domain. Only tests import this file.
import type { ApiCategory } from "./categoryMappers"

export const buildApiCategory = (overrides: Partial<ApiCategory> = {}): ApiCategory => ({
  id: 1,
  name: "Clothes",
  slug: "clothes",
  image: "https://i.imgur.com/QkIa5tT.jpeg",
  creationAt: "2026-11-02T21:10:38.000Z",
  updatedAt: "2026-11-02T21:10:38.000Z",
  ...overrides,
})
