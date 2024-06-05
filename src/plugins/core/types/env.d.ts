import { FastifyJwtNamespace } from '@fastify/jwt';
import { Transporter } from 'nodemailer';

import RoomEntity from '../../room/entities/RoomEntity';
import websocketService from '../../websocket/services/websocket-service';
import { EnvSchemaType } from '../schema/env-schema';

export interface FastifyMailerNamedInstance {
  [namespace: string]: Transporter;
}
export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'security' }> {
    config: EnvSchemaType;
    mailer: FastifyMailer;
    roomContext: any;
    websocketService: typeof websocketService;
  }

  interface FastifyRequest {
    room: RoomEntity;
  }
}

declare module 'ws' {
  interface WebSocket {
    room: RoomEntity;
    userName: string;
    closeTimeout?: NodeJS.Timeout;
    pingInterval: NodeJS.Timeout;
  }
}
