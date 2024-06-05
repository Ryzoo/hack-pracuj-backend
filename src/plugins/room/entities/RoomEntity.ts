import { Entity, IBaseEntity } from '../../core/entities/IEntity';

export type RoomEntityData = IBaseEntity & {
  gameName?: string;
  gameState?: any;
  lastActivity?: Date;
  users?: string[];
  activeUsers?: string[];
  hostName: string;
};

class RoomEntity extends Entity<RoomEntityData> {
  static ENTITY_NAME = 'RoomEntity';

  gameName?: string;
  gameState?: any;
  lastActivity?: Date;
  users?: string[];
  activeUsers: string[];
  hostName: string;

  constructor(data: RoomEntityData) {
    super(data);
    this.gameName = data.gameName;
    this.gameState = data.gameState;
    this.hostName = data.hostName;
    this.users = data.users || [];
    this.activeUsers = data.activeUsers || [];
    this.lastActivity = data.lastActivity || new Date();
  }
}

export default RoomEntity;
