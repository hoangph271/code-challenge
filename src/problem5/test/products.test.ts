import { describe, test, expect, beforeAll, afterAll } from "bun:test"
import type { Server } from "http"
import { createApp } from "../src/app"
import { createDb } from "../src/db"
import type { ProductRow } from "../src/routes/products"

let server: Server
let baseUrl: string

beforeAll(() => {
  const db = createDb(":memory:")
  const app = createApp(db)
  server = app.listen(0)
  const port = (server.address() as { port: number }).port
  baseUrl = `http://localhost:${port}`
})

afterAll(() => {
  server.close()
})

describe("products CRUD", () => {
  let createdId: number

  test("POST /products creates a product", async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Widget", price: 9.99, category: "tools", stock: 5 }),
    })
    expect(res.status).toBe(201)

    const body = (await res.json()) as ProductRow
    expect(body.name).toBe("Widget")
    expect(body.category).toBe("tools")
    createdId = body.id
  })

  test("POST /products rejects an invalid body", async () => {
    const res = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", price: -1, category: "" }),
    })
    expect(res.status).toBe(400)
  })

  test("GET /products lists products", async () => {
    const res = await fetch(`${baseUrl}/products`)
    expect(res.status).toBe(200)

    const body = (await res.json()) as ProductRow[]
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  test("GET /products filters by category", async () => {
    await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Gadget", price: 4.5, category: "electronics", stock: 2 }),
    })

    const res = await fetch(`${baseUrl}/products?category=tools`)
    const body = (await res.json()) as ProductRow[]
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((p) => p.category === "tools")).toBe(true)
  })

  test("GET /products filters by name substring", async () => {
    const res = await fetch(`${baseUrl}/products?name=widg`)
    const body = (await res.json()) as ProductRow[]
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((p) => p.name.toLowerCase().includes("widg"))).toBe(true)
  })

  test("GET /products filters by price range", async () => {
    const res = await fetch(`${baseUrl}/products?minPrice=5&maxPrice=10`)
    const body = (await res.json()) as ProductRow[]
    expect(body.every((p) => p.price >= 5 && p.price <= 10)).toBe(true)
  })

  test("GET /products/:id returns a product", async () => {
    const res = await fetch(`${baseUrl}/products/${createdId}`)
    expect(res.status).toBe(200)

    const body = (await res.json()) as ProductRow
    expect(body.id).toBe(createdId)
  })

  test("GET /products/:id 404s for a missing product", async () => {
    const res = await fetch(`${baseUrl}/products/999999`)
    expect(res.status).toBe(404)
  })

  test("PUT /products/:id updates a product", async () => {
    const res = await fetch(`${baseUrl}/products/${createdId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 19.99 }),
    })
    expect(res.status).toBe(200)

    const body = (await res.json()) as ProductRow
    expect(body.price).toBe(19.99)
    expect(body.name).toBe("Widget") // untouched fields are preserved
  })

  test("PUT /products/:id rejects an invalid body", async () => {
    const res = await fetch(`${baseUrl}/products/${createdId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: -5 }),
    })
    expect(res.status).toBe(400)
  })

  test("PUT /products/:id 404s for a missing product", async () => {
    const res = await fetch(`${baseUrl}/products/999999`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: 1 }),
    })
    expect(res.status).toBe(404)
  })

  test("DELETE /products/:id deletes a product", async () => {
    const res = await fetch(`${baseUrl}/products/${createdId}`, { method: "DELETE" })
    expect(res.status).toBe(204)
  })

  test("DELETE /products/:id 404s for a missing product", async () => {
    const res = await fetch(`${baseUrl}/products/${createdId}`, { method: "DELETE" })
    expect(res.status).toBe(404)
  })
})
