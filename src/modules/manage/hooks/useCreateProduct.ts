import { useMutation, useStores } from "@/bindings/react"
import type { NewProductInput } from "@/data"

/** Write hook. ProductStore refreshes the category's lists; callers refresh nothing. */
export function useCreateProduct() {
  const { products } = useStores()
  return useMutation((input: NewProductInput) => products.createProduct(input))
}
