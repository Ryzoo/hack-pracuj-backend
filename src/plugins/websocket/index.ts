import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';

import websocketService from './services/websocket-service';
import RoomEntity from '../room/entities/RoomEntity';
import { WebsocketMessageType } from './types/websocket-message';

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
          connection.userName = '';

          connection.pingInterval = setInterval(() => {
            connection.ping();
          }, 3000);

          connection.closeTimeout = setTimeout(() => {
            connection.terminate();
          }, 10000);

          connection.on('pong', () => {
            if(connection.closeTimeout) {
              clearTimeout(connection.closeTimeout);
            }
            connection.closeTimeout = setTimeout(() => {
              connection.terminate();
            }, 10000);
          });

          connection.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === 'userName') {
              connection.userName = message.payload;
            }
          });

          connection.on('close', async () => {
            if(connection.pingInterval) {
              clearInterval(connection.pingInterval);
            }
            if(connection.closeTimeout) {
              clearTimeout(connection.closeTimeout);
            }

            const db = req.server.mongo.db!;
            await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
              {
                _id: connection.room._id,
              },
              {
                $pull: {
                  users: connection.userName,
                  activeUsers: connection.userName,
                },
              },
            );

            let newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(connection.room._id);

            if(newRoom?.users && newRoom?.users?.length > 0 && !newRoom.users.includes(newRoom.hostName)) {
              await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
                {
                  _id: connection.room._id,
                },
                {
                  $set: {
                    hostName: newRoom?.users[0],
                    gameState: undefined,
                    gameName: undefined,
                  },
                },
              );

              newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(connection.room._id);
            }

            req.server.websocketService(req.server).send(
              {
                type: WebsocketMessageType.USER_EXIT,
                payload: {
                  room: newRoom,
                },
              },
              connection.room._id.toString(),
            );
          });
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
