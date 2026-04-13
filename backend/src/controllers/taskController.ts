import { createTaskService, getTasksService, updateTaskService, deleteTaskService } from "../services/taskService"
import { Response } from "express"
import { successResponse, errorResponse } from "../utils/response"


// CREATE task (owner + member of that project)
//_________________________________________________________________________________________________________________________

export const createTask = async (req: any, res: Response) => {
    try {
        const projectId = req.params.id
        const userId = req.user.user_id

        const { title, description, priority, assignee_id } = req.body

        if (!title?.trim()) {
            return errorResponse(res, 400, "Validation failed", {
                title: "required"
            })
        }

        const task = await createTaskService({
            title: title.trim(),
            description,
            priority,
            assignee_id,
            projectId,
            userId
        })

        return successResponse(res, 201, "Task created successfully", task)

    } catch (err: any) {
        console.error(err)

        // Handle custom service errors
        if (err.status) {
            return errorResponse(res, err.status, err.error)
        }

        return errorResponse(res, 500, "Internal server error")
    }
}


// GET all tasks associated with project with filter
//_________________________________________________________________________________________________________________________

export const getTasks = async (req: any, res: Response) => {
    try {
        const projectId = req.params.id
        const userId = req.user.user_id

        // Query params always come as strings
        const status = req.query.status as string | undefined
        const assignee = req.query.assignee
            ? Number(req.query.assignee)
            : undefined

        const tasks = await getTasksService({
            projectId,
            userId,
            status,
            assignee
        })

        return successResponse(res, 200, "Tasks fetched successfully", tasks)

    } catch (err: any) {
        console.error(err)

        if (err.status) {
            return errorResponse(res, err.status, err.error)
        }

        return errorResponse(res, 500, "Internal server error")
    }
}


// UPDATE task
//_________________________________________________________________________________________________________________________

export const updateTask = async (req: any, res: Response) => {
    try {
        const taskId = req.params.id
        const userId = req.user.user_id

        let {
            title,
            description,
            status,
            priority,
            assignee_id,
            due_date
        } = req.body

        // Normalize inputs
        title = title?.trim()
        assignee_id = assignee_id ? assignee_id : undefined
        due_date = due_date ? new Date(due_date) : undefined

        if (due_date && isNaN(due_date.getTime())) {
            return errorResponse(res, 400, "Invalid due date")
        }

        // Nothing to update check
        if (
            !title &&
            !description &&
            !status &&
            !priority &&
            assignee_id === undefined &&
            !due_date
        ) {
            return errorResponse(res, 400, "Validation failed", {
                message: "Nothing to update"
            })
        }

        // enum validation
        const validStatus = ["todo", "in_progress", "done"]
        if (status && !validStatus.includes(status)) {
            return errorResponse(res, 400, "Invalid status")
        }

        const validPriority = ["low", "medium", "high"]
        if (priority && !validPriority.includes(priority)) {
            return errorResponse(res, 400, "Invalid priority")
        }

        const task = await updateTaskService({
            taskId,
            userId,
            title,
            description,
            status,
            priority,
            assignee_id,
            due_date
        })

        if (!task) {
            return errorResponse(res, 404, "Task not found")
        }

        return successResponse(res, 200, "Task updated successfully", task)

    } catch (err: any) {
        console.error(err)

        if (err.status) {
            return errorResponse(res, err.status, err.error)
        }

        return errorResponse(res, 500, "Internal server error")
    }
}

// DELETE task
//_________________________________________________________________________________________________________________________

export const deleteTask = async (req: any, res: Response) => {
    try {
        const taskId = req.params.id
        const userId = req.user.user_id

        const deleted = await deleteTaskService(taskId, userId)

        if (!deleted) {
            return errorResponse(res, 404, "Task not found")
        }

        return successResponse(res, 200, "Task deleted successfully")

    } catch (err: any) {
        console.error(err)

        if (err.status) {
            return errorResponse(res, err.status, err.error)
        }

        return errorResponse(res, 500, "Internal server error")
    }
}