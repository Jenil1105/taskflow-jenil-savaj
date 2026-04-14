import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { pool } from "./db"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import routes from "./routes/index"
import { errorMiddleware } from "./middlewares/errorMiddleware";
import morgan from "morgan";
import { logger } from "./utils/logger";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ message: "Server running..." })
})

app.use("/api", routes);
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

pool.connect()
  .then(() => logger.info("DB connected"))
  .catch((err: unknown) => logger.error("DB error", { error: err instanceof Error ? err.message : String(err) }))

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})