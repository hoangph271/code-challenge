import express from "express"
import type { Database } from "bun:sqlite"
import { createProductsRouter } from "./routes/products"

export function createApp(db: Database) {
  const app = express()

  app.use(express.json())

  app.use("/products", createProductsRouter(db))

  return app
}
