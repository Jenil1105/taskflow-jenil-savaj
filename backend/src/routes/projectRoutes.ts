import { Router } from "express"
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController"
import { checkProjectOwner } from "../middlewares/checkProjectOwner"
import taskRoutes from "./taskRoutes"

const router = Router()

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: E-commerce Platform
 *               description:
 *                 type: string
 *                 example: Backend system for product catalog, cart, and order processing.
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation failed
 *
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: c3d4e5f6-3333-4c3d-ae3f-cccccccccccc
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found
 *
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: c3d4e5f6-3333-4c3d-ae3f-cccccccccccc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: E-commerce Platform Updated
 *               description:
 *                 type: string
 *                 example: Updated backend system.
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Project not found
 *
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: c3d4e5f6-3333-4c3d-ae3f-cccccccccccc
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:id", getProjectById)
router.patch("/:id", checkProjectOwner, updateProject)
router.delete("/:id", checkProjectOwner, deleteProject)
router.use("/:id/tasks", taskRoutes)

export default router