import { pool } from "../db"
import { v4 as uuidv4 } from "uuid"

// CREATE project
//_________________________________________________________________________________________________________________________

export const createProjectService = async (
    name: string,
    description: string,
    ownerId: string
) => {
    const id = uuidv4()

    await pool.query(
        `INSERT INTO projects (id, name, description, owner_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
        [id, name, description || null, ownerId]
    )

    return {
        id,
        name,
        description,
        owner_id: ownerId
    }
}

// GET all the projects (owned projects + projects which has task assigned to that user)
//_________________________________________________________________________________________________________________________

export const getProjectsService = async (userId: string) => {
    const result = await pool.query(
        `
        SELECT DISTINCT p.*
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
        WHERE p.owner_id = $1 OR t.assignee_id = $1
        ORDER BY p.created_at DESC
    `,
        [userId]
    )

    return result.rows
}

// GET specific project (owned project + the project which has task assigned to that user)
//_________________________________________________________________________________________________________________________

export const getProjectByIdService = async (projectId: string, userId: string) => {
    // get project (only if user has access)
    const projectResult = await pool.query(
        `
        SELECT DISTINCT p.*
        FROM projects p
        LEFT JOIN tasks t ON p.id = t.project_id
        WHERE p.id = $1
        AND (p.owner_id = $2 OR t.assignee_id = $2)
    `,
        [projectId, userId]
    )

    if (projectResult.rows.length === 0) {
        return null
    }

    const project = projectResult.rows[0]

    // get tasks of project
    const tasksResult = await pool.query(
        `
    SELECT *
    FROM tasks
    WHERE project_id = $1
    ORDER BY created_at DESC
    `,
        [projectId]
    )

    return {
        ...project,
        tasks: tasksResult.rows
    }
}

// UPDATE the project (owner only)
//_________________________________________________________________________________________________________________________

export const updateProjectService = async (
    projectId: string,
    name?: string,
    description?: string
) => {
    const result = await pool.query(
        `
    UPDATE projects
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description)
    WHERE id = $3
    RETURNING *
    `,
        [name || null, description || null, projectId]
    )

    return result.rows[0]
}

// DELETE the project (owner only)
//_________________________________________________________________________________________________________________________

export const deleteProjectService = async (projectId: string) => {
    // delete tasks first (safe approach)
    await pool.query(
        "DELETE FROM tasks WHERE project_id = $1",
        [projectId]
    )

    // delete project
    await pool.query(
        "DELETE FROM projects WHERE id = $1",
        [projectId]
    )

    return 1
}