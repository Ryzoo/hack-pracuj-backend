import { Static, Type } from '@sinclair/typebox';

export const AddUserSchema = Type.Object({
  userName: Type.String({ minLength: 1, maxLength: 50 }),
});

export type AddUserSchemaType = Static<typeof AddUserSchema>;
