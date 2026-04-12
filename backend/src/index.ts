import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { pool } from "./db"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import routes from "./routes/index"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ message: "Server running..." })
})

app.use("/api", routes);

const PORT = process.env.PORT || 3000

pool.connect()
  .then(() => console.log("DB connected"))
  .catch((err: unknown) => console.error("DB error", err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})