import { Static, Type } from '@sinclair/typebox';

export const BadRequestSchema = Type.Object({
  statusCode: Type.Number(),
  code: Type.String(),
  error: Type.String(),
  message: Type.String(),
});

export type BadRequestSchemaType = Static<typeof BadRequestSchema>;

export const getBadRequestDefinition = () => ({
  description: 'Not valid request',
  type: 'object',
  properties: BadRequestSchema.properties,
});

export const getNotAuthenticatedRequestDefinition = () => ({
  description: 'Not authenticated',
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
});

export const getBusinessRequestDefinition = () => ({
  description: 'Business error',
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
});
