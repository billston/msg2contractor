import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Message2Contractor API',
    version: '1.0.0',
    description: 'API para el sistema de comunicados y notificaciones',
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  components: {
    schemas: {
      Receptor: {
        type: 'object',
        properties: {
          codigo: {
            type: 'string',
            description: 'Código del receptor',
          },
          nombreCompleto: {
            type: 'string',
            description: 'Nombre completo del receptor',
          },
          correoElectronico: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del receptor',
          },
        },
        required: ['codigo', 'nombreCompleto', 'correoElectronico'],
      },
      Grupo: {
        type: 'object',
        properties: {
          nombre: {
            type: 'string',
            description: 'Nombre del grupo',
          },
        },
        required: ['nombre'],
      },
      Comunicado: {
        type: 'object',
        properties: {
          tipoReceptor: {
            type: 'integer',
            enum: [1, 2],
            description: '1: individual, 2: grupo',
          },
          idGrupoReceptor: {
            type: 'integer',
            description: 'ID del grupo receptor (solo cuando tipoReceptor = 2)',
          },
          destinatario: {
            type: 'string',
            description: 'IDs de receptores separados por ; (solo cuando tipoReceptor = 1)',
          },
          asunto: {
            type: 'string',
            description: 'Asunto del comunicado',
          },
          contenido: {
            type: 'string',
            description: 'Contenido HTML del comunicado',
          },
          fechaVencimiento: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de vencimiento del comunicado',
          },
          confirmacionRecepcion: {
            type: 'boolean',
            description: 'Indica si requiere confirmación de recepción',
          },
          solicitarRespuesta: {
            type: 'boolean',
            description: 'Indica si requiere respuesta',
          },
        },
        required: ['tipoReceptor', 'asunto', 'contenido', 'confirmacionRecepcion', 'solicitarRespuesta'],
      },
      Respuesta: {
        type: 'object',
        properties: {
          respuesta: {
            type: 'string',
            description: 'Contenido HTML de la respuesta',
          },
        },
        required: ['respuesta'],
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);