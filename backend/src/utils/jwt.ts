import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET as string

export const generateToken = (userId: string, email: string) => {
    return jwt.sign(
        { user_id: userId, email },
        JWT_SECRET,
        { expiresIn: "24h" }
    )
}