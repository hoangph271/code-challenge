import { Database } from "bun:sqlite"
import { readFileSync } from "fs"
import { join } from "path"

export function createDb(path: string): Database {
  const db = new Database(path)
  db.exec(readFileSync(join(import.meta.dir, "schema.sql"), "utf-8"))
  return db
}
