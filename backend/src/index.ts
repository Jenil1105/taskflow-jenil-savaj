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

app.use((req, res, next) => {
  res.status(404).json({ error: "not found" });
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

pool.connect()
  .then(() => logger.info("DB connected"))
  .catch((err: unknown) => logger.error("DB error", { error: err instanceof Error ? err.message : String(err) }))

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info("Shutdown signal received: closing HTTP server");

  server.close(() => {
    logger.info("HTTP server closed.");

    // Close Database pool
    pool.end().then(() => {
      logger.info("PostgreSQL pool closed.");
      process.exit(0);
    }).catch((err) => {
      logger.error("Error during PostgreSQL pool closure", { error: err instanceof Error ? err.message : String(err) });
      process.exit(1);
    });
  });

  // Force shutdown if it takes too long (e.g. 10 secs)
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);