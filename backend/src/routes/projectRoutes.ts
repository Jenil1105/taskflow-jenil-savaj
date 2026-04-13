import { Router } from "express"
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController"
import { checkProjectOwner } from "../middlewares/checkProjectOwner"
import taskRoutes from "./taskRoutes"

const router = Router()

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:id", getProjectById)
router.patch("/:id", checkProjectOwner, updateProject)
router.delete("/:id", checkProjectOwner, deleteProject)
router.use("/:id/tasks", taskRoutes)

export default router