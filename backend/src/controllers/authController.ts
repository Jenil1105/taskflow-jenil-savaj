import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/authService"

// REGISTER Controller

export const register = async (req: Request, res: Response) => {
    try {
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

    } catch (err: any) {
        if (err.status) {
            return res.status(err.status).json({
                error: err.error,
                fields: err.fields
            })
        }

        console.error(err)
        return res.status(500).json({ error: "internal server error" })
    }
}


// LOGIN Controller

export const login = async (req: any, res: any) => {
    try {
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

    } catch (err: any) {
        if (err.status) {
            return res.status(err.status).json({ error: err.error })
        }

        console.error(err)
        return res.status(500).json({ error: "internal server error" })
    }
}