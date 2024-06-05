import compress from '@fastify/compress';
import cors from '@fastify/cors';
import env from '@fastify/env';
import { ajvFilePlugin } from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';

import { EnvSchema } from './plugins/core/schema/env-schema';
import coreDatabasePlugin from './plugins/database';
import roomPlugin from './plugins/room';
import coreSwaggerPlugin from './plugins/swagger';
import coreWebsocketPlugin from './plugins/websocket';

async function main() {
  const server = fastify({
    logger: true,
    exposeHeadRoutes: true,
    trustProxy: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await server.register(compress);
  await server.register(rateLimit, {
    max: 500,
  });
  await server.register(env, {
    dotenv: true,
    schema: EnvSchema,
  });

  await server.register(coreSwaggerPlugin);
  await server.register(coreDatabasePlugin);
  await server.register(roomPlugin);
  await server.register(coreWebsocketPlugin);

  server.listen({ port: 3030, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

void main();
