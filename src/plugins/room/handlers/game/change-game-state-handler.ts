import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import RoomEntity from '../../entities/RoomEntity';

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

  return res.send();
};

export default changeGameHandler;
