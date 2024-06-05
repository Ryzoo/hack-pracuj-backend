import { FastifyInstance } from 'fastify';

import {
  getBadRequestDefinition,
  getBusinessRequestDefinition,
} from '../../core/schema/request';
import createRoomHandler from '../handlers/room/create-room-handler';
import { RoomDtoSchema } from '../schema/dtos/room-dto';
import getRoomHandler from '../handlers/room/get-room-handler';
import deleteRoomHandler from '../handlers/room/delete-room-handler';
import addUserHandler from '../handlers/user/add-user-handler';
import removeUserHandler from '../handlers/user/remove-user-handler';
import changeGameHandler from '../handlers/game/change-game-handler';
import changeGameStateHandler from '../handlers/game/change-game-state-handler';
import { ChangeGameStateSchema } from '../schema/change-game-state-schema';
import { ChangeGameSchema } from '../schema/change-game-schema';
import { CreateRoomSchema } from '../schema/create-room-schema';

const routes = async (server: FastifyInstance) => {
  const createRoomSchema = {
    schema: {
      description: 'Create room for game',
      tags: ['Room'],
      body: CreateRoomSchema,
      response: {
        200: {
          description: 'Room',
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };
  const getRoomSchema = {
    schema: {
      description: 'Get room for game',
      tags: ['Room'],
      querystring: {
        id: { type: 'string' },
      },
      response: {
        200: {
          description: 'Room',
          type: 'object',
          properties: RoomDtoSchema.properties,
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };


  const deleteRoomSchema = {
    onRequest: [server.roomContext],
    schema: {
      description: 'Delete room',
      tags: ['Room'],
      response: {
        200: {
          description: 'Room deleted',
          type: 'object',
          properties: {},
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };


  const removeUserFromRoomSchema = {
    onRequest: [server.roomContext],
    schema: {
      description: 'Remove user from room',
      tags: ['Room'],
      querystring: {
        userName: { type: 'string' },
      },
      response: {
        200: {
          description: 'User removed',
          type: 'object',
          properties: {},
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };

  const addUserToRoomSchema = {
    onRequest: [server.roomContext],
    schema: {
      description: 'Add user to room',
      tags: ['Room'],
      body: {
        type: 'object',
        properties: {
          userName: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'User added',
          type: 'object',
          properties: {},
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };

  const changeGameSchema = {
    onRequest: [server.roomContext],
    schema: {
      description: 'Change game in room',
      tags: ['Room'],
      body: ChangeGameSchema,
      response: {
        200: {
          description: 'Game changed',
          type: 'object',
          properties: {},
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };

  const changeGameStateSchema = {
    onRequest: [server.roomContext],
    schema: {
      description: 'Change game state in room',
      tags: ['Room'],
      body: ChangeGameStateSchema,
      response: {
        200: {
          description: 'Game state changed',
          type: 'object',
          properties: {},
        },
        400: getBadRequestDefinition(),
        409: getBusinessRequestDefinition(),
      },
    },
  };

  // room management
  server.get('/:id', getRoomSchema, getRoomHandler);
  server.post('', createRoomSchema, createRoomHandler);
  server.delete('', deleteRoomSchema, deleteRoomHandler);

  // user management
  server.put('/user', addUserToRoomSchema, addUserHandler);
  server.delete('/user', removeUserFromRoomSchema, removeUserHandler);

  // game management
  server.put('/game', changeGameSchema, changeGameHandler);
  server.put('/game/state', changeGameStateSchema, changeGameStateHandler);
};

export default routes;
