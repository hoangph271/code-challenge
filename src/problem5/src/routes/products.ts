import { Router } from "express"
import type { Database } from "bun:sqlite"
import { z } from "zod"
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from "../validation"

export type ProductRow = {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  stock: number
  created_at: string
}

export function createProductsRouter(db: Database): Router {
  const router = Router()

  router.post("/", (req, res) => {
    const parsed = createProductSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: z.treeifyError(parsed.error) })

    const { name, description, price, category, stock } = parsed.data
    const row = db
      .query<ProductRow, [string, string | null, number, string, number]>(
        "INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?) RETURNING *"
      )
      .get(name, description ?? null, price, category, stock)

    res.status(201).json(row)
  })

  router.get("/", (req, res) => {
    const parsed = listProductsQuerySchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).json({ error: z.treeifyError(parsed.error) })

    const { category, name, minPrice, maxPrice, limit, offset } = parsed.data
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (category !== undefined) {
      conditions.push("category = ?")
      params.push(category)
    }
    if (name !== undefined) {
      conditions.push("name LIKE ?")
      params.push(`%${name}%`)
    }
    if (minPrice !== undefined) {
      conditions.push("price >= ?")
      params.push(minPrice)
    }
    if (maxPrice !== undefined) {
      conditions.push("price <= ?")
      params.push(maxPrice)
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    const rows = db
      .query<ProductRow, (string | number)[]>(`SELECT * FROM products ${where} ORDER BY id LIMIT ? OFFSET ?`)
      .all(...params, limit, offset)

    res.json(rows)
  })

  router.get("/:id", (req, res) => {
    const row = db.query<ProductRow, [string]>("SELECT * FROM products WHERE id = ?").get(req.params.id)
    if (!row) return res.status(404).json({ error: "Product not found" })
    res.json(row)
  })

  router.put("/:id", (req, res) => {
    const existing = db.query<ProductRow, [string]>("SELECT * FROM products WHERE id = ?").get(req.params.id)
    if (!existing) return res.status(404).json({ error: "Product not found" })

    const parsed = updateProductSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: z.treeifyError(parsed.error) })

    const merged = { ...existing, ...parsed.data }
    const row = db
      .query<ProductRow, [string, string | null, number, string, number, string]>(
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ? RETURNING *"
      )
      .get(merged.name, merged.description ?? null, merged.price, merged.category, merged.stock, req.params.id)

    res.json(row)
  })

  router.delete("/:id", (req, res) => {
    const existing = db.query<ProductRow, [string]>("SELECT * FROM products WHERE id = ?").get(req.params.id)
    if (!existing) return res.status(404).json({ error: "Product not found" })

    db.query("DELETE FROM products WHERE id = ?").run(req.params.id)
    res.status(204).send()
  })

  return router
}
