---
spec: catalog
status: approved
approved-by: sakshamtulani
approved-on: 2026-11-03
---

# Spec: Catalog

## Objective

A small shop catalog that shows, end to end, how a factory project is built: two stores that talk through an event, a selection shared by every screen, state one module keeps while the user is elsewhere, view state inside components, and forms validated with the schema the store uses. Success: a new teammate can click through it in two minutes and find each idea in the code.

## Assumptions

- The Platzi Fake Store API stays public, keyless and CORS-open, and keeps writes until its periodic reset.
- Other people use the same sandbox, so categories and products may change under us; the app shows whatever the API returns.
- Prices are US dollars.

## Requirements

- **REQ-1**: When the user chooses a category, the catalog shall show that category's products. The choice is kept in the URL (`?category=<id>`), so a reload or a shared link opens the same category.
- **REQ-2**: The user can search products by title within the category. The search term and the grid or list view are kept when the user goes to Manage and comes back.
- **REQ-3**: Products are shown 12 per page. The page resets to the first when the category or the search changes.
- **REQ-4**: A product priced 100 or more shows a Premium badge.
- **REQ-5**: Choosing a product opens its detail page at `/catalog/products/<id>`.
- **REQ-6**: From Manage, the user can rename the selected category. A name must be 2 to 40 characters; otherwise the message shows next to the field and nothing is sent. After a rename, the category list and every product showing that category show the new name, with no reload.
- **REQ-7**: From Manage, the user can add a product to the selected category: title 3 to 60 characters, price 1 to 10,000, description 10 to 500 characters, an https image URL. Errors show next to their fields and nothing is sent. After a save, the category's product list includes the product and the form links to it.

## Modules touched

New modules `catalog` (REQ-1 to REQ-5) and `manage` (REQ-6, REQ-7). New data domains `categories` and `products`. Endpoints: `GET /categories`, `PUT /categories/:id`, `GET /products?categoryId&title&offset&limit`, `GET /products/:id`, `POST /products`. No WebSocket.

## Upstream contract

| Source | SHA or version | Read on | Used |
|---|---|---|---|
| platzi-api | REST v1, read live | 2026-11-03 | `Category { id, name, slug, image, creationAt, updatedAt }`, `Product { id, title, price, description, category, images[] }`; the endpoints above. Writes persist (checked by creating, renaming and deleting a probe category). |

## Boundaries

- **Always:** keep the demo's writes small: rename and add only.
- **Ask first:** deleting anything in the shared sandbox.
- **Never:** send an API key or personal data; there is no auth.

## Out of scope

Sign-in, carts, deleting, editing products, live updates over a WebSocket.

## Open questions

None.
