import mongodbProvider from '@fastify/mongodb';
import fp from 'fastify-plugin';

const plugin = fp(
  async (server) => {
    await server.register(mongodbProvider, {
      forceClose: true,
      url: server.config.MONGODB_URI,
      database: server.config.MONGODB_DB_NAME,
    });
  },
  {
    name: 'core-database',
  },
);

export default plugin;
