import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/authService"
import { asyncHandler } from "../utils/asycHandler"
import { successResponse, errorResponse } from "../utils/response"


// REGISTER Controller

export const register = asyncHandler(async (req: Request, res: Response, next: any) => {
    const { name, email, password } = req.body

    // validation
    if (!name || !email || !password) {
        return errorResponse(res, 400, "Validation failed", {
            name: !name ? "required" : undefined,
            email: !email ? "required" : undefined,
            password: !password ? "required" : undefined
        })
    }

    const user = await registerUser(name, email, password)

    return successResponse(res, 201, "User registered successfully", user)
})


// LOGIN Controller

export const login = asyncHandler(async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body

    // validation
    if (!email || !password) {
        throw {
            status: 400,
            error: "Validation failed",
            fields: {
                email: !email ? "required" : undefined,
                password: !password ? "required" : undefined
            }
        }
    }

    const user = await loginUser(email, password)

    return successResponse(res, 200, "Login successful", user)
})