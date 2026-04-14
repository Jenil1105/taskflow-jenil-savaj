import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger"

const JWT_SECRET = process.env.JWT_SECRET as string

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        logger.debug("Auth header received", { authHeader: authHeader ? "present" : "missing" });
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "unauthorized" })
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, JWT_SECRET) as {
            user_id: string
            email: string
        }

        // attach user to request
        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({ error: "unauthorized" })
    }
}