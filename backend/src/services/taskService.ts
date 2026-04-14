import { pool } from "../db"
import { v4 as uuidv4 } from "uuid"


// CREATE task (owner + member of that project)
//_________________________________________________________________________________________________________________________

export const createTaskService = async ({
    title,
    description,
    priority,
    assignee_id,
    projectId,
    userId
}: any) => {

    // check access to project
    const access = await pool.query(
        "SELECT owner_id FROM projects WHERE id = $1",
        [projectId]
    )

    if (access.rows.length === 0) {
        throw { status: 404, error: "not found" }
    }

    const isOwner = access.rows[0].owner_id === userId

    if (!isOwner) {
        const taskAccess = await pool.query(
            "SELECT 1 FROM tasks WHERE project_id = $1 AND assignee_id = $2",
            [projectId, userId]
        )

        if (taskAccess.rows.length === 0) {
            throw { status: 403, error: "forbidden" }
        }
    }

    const id = uuidv4()

    const result = await pool.query(
        `
    INSERT INTO tasks (
      id, title, description, status, priority,
      project_id, assignee_id, created_at, updated_at
    )
    VALUES ($1, $2, $3, 'todo', $4, $5, $6, NOW(), NOW())
    RETURNING *
    `,
        [
            id,
            title,
            description || null,
            priority || "medium",
            projectId,
            assignee_id || null
        ]
    )

    return result.rows[0]
}


// GET all tasks associated with project with filter
//_________________________________________________________________________________________________________________________

export const getTasksService = async ({
    projectId,
    userId,
    status,
    assignee,
    page = 1,
    limit = 10
}: any) => {

    // check access
    const project = await pool.query(
        "SELECT owner_id FROM projects WHERE id = $1",
        [projectId]
    )

    if (project.rows.length === 0) {
        throw { status: 404, error: "not found" }
    }

    const isOwner = project.rows[0].owner_id === userId

    if (!isOwner) {
        const access = await pool.query(
            "SELECT 1 FROM tasks WHERE project_id = $1 AND assignee_id = $2",
            [projectId, userId]
        )

        if (access.rows.length === 0) {
            throw { status: 403, error: "forbidden" }
        }
    }

    // dynamic query building
    let countQuery = `SELECT COUNT(*) FROM tasks WHERE project_id = $1`
    let query = `
    SELECT *
    FROM tasks
    WHERE project_id = $1
  `

    const values: any[] = [projectId]
    let index = 2

    if (status) {
        query += ` AND status = $${index}`
        countQuery += ` AND status = $${index}`
        values.push(status)
        index++
    }

    if (assignee) {
        query += ` AND assignee_id = $${index}`
        countQuery += ` AND assignee_id = $${index}`
        values.push(assignee)
        index++
    }

    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    query += ` ORDER BY created_at DESC LIMIT $${index} OFFSET $${index + 1}`
    const offset = (page - 1) * limit;
    values.push(limit, offset)

    const result = await pool.query(query, values)

    return {
        data: result.rows,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    }
}


// UPDATE task
//_________________________________________________________________________________________________________________________

export const updateTaskService = async ({
    taskId,
    userId,
    title,
    description,
    status,
    priority,
    assignee_id,
    due_date
}: any) => {

    // get task
    const taskResult = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    )

    if (taskResult.rows.length === 0) {
        throw { status: 404, error: "not found" }
    }

    const task = taskResult.rows[0]

    // check access (project owner OR task assignee)
    const project = await pool.query(
        "SELECT owner_id FROM projects WHERE id = $1",
        [task.project_id]
    )

    const isOwner = project.rows[0].owner_id === userId
    const isAssignee = task.assignee_id === userId

    if (!isOwner && !isAssignee) {
        throw { status: 403, error: "forbidden" }
    }

    // update
    const result = await pool.query(
        `
            UPDATE tasks
            SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            priority = COALESCE($4, priority),
            assignee_id = COALESCE($5, assignee_id),
            due_date = COALESCE($6, due_date),
            updated_at = NOW()
            WHERE id = $7
            RETURNING *
        `,
        [
            title || null,
            description || null,
            status || null,
            priority || null,
            assignee_id || null,
            due_date || null,
            taskId
        ]
    )

    return result.rows[0]
}


// DELETE task
//_________________________________________________________________________________________________________________________

export const deleteTaskService = async (taskId: string, userId: string) => {

    // get task
    const taskResult = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    )

    if (taskResult.rows.length === 0) {
        throw { status: 404, error: "not found" }
    }

    const task = taskResult.rows[0]

    // check access (project owner OR task assignee)
    const project = await pool.query(
        "SELECT owner_id FROM projects WHERE id = $1",
        [task.project_id]
    )

    const isOwner = project.rows[0].owner_id === userId
    const isAssignee = task.assignee_id === userId

    if (!isOwner && !isAssignee) {
        throw { status: 403, error: "forbidden" }
    }

    // delete task
    await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [taskId]
    )

    return 1
}