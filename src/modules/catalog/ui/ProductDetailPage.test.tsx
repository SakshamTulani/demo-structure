import { describe, expect, it } from "@rstest/core"
import { screen } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import { Route, Routes } from "react-router-dom"

import { buildApiProduct } from "@/data/products/testing"
import { renderWithProviders } from "@/test/render"
import { apiUrl, server } from "@/test/server"

import { ProductDetailPage } from "./ProductDetailPage"

describe("ProductDetailPage", () => {
  it("catalog/REQ-5: shows the product named in the URL", async () => {
    server.use(
      http.get(apiUrl("/products/7"), () =>
        HttpResponse.json(
          buildApiProduct({ id: 7, title: "Trail boots", category: { id: 2, name: "Shoes" } })
        )
      )
    )
    renderWithProviders(
      <Routes>
        <Route path="/catalog/products/:productId" element={<ProductDetailPage />} />
      </Routes>,
      { route: "/catalog/products/7" }
    )

    expect(await screen.findByRole("heading", { name: "Trail boots" })).toBeInTheDocument()
    expect(screen.getByText(/Shoes · added/)).toBeInTheDocument()
  })
})
