import { createApp } from "./app"
import { createDb } from "./db"

const db = createDb(process.env.DB_PATH ?? "data.sqlite")
const app = createApp(db)
const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
