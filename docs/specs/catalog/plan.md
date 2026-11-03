---
spec: catalog
---

# Plan: Catalog

Branch `feat/catalog`. Each task is test-first and ends with `pnpm check` green.

- [x] **1** Run `/sf-new-store categories` and `/sf-new-store products`; delete the template's worked example _(REQ-1)_
- [x] **2** `CategoryStore.getCategories`, `ProductStore.getProducts` and `getProduct`, mappers and builders _(REQ-1, REQ-3, REQ-5)_
- [x] **3** App state `selectedCategoryId`, kept in the URL; catalog module state `search` and `view` _(REQ-1, REQ-2)_
- [x] **4** Run `/sf-new-module catalog`: category list, search, view toggle, paged grid, Premium rule, detail page _(REQ-1 to REQ-5)_
- [x] **5** `renameCategory` with its schema, the `category/renamed` event, `ProductStore` refreshing on it _(REQ-6)_
- [x] **6** `createProduct` with its schema; it refreshes its own lists _(REQ-7)_
- [x] **7** Run `/sf-new-module manage`: rename and new-product forms, a preview of the category's products _(REQ-6, REQ-7)_
