import { Static, Type } from '@sinclair/typebox';

export const CreateRoomSchema = Type.Object({
  hostName: Type.String({ minLength: 1, maxLength: 50 }),
});

export type CreateRoomSchemaType = Static<typeof CreateRoomSchema>;
