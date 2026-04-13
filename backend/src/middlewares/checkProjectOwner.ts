import { Request, Response, NextFunction } from "express"
import { pool } from "../db"

export const checkProjectOwner = async (req: any, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id
        const userId = req.user.user_id

        const result = await pool.query(
            "SELECT owner_id FROM projects WHERE id = $1",
            [projectId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "not found" })
        }

        if (result.rows[0].owner_id !== userId) {
            return res.status(403).json({ error: "forbidden" })
        }

        next()

    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "internal server error" })
    }
}