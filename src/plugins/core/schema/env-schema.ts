import { Static, Type } from '@sinclair/typebox';

export const EnvSchema = Type.Object({
  MONGODB_URI: Type.String(),
  MONGODB_DB_NAME: Type.String(),
});

export type EnvSchemaType = Static<typeof EnvSchema>;
