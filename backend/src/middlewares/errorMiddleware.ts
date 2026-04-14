import { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // Known custom errors
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            error: err.error,
            ...(err.fields && { fields: err.fields })
        })
    }

    // PostgreSQL: Unique constraint violation
    if (err.code === "23505") {
        return res.status(400).json({
            success: false,
            error: "Duplicate entry"
        })
    }

    // PostgreSQL: Foreign key violation
    if (err.code === "23503") {
        return res.status(400).json({
            success: false,
            error: "Invalid reference (foreign key constraint)"
        })
    }

    // PostgreSQL: Not null violation
    if (err.code === "23502") {
        return res.status(400).json({
            success: false,
            error: "Missing required field"
        })
    }

    // Fallback
    logger.error("Internal Server Error", {
        error: err.message,
        stack: err.stack,
        code: err.code
    });

    return res.status(500).json({
        success: false,
        error: "Internal server error"
    })
}