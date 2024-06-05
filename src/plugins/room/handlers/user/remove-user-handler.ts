import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import RoomEntity from '../../entities/RoomEntity';

const addUserHandler: LogicRequestHandler<{ userName: string }> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { userName } = req.body;
  const room = req.room as RoomEntity;

  if(!(room.users ?? []).includes(userName)){
    await db
      .collection<RoomEntity>(RoomEntity.ENTITY_NAME)
      .updateOne({
        _id: room._id,
      }, {
        $push: {
          users: userName,
        },
      });
  }

  return res.send(});
};

export default addUserHandler;
