import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';

import websocketService from './services/websocket-service';

const plugin = fp(
  async (server) => {
    await server.register(websocket, {
      options: {
        clientTracking: true,
      },
    });

    server.get(
      '/api/v1/websocket/:roomId',
      {
        websocket: true,
        onRequest: [server.roomContext],
        schema: {
          description: 'Websocket server',
          tags: ['Websocket'],
          consumes: ['websocket'],
        },
      },
      (connection, req) => {
        if (req && req.room && connection) {
          connection.room = req.room;
        }
      },
    );

    server.decorate('websocketService', websocketService);
  },
  {
    name: 'core-websocket',
  },
);

export default plugin;
