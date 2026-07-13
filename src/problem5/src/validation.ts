import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative().default(0),
})

export const updateProductSchema = createProductSchema.partial()

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  name: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
})
