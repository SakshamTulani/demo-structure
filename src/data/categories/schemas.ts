import { z } from "zod"

import type { RenameCategoryInput } from "./types"

/**
 * A valid rename. CategoryStore.renameCategory parses with it before it sends
 * anything; the rename form in modules/manage validates with it and shows its
 * messages next to the field. Typed against types.ts, so the two can't drift.
 */
export const renameCategoryInputSchema = z.object({
  categoryId: z.number().int().positive("Choose a category."),
  name: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters.")
    .max(40, "Use at most 40 characters."),
}) satisfies z.ZodType<RenameCategoryInput>
