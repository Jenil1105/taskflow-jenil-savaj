import { pool } from "../db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt"


// REGISTER Service

export const registerUser = async (name: string, email: string, password: string) => {

    // check existing user
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    )

    if (existingUser.rows.length > 0) {
        throw {
            status: 400,
            error: "validation failed",
            fields: { email: "already exists" }
        }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const id = uuidv4()

    // add user in the DB
    await pool.query(
        `INSERT INTO users (id, name, email, password, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
        [id, name, email, hashedPassword]
    )

    return { id, name, email }
}

// LOGIN Service

export const loginUser = async (email: string, password: string) => {

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )

    if (result.rows.length === 0) {
        throw {
            status: 401,
            error: "invalid credentials"
        }
    }

    const user = result.rows[0]

    // compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw {
            status: 401,
            error: "invalid credentials"
        }
    }

    // generate jwt token
    const token = generateToken(user.id, user.email)

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}