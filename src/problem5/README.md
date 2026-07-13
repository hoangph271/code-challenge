# Problem 5: Product CRUD API

Express + TypeScript CRUD service for a `product` resource, backed by SQLite (`bun:sqlite`), running on Bun.

## Prerequisites

- [Bun](https://bun.sh) v1.3+ (tested on 1.3.8).
  ```
  curl -fsSL https://bun.sh/install | bash
  ```

## Setup

```
cd src/problem5
bun install
```

## Run

```
bun run dev    # watch mode
bun run start  # no watch
```

Server listens on `http://localhost:3000` by default. Env vars:

- `PORT`: server port (default `3000`)
- `DB_PATH`: SQLite file path (default `data.sqlite`, created on first run)

## Test

```
bun test
```

Tests run against an in-memory SQLite database (`:memory:`), isolated from the dev database file.

## API

| Method | Path          | Description                                                                             |
| ------ | ------------- | ---------------------------------------------------------------------------------------- |
| POST   | /products     | Create a product                                                                         |
| GET    | /products     | List products. Filters: `category`, `name` (substring), `minPrice`, `maxPrice`. Pagination: `limit` (default 20, max 100), `offset` |
| GET    | /products/:id | Get a product                                                                             |
| PUT    | /products/:id | Update a product (partial body)                                                          |
| DELETE | /products/:id | Delete a product                                                                          |

Validation errors return `400` with `{ "error": <zod treeifyError() output> }`; missing resources return `404` with `{ "error": "Product not found" }`.

### Product shape

```json
{
  "id": 1,
  "name": "Hammer",
  "description": null,
  "price": 12.5,
  "category": "tools",
  "stock": 10,
  "created_at": "2026-07-13 05:55:35"
}
```

## Notes

Authentication & authorization are intentionally left out: they require proper setup (user model, session/token handling, permissions) that's outside the scope of this exercise, which focuses on the CRUD and persistence layer.
