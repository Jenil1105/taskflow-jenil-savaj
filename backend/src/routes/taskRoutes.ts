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
 *         example: a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa
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
 *                 example: 8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
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
 *         example: a1b2c3d4-1111-4a1b-8c1d-aaaaaaaaaaaa
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
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
 *         example: 11111111-aaaa-4aaa-8aaa-aaaaaaaaaaa1
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
 *                 example: 8f1a7c52-1a4d-4f5b-9c8e-1a2b3c4d5e01
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *         example: 11111111-aaaa-4aaa-8aaa-aaaaaaaaaaa1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */

router.post("/", createTask)
router.get("/", getTasks)
router.patch("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router