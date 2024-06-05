import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';
import RoomEntity from '../../entities/RoomEntity';
import { ChangeActiveUsersSchemaType } from '../../schema/change-active-users-schema';

const changeActiveUsersChandler: LogicRequestHandler<ChangeActiveUsersSchemaType> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { users } = req.body;
  const room = req.room as RoomEntity;

  await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
    {
      _id: room._id,
    },
    {
      $set: {
        activeUsers: users,
      },
    },
  );

  const newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(room._id);

  req.server.websocketService(req.server).send(
    {
      type: WebsocketMessageType.ACTIVE_USERS_CHANGED,
      payload: {
        room: newRoom,
      },
    },
    room._id.toString(),
  );

  return res.send({});
};

export default changeActiveUsersChandler;
