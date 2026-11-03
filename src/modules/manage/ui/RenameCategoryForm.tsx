import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

import { useRenameCategoryForm } from "../hooks/useRenameCategoryForm"
import { FieldError } from "./FieldError"

type Props = { categoryId: number; currentName: string }

export function RenameCategoryForm({ categoryId, currentName }: Props) {
  const form = useRenameCategoryForm(categoryId, currentName)

  return (
    <form
      onSubmit={form.submit}
      aria-label="Rename category"
      noValidate
      className="flex flex-col gap-2"
    >
      <label htmlFor="category-name" className="font-medium">
        Category name
      </label>
      <Input
        id="category-name"
        value={form.name}
        onChange={(e) => form.setName(e.target.value)}
        aria-invalid={form.errors.name ? true : undefined}
        aria-describedby={form.errors.name ? "category-name-error" : undefined}
      />
      <FieldError id="category-name-error" messages={form.errors.name} />
      <Button type="submit" disabled={form.isPending} className="self-start">
        Rename
      </Button>
      {form.savedAs && <p role="status">Renamed to {form.savedAs}.</p>}
      {form.failed && <p role="alert">Couldn't rename the category. Try again.</p>}
    </form>
  )
}
