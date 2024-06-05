import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';
import RoomEntity from '../../entities/RoomEntity';

const deleteRoomHandler: LogicRequestHandler<never> = async (req, res) => {
  const db = req.server.mongo.db!;
  const room = req.room as RoomEntity;

  await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).deleteOne(room);

  const newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(room._id);

  req.server.websocketService(req.server).send(
    {
      type: WebsocketMessageType.ROOM_REMOVED,
      payload: {
        room: newRoom,
      },
    },
    room._id.toString(),
  );

  return res.send({});
};

export default deleteRoomHandler;
