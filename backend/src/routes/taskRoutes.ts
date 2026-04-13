import { Router } from "express"
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController"

const router = Router({ mergeParams: true })

router.post("/", createTask)
router.get("/", getTasks)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router