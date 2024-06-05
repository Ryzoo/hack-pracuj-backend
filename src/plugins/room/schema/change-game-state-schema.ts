import { Static, Type } from '@sinclair/typebox';

export const ChangeGameStateSchema = Type.Object({
  gameState: Type.Any(),
});

export type ChangeGameStateSchemaType = Static<typeof ChangeGameStateSchema>;
