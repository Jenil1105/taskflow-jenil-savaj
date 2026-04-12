import { Router } from "express"
import authRoutes from "./authRoutes"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.use("/auth", authRoutes)

export default router