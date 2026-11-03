# Product: Catalog demo

Written by `/sf-new-project`. Keep it current.

## What it is

A shop catalog over the public Platzi Fake Store API. People browse products by category, search, switch between grid and list views, rename a category and add a product. It exists to show the factory's architecture end to end: two stores in `src/data/` (categories and products) that talk through an event, a selection kept in app state and the URL, module-level state that survives navigation, view state in components, and a form validated with the same schema the store uses.

## Modules

| Module | Purpose | Status |
|---|---|---|
| `catalog` | Browse products of the selected category, search, grid or list view, product detail | building |
| `manage` | Rename a category and add a product, with validated forms | building |

## Backends it talks to

- REST: `https://api.escuelajs.co/api/v1` (Platzi Fake Store API). Public, no auth, CORS open, writes persist in a shared sandbox that resets from time to time. Endpoints used: `GET /categories`, `PUT /categories/:id`, `GET /products?categoryId&title&offset&limit`, `GET /products/:id`, `POST /products`.
- WebSocket: none. The template's realtime connection is never opened.
