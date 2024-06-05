import { Static, Type } from '@sinclair/typebox';

export const ChangeActiveUsersSchema = Type.Object({
  users: Type.Array(Type.String({ minLength: 1, maxLength: 50 })),
});

export type ChangeActiveUsersSchemaType = Static<typeof ChangeActiveUsersSchema>;
