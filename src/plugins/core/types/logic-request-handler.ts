import { FastifyReply, FastifyRequest } from 'fastify';

export type LogicRequestHandler<T, H = undefined, D = T> = (
  req: FastifyRequest<{ Body: T; Querystring: H; Params: D }>,
  res: FastifyReply,
) => Promise<void>;
