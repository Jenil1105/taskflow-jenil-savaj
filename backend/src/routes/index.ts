import { Router } from "express"
import authRouter from "./authRoutes"
import projectRouter from "./projectRoutes"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.use("/auth", authRouter)
router.use("/projects", authMiddleware, projectRouter)

export default router