import { Router } from "express"
import authRouter from "./authRoutes"
import projectRouter from "./projectRoutes"
import taskRouter from "./taskRoutes"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.use("/auth", authRouter)
router.use("/projects", authMiddleware, projectRouter)
router.use("/tasks", authMiddleware, taskRouter)

export default router