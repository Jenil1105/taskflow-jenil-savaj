import { Router } from "express"
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController"

const router = Router({ mergeParams: true })

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task within a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cart API
 *               description:
 *                 type: string
 *                 example: Implement add/remove cart functionality.
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               assignee_id:
 *                 type: string
 *                 example: 9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation failed
 *
 *   get:
 *     summary: Get all tasks for a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         example: c3d4e5f6-3333-4c3d-ae3f-cccccccccccc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 88888888-2222-4222-8222-222222222228
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cart API Updated
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               assignee_id:
 *                 type: string
 *                 example: 9a2b8d63-2b5e-4c6c-8d9f-2b3c4d5e6f02
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Task not found
 *
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 88888888-2222-4222-8222-222222222228
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

router.post("/", createTask)
router.get("/", getTasks)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router