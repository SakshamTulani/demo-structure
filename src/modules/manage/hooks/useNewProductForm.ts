import { type FormEvent, useState } from "react"
import { z } from "zod"

import { newProductInputSchema, type Product } from "@/data"

import { useCreateProduct } from "./useCreateProduct"

export type NewProductFields = {
  title: string
  price: string
  description: string
  imageUrl: string
}
type Errors = Partial<Record<keyof NewProductFields | "categoryId", string[]>>

const EMPTY: NewProductFields = {
  title: "",
  price: "",
  description: "",
  imageUrl: "https://placehold.co/600x400",
}

/**
 * Form hook: turns the text fields into a NewProductInput (price string →
 * number), validates with the schema ProductStore parses with, and returns the
 * messages per field. Form-only rules would extend the schema here, never in src/data/.
 */
export function useNewProductForm(categoryId: number) {
  const create = useCreateProduct()
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [created, setCreated] = useState<Product | null>(null)

  const setField = (name: keyof NewProductFields, value: string) =>
    setFields((f) => ({ ...f, [name]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setCreated(null)
    const result = newProductInputSchema.safeParse({
      ...fields,
      price: fields.price.trim() === "" ? Number.NaN : Number(fields.price),
      categoryId,
    })
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }
    setErrors({})
    try {
      setCreated(await create.mutateAsync(result.data))
      setFields(EMPTY)
    } catch {
      // create.error holds it; the form shows it.
    }
  }

  return {
    fields,
    setField,
    errors,
    submit,
    created,
    isPending: create.isPending,
    failed: create.error !== null,
  }
}
