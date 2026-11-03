import { describe, expect, it } from "@rstest/core"
import { screen, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"

import { buildApiCategory } from "@/data/categories/testing"
import { buildApiProduct } from "@/data/products/testing"
import { renderWithProviders } from "@/test/render"
import { apiUrl, server } from "@/test/server"

import { ManagePage } from "./ManagePage"

/** A tiny in-memory backend: renames and new products change what later reads return. */
function serveBackend() {
  let name = "Clothes"
  const products = [buildApiProduct({ id: 1, title: "Mountain tee", category: { id: 1, name } })]
  const requests = { renames: 0, creates: 0 }
  server.use(
    http.get(apiUrl("/categories"), () => HttpResponse.json([buildApiCategory({ id: 1, name })])),
    http.get(apiUrl("/products"), () =>
      HttpResponse.json(products.map((p) => ({ ...p, category: { id: 1, name } })))
    ),
    http.put(apiUrl("/categories/1"), async ({ request }) => {
      requests.renames++
      name = ((await request.json()) as { name: string }).name
      return HttpResponse.json(buildApiCategory({ id: 1, name }))
    }),
    http.post(apiUrl("/products"), async ({ request }) => {
      requests.creates++
      const body = (await request.json()) as { title: string; price: number }
      const created = buildApiProduct({
        id: 2,
        title: body.title,
        price: body.price,
        category: { id: 1, name },
      })
      products.unshift(created)
      return HttpResponse.json(created)
    })
  )
  return requests
}

const preview = () => screen.getByRole("list", { name: "Products in this category" })

describe("ManagePage", () => {
  it("catalog/REQ-6: shows the schema's message and sends nothing for a one-letter name", async () => {
    const requests = serveBackend()
    const { user } = renderWithProviders(<ManagePage />, { appState: { categoryId: 1 } })
    const input = await screen.findByRole("textbox", { name: "Category name" })

    await user.clear(input)
    await user.type(input, "A")
    await user.click(screen.getByRole("button", { name: "Rename" }))

    expect(await screen.findByText("Use at least 2 characters.")).toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(requests.renames).toBe(0)
  })

  it("catalog/REQ-6: after a rename, the category list and the products show the new name, with no reload", async () => {
    serveBackend()
    const { user } = renderWithProviders(<ManagePage />, { appState: { categoryId: 1 } })
    expect(
      await within(
        await screen.findByRole("list", { name: "Products in this category" })
      ).findByText(/Clothes/)
    ).toBeInTheDocument()
    const input = screen.getByRole("textbox", { name: "Category name" })

    await user.clear(input)
    await user.type(input, "Apparel")
    await user.click(screen.getByRole("button", { name: "Rename" }))

    expect(await screen.findByRole("status")).toHaveTextContent("Renamed to Apparel.")
    expect(
      await within(screen.getByRole("navigation", { name: "Categories" })).findByRole("button", {
        name: "Apparel",
      })
    ).toBeInTheDocument()
    expect(await within(preview()).findByText(/Apparel/)).toBeInTheDocument()
  })

  it("catalog/REQ-7: shows each field's message and sends nothing when the new product is invalid", async () => {
    const requests = serveBackend()
    const { user } = renderWithProviders(<ManagePage />, { appState: { categoryId: 1 } })
    await screen.findByRole("textbox", { name: "Title" })

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Mu")
    await user.type(screen.getByRole("textbox", { name: "Price (USD)" }), "0")
    await user.click(screen.getByRole("button", { name: "Add product" }))

    expect(await screen.findByText("Use at least 3 characters.")).toBeInTheDocument()
    expect(screen.getByText("Use a price of at least 1.")).toBeInTheDocument()
    expect(screen.getByText("Use at least 10 characters.")).toBeInTheDocument()
    expect(requests.creates).toBe(0)
  })

  it("catalog/REQ-7: adds a product, lists it in the category and links to it", async () => {
    serveBackend()
    const { user } = renderWithProviders(<ManagePage />, { appState: { categoryId: 1 } })
    await screen.findByRole("textbox", { name: "Title" })

    await user.type(screen.getByRole("textbox", { name: "Title" }), "Canvas tote")
    await user.type(screen.getByRole("textbox", { name: "Price (USD)" }), "18.5")
    await user.type(
      screen.getByRole("textbox", { name: "Description" }),
      "A sturdy canvas bag for groceries."
    )
    await user.click(screen.getByRole("button", { name: "Add product" }))

    expect(await screen.findByRole("link", { name: "View it" })).toHaveAttribute(
      "href",
      "/catalog/products/2"
    )
    expect(await within(preview()).findByText(/Canvas tote/)).toBeInTheDocument()
  })
})
