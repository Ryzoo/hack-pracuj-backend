import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { WebsocketMessageType } from '../../../websocket/types/websocket-message';
import RoomEntity from '../../entities/RoomEntity';
import { AddUserSchemaType } from '../../schema/add-user-schema';

const addUserHandler: LogicRequestHandler<AddUserSchemaType> = async (req, res) => {
  const db = req.server.mongo.db!;
  const { userName } = req.body;
  const room = req.room as RoomEntity;

  if (!(room.users ?? []).includes(userName)) {
    await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).updateOne(
      {
        _id: room._id,
      },
      {
        $push: {
          users: userName,
        },
      },
    );

    const newRoom = await db.collection<RoomEntity>(RoomEntity.ENTITY_NAME).findOne(room._id);

    req.server.websocketService(req.server).send(
      {
        type: WebsocketMessageType.USER_JOINED,
        payload: {
          room: newRoom,
        },
      },
      room._id.toString(),
    );
  }

  return res.send({});
};

export default addUserHandler;
