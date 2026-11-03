import { Link } from "react-router-dom"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

import { type NewProductFields, useNewProductForm } from "../hooks/useNewProductForm"
import { FieldError } from "./FieldError"

const LABELS: Record<keyof NewProductFields, string> = {
  title: "Title",
  price: "Price (USD)",
  description: "Description",
  imageUrl: "Image URL",
}

export function NewProductForm({ categoryId }: { categoryId: number }) {
  const form = useNewProductForm(categoryId)

  const field = (name: keyof NewProductFields) => {
    const id = `new-product-${name}`
    const error = form.errors[name]
    const common = {
      id,
      value: form.fields[name],
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    } as const
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="font-medium">
          {LABELS[name]}
        </label>
        {name === "description" ? (
          <textarea
            {...common}
            rows={3}
            className="rounded-md border bg-transparent px-3 py-2"
            onChange={(e) => form.setField(name, e.target.value)}
          />
        ) : (
          <Input
            {...common}
            inputMode={name === "price" ? "decimal" : undefined}
            onChange={(e) => form.setField(name, e.target.value)}
          />
        )}
        <FieldError id={`${id}-error`} messages={error} />
      </div>
    )
  }

  return (
    <form
      onSubmit={form.submit}
      aria-label="New product"
      noValidate
      className="flex flex-col gap-3"
    >
      {field("title")}
      {field("price")}
      {field("description")}
      {field("imageUrl")}
      <Button type="submit" disabled={form.isPending} className="self-start">
        Add product
      </Button>
      {form.created && (
        <p role="status">
          Added {form.created.title}.{" "}
          <Link to={`/catalog/products/${form.created.id}`} className="underline">
            View it
          </Link>
        </p>
      )}
      {form.failed && <p role="alert">Couldn't add the product. Try again.</p>}
    </form>
  )
}
