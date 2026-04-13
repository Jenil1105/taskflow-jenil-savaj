import { Request, Response } from "express"
import { createProjectService, getProjectsService, getProjectByIdService, updateProjectService, deleteProjectService } from "../services/projectService"
import { successResponse, errorResponse } from "../utils/response"

// CREATE project
//_________________________________________________________________________________________________________________________

export const createProject = async (req: any, res: Response) => {
    try {
        const { name, description } = req.body
        const userId = req.user.user_id

        if (!name?.trim()) {
            return errorResponse(res, 400, "Validation failed", {
                name: "required"
            })
        }

        const project = await createProjectService(name, description, userId)

        return successResponse(res, 201, "Project created successfully", project)

    } catch (err: any) {
        console.error(err)
        return errorResponse(res, 500, "Internal server error")
    }
}


// GET all the projects (owned projects + projects which has task assigned to that user)
//_________________________________________________________________________________________________________________________

export const getProjects = async (req: any, res: Response) => {
    try {
        const userId = req.user.user_id
        const projects = await getProjectsService(userId)

        return successResponse(res, 200, "Projects fetched successfully", projects)

    } catch (err) {
        console.error(err)
        return errorResponse(res, 500, "Internal server error")
    }
}


// GET specific project (owned project + the project which has task assigned to that user)
//_________________________________________________________________________________________________________________________

export const getProjectById = async (req: any, res: Response) => {
    try {
        const projectId = req.params.id
        const userId = req.user.user_id

        if (!projectId) {
            return errorResponse(res, 400, "Invalid project id")
        }

        const project = await getProjectByIdService(projectId, userId)

        if (!project) {
            return errorResponse(res, 404, "Project not found")
        }

        return successResponse(res, 200, "Project fetched successfully", project)

    } catch (err) {
        console.error(err)
        return errorResponse(res, 500, "Internal server error")
    }
}


// UPDATE the project (owner only)
//_________________________________________________________________________________________________________________________


export const updateProject = async (req: any, res: Response) => {
    try {
        const projectId = req.params.id
        const { name, description } = req.body

        if (!name && !description) {
            return errorResponse(res, 400, "Validation failed", {
                message: "Nothing to update"
            })
        }

        const project = await updateProjectService(projectId, name, description)

        if (!project) {
            return errorResponse(res, 404, "Project not found")
        }

        return successResponse(res, 200, "Project updated successfully", project)

    } catch (err) {
        console.error(err)
        return errorResponse(res, 500, "Internal server error")
    }
}


// DELETE the project (owner only)
//_________________________________________________________________________________________________________________________

export const deleteProject = async (req: any, res: Response) => {
    try {
        const projectId = req.params.id

        const deleted = await deleteProjectService(projectId)

        if (!deleted) {
            return errorResponse(res, 404, "Project not found")
        }

        return successResponse(res, 200, "Project deleted successfully")

    } catch (err) {
        console.error(err)
        return errorResponse(res, 500, "Internal server error")
    }
}