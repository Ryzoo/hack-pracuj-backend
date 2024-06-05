import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import RoomEntity from '../../entities/RoomEntity';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';

const changeGameHandler: LogicRequestHandler<{ gameName: string }> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { gameName } = req.body;
  const room = req.room as RoomEntity;

  await db
    .collection<RoomEntity>(RoomEntity.ENTITY_NAME)
    .updateOne({
      _id: room._id,
    }, {
      $set: {
        gameName,
      },
    });

  const newRoom = await db
    .collection<RoomEntity>(RoomEntity.ENTITY_NAME)
    .findOne(room._id);

  req.server.websocketService(req.server).send({
    type: WebsocketMessageType.GAME_CHANGED,
    payload: {
      room: newRoom
    }
  }, room._id.toString());

  return res.send();
};

export default changeGameHandler;
