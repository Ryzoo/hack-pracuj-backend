import swagger from '@fastify/swagger';
import swaggerUi from '@scalar/fastify-api-reference';
import fp from 'fastify-plugin';

const plugin = fp(
  async (server) => {
    await server.register(swagger, {
      swagger: {
        info: {
          title: 'Soft Backend swagger',
          description: 'Swagger API',
          version: server.version,
        },
        host: 'localhost:3030',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    await server.register(swaggerUi, {
      routePrefix: '/api/v1/swagger',
    });
  },
  {
    name: 'core-swagger',
  },
);

export default plugin;
