import { z } from "zod"

import type { NewProductInput } from "./types"

/**
 * A valid new product. ProductStore.createProduct parses with it before it
 * sends anything; the new-product form in modules/manage validates with it and
 * shows its messages next to each field. Typed against types.ts.
 */
export const newProductInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(60, "Use at most 60 characters."),
  price: z
    .number("Enter a price.")
    .min(1, "Use a price of at least 1.")
    .max(10_000, "Use a price of at most 10,000."),
  description: z
    .string()
    .trim()
    .min(10, "Use at least 10 characters.")
    .max(500, "Use at most 500 characters."),
  categoryId: z.number().int().positive("Choose a category."),
  imageUrl: z.url({ protocol: /^https$/, message: "Use an https:// image URL." }),
}) satisfies z.ZodType<NewProductInput>
