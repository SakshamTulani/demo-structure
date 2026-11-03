import { describe, expect, it } from "@rstest/core"
import { screen, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { Link, Route, Routes } from "react-router-dom"

import { buildApiCategory } from "@/data/categories/testing"
import { buildApiProduct, buildApiProducts } from "@/data/products/testing"
import { renderWithProviders } from "@/test/render"
import { apiUrl, server } from "@/test/server"

import { CatalogPage } from "./CatalogPage"

function serveCatalog() {
  server.use(
    http.get(apiUrl("/categories"), () =>
      HttpResponse.json([
        buildApiCategory({ id: 1, name: "Clothes" }),
        buildApiCategory({ id: 2, name: "Shoes" }),
      ])
    ),
    http.get(apiUrl("/products"), ({ request }) => {
      const params = new URL(request.url).searchParams
      const categoryId = Number(params.get("categoryId"))
      const title = params.get("title") ?? ""
      const offset = Number(params.get("offset"))
      const name = categoryId === 1 ? "Clothes" : "Shoes"
      const all = [
        ...buildApiProducts(13, { category: { id: categoryId, name } }).map((p) => ({
          ...p,
          title: `${name} item ${p.id}`,
        })),
        buildApiProduct({
          id: 50,
          title: `${name} jacket`,
          price: 120,
          category: { id: categoryId, name },
        }),
      ]
      const matching = all.filter((p) => p.title.toLowerCase().includes(title.toLowerCase()))
      return HttpResponse.json(matching.slice(offset, offset + Number(params.get("limit"))))
    })
  )
}

const productsList = () => screen.getByRole("list", { name: "Products" })

describe("CatalogPage", () => {
  it("catalog/REQ-1: shows the products of the category the user chooses", async () => {
    serveCatalog()
    const { user, state } = renderWithProviders(<CatalogPage />)

    await user.click(await screen.findByRole("button", { name: "Shoes" }))

    expect(await screen.findByRole("link", { name: "Shoes item 1" })).toBeInTheDocument()
    expect(state.selectedCategoryId.get()).toBe(2)
  })

  it("catalog/REQ-2: keeps the search and the list view after visiting another screen", async () => {
    serveCatalog()
    const { user } = renderWithProviders(
      <Routes>
        <Route
          path="/catalog"
          element={
            <>
              <CatalogPage />
              <Link to="/elsewhere">Elsewhere</Link>
            </>
          }
        />
        <Route path="/elsewhere" element={<Link to="/catalog">Back</Link>} />
      </Routes>,
      { route: "/catalog", appState: { categoryId: 1 } }
    )
    await user.type(await screen.findByRole("textbox", { name: "Search products" }), "jacket")
    await user.click(screen.getByRole("button", { name: "Search" }))
    await user.click(screen.getByRole("button", { name: "List" }))

    await user.click(screen.getByRole("link", { name: "Elsewhere" }))
    await user.click(await screen.findByRole("link", { name: "Back" }))

    expect(await screen.findByRole("link", { name: "Clothes jacket" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Search products" })).toHaveValue("jacket")
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true")
  })

  it("catalog/REQ-3: goes back to the first page when the category changes", async () => {
    serveCatalog()
    const { user } = renderWithProviders(<CatalogPage />, { appState: { categoryId: 1 } })
    await user.click(await screen.findByRole("button", { name: "Next" }))
    expect(await screen.findByText("Page 2")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Shoes" }))

    expect(await screen.findByText("Page 1")).toBeInTheDocument()
    expect(
      await within(productsList()).findByRole("link", { name: "Shoes item 1" })
    ).toBeInTheDocument()
  })

  it("catalog/REQ-4: shows the Premium badge only on products priced 100 or more", async () => {
    serveCatalog()
    const { user } = renderWithProviders(<CatalogPage />, { appState: { categoryId: 1 } })
    await user.click(await screen.findByRole("button", { name: "Next" }))

    const jacket = (await screen.findByRole("link", { name: "Clothes jacket" })).closest("article")
    const item13 = screen.getByRole("link", { name: "Clothes item 13" }).closest("article")

    expect(jacket && within(jacket).getByText("Premium")).toBeInTheDocument()
    expect(item13 && within(item13).queryByText("Premium")).not.toBeInTheDocument()
  })

  it("says so when the search matches nothing", async () => {
    serveCatalog()
    const { user } = renderWithProviders(<CatalogPage />, { appState: { categoryId: 1 } })

    await user.type(await screen.findByRole("textbox", { name: "Search products" }), "zzz")
    await user.click(screen.getByRole("button", { name: "Search" }))

    expect(await screen.findByText('No products match "zzz".')).toBeInTheDocument()
  })
})
