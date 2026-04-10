import swaggerJsdoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sis Req API",
      version: "1.0.0",
      description: "API para gestão de requisições e pregões",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Autenticação e gerenciamento de usuário",
      },
      {
        name: "Pregoes",
        description: "Gestão de pregões e atas",
      },
      {
        name: "Requisicoes",
        description: "Gestão de requisições e itens",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
})