import { LogicRequestHandler } from '../../../core/types/logic-request-handler';
import { CreateRoomSchemaType } from '../../schema/add-site-by-creator-schema';
import RoomEntity from '../../entities/RoomEntity';

const createRoomHandler: LogicRequestHandler<CreateRoomSchemaType> = async (req, res) => {
  const db = req.server.mongo.db!;

  const newRoom = new RoomEntity({
    hostName: req.body.hostName,
  });

  const roomData = await db
    .collection<RoomEntity>(RoomEntity.ENTITY_NAME)
    .insertOne(newRoom);

  return res.send({
    id: roomData.insertedId.toString(),
  });
};

export default createRoomHandler;
