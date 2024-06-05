import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';
import RoomEntity from '../../entities/RoomEntity';

const removeUserHandler: LogicRequestHandler<never, { userName: string }> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { userName } = req.query;
  const room = req.room as RoomEntity;

  if ((room.users ?? []).includes(userName)) {
    await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
      {
        _id: room._id,
      },
      {
        $pull: {
          users: userName,
        },
      },
    );

    const newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(room._id);

    req.server.websocketService(req.server).send(
      {
        type: WebsocketMessageType.USER_EXIT,
        payload: {
          room: newRoom,
        },
      },
      room._id.toString(),
    );
  }

  return res.send({});
};

export default removeUserHandler;
