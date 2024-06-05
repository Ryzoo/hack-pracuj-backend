import { ObjectId } from '@fastify/mongodb';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import RoomEntity from './entities/RoomEntity';
import roomSite from './routes/routes-room';

const plugin = fp(
  async (server) => {
    server.decorate('roomContext', async (request: FastifyRequest, reply: FastifyReply) => {
      const siteHeaderValue = decodeURI(
        // @ts-expect-error site is not defined on the request object
        request.params?.roomId ??
        // @ts-expect-error site is not defined on the request object
        request.query?.roomId ??
        // @ts-expect-error site is not defined on the request object
        request.body?.roomId ??
        request.headers['x-room-id'] ??
        '',
      );

      if (siteHeaderValue.length > 0) {
        const db = request.server.mongo.db!;
        const room = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne({
          _id: new ObjectId(siteHeaderValue),
        });

        if (room) {
          request.room = room;
          return;
        }
      }

      return reply.code(403).send({
        message: 'You do not have permission to access this resource without a valid room context',
      });
    });

    server.register(roomSite, { prefix: '/api/v1/room' });
  },
  {
    name: 'core-room',
    dependencies: ['core-database'],
  },
);

export default plugin;
