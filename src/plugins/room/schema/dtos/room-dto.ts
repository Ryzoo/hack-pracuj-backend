import { Static, Type } from '@sinclair/typebox';

export const RoomDtoSchema = Type.Object({
  _id: Type.String({ minLength: 24, maxLength: 24 }),
  hostName: Type.String({ minLength: 1, maxLength: 50 }),
  users: Type.Optional(Type.Array( Type.String({ minLength: 1, maxLength: 50 }))),
  lastActivity: Type.Optional(Type.String()),
  gameName: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  gameState: Type.Any(),
});

export type RoomDto = Static<typeof RoomDtoSchema>;
