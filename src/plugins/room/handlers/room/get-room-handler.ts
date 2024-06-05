import { ObjectId } from '@fastify/mongodb';

import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import RoomEntity from '../../entities/RoomEntity';

const getRoomHandler: LogicRequestHandler<never, never, { id: string }> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { id } = req.params;

  const roomData = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne({
    _id: new ObjectId(id),
  });

  if (!roomData) {
    return res.code(404).send({
      message: 'Room not found',
    });
  }

  return res.send(roomData);
};

export default getRoomHandler;
