import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for local dev
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format:
                process.env.NODE_ENV === "production"
                    ? combine(timestamp(), json())
                    : combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
        }),
    ],
});
