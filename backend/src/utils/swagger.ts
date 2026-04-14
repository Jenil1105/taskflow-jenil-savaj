import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TaskFlow API",
            version: "1.0.0",
            description: `
                API documentation for TaskFlow backend.

                How to authenticate in Swagger UI:

                1. Call \`POST /api/auth/login\` with a seeded user.
                2. Copy the JWT token from the response.
                3. Click the \`Authorize\` button at the top right.
                4. Enter \`<token>\`.
                5. Use protected project and task endpoints directly from Swagger UI.
            `,
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
        "./src/routes/*.ts",
        "./dist/routes/*.js"
    ], // where annotations will be
};

export const swaggerSpec = swaggerJSDoc(options);
