import swaggerJsdoc from "swagger-jsdoc";
import config from ".";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DomainGurad API",
      version: "1.0.0",
      description: "Spam domain detection API",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.ts"],
});
