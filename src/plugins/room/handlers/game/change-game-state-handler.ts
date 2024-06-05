import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';
import RoomEntity from '../../entities/RoomEntity';

const changeGameHandler: LogicRequestHandler<{ gameState: any }> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { gameState } = req.body;
  const room = req.room as RoomEntity;

  await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
    {
      _id: room._id,
    },
    {
      $set: {
        gameState,
      },
    },
  );

  const newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(room._id);

  req.server.websocketService(req.server).send(
    {
      type: WebsocketMessageType.GAME_STATE_CHANGED,
      payload: {
        room: newRoom,
      },
    },
    room._id.toString(),
  );

  return res.send();
};

export default changeGameHandler;
