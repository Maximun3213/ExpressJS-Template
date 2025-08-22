import env from '@/config/env.config'
import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger test API',
      version: '1.0.0',
      description: 'API documentation with Swagger for Express.js'
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/apis/**/*.swagger.ts']
}

const swaggerSpec = swaggerJSDoc(options)

function swaggerDocs(app: express.Application, port: number) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  console.log(`📚 Swagger Docs available at http://localhost:${port}/api-docs`)
}

export default swaggerDocs
