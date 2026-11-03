import { type FormEvent, useState } from "react"
import { z } from "zod"

import { renameCategoryInputSchema } from "@/data"

import { useRenameCategory } from "./useRenameCategory"

type Errors = { name?: string[] }

/**
 * Form hook: holds the field, validates with the same schema CategoryStore
 * parses with, and returns the messages per field. The component only renders.
 */
export function useRenameCategoryForm(categoryId: number, currentName: string) {
  const rename = useRenameCategory()
  const [name, setName] = useState(currentName)
  const [errors, setErrors] = useState<Errors>({})
  const [savedAs, setSavedAs] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSavedAs(null)
    const result = renameCategoryInputSchema.safeParse({ categoryId, name })
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }
    setErrors({})
    try {
      const saved = await rename.mutateAsync(result.data)
      setSavedAs(saved.name)
    } catch {
      // rename.error holds it; the form shows it.
    }
  }

  return {
    name,
    setName,
    errors,
    submit,
    savedAs,
    isPending: rename.isPending,
    failed: rename.error !== null,
  }
}
