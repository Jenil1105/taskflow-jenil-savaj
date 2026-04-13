import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/authService"
import { asyncHandler } from "../utils/asycHandler"


// REGISTER Controller

export const register = asyncHandler(async (req: Request, res: Response, next: any) => {

    const { name, email, password } = req.body

    // validation
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "validation failed",
            fields: {
                name: !name ? "required" : undefined,
                email: !email ? "required" : undefined,
                password: !password ? "required" : undefined
            }
        })
    }

    // call register service
    const user = await registerUser(name, email, password)

    return res.status(201).json(user)

})


// LOGIN Controller

export const login = asyncHandler(async (req: any, res: any, next: any) => {

    const { email, password } = req.body

    // validation
    if (!email || !password) {
        return res.status(400).json({
            error: "validation failed",
            fields: {
                email: !email ? "required" : undefined,
                password: !password ? "required" : undefined
            }
        })
    }

    // call login service
    const user = await loginUser(email, password)

    return res.json(user)
})