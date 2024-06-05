import { Static, Type } from '@sinclair/typebox';

export const ChangeGameSchema = Type.Object({
  gameName: Type.Optional(Type.String({ minLength: 1, maxLength: 50 }))
});

export type ChangeGameSchemaType = Static<typeof ChangeGameSchema>;
