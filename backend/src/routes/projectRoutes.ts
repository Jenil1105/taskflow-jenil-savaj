import { Router } from "express"
import { createProject, getProjects, getProjectById, updateProject, deleteProject, getProjectStats } from "../controllers/projectController"
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
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       401:
 *         description: Unauthorized
 *
 * /api/projects/{id}/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa
 *     responses:
 *       200:
 *         description: Project stats fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
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
 *         example: a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *         example: a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *         example: b2c3d4e5-2222-4b2c-9d2e-bbbbbbbbbbbb
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:id/stats", getProjectStats)
router.get("/:id", getProjectById)
router.patch("/:id", checkProjectOwner, updateProject)
router.delete("/:id", checkProjectOwner, deleteProject)
router.use("/:id/tasks", taskRoutes)

export default router