import { FastifyInstance } from 'fastify';

import WebsocketMessage from '../types/websocket-message';

export type WebsocketService = {
  send: (data: WebsocketMessage, roomId: string) => void;
};

const websocketService = (server: FastifyInstance): WebsocketService => {
  return {
    send: (data: WebsocketMessage, roomId: string) => {
      server.websocketServer.clients.forEach((client) => {
        if(client.readyState === 1){
          // @ts-expect-error client is extended with user property
          if (roomId == client.room._id.toString()) {
            client.send(JSON.stringify(data));
          }
        }
      });
    },
  };
};

export default websocketService;
