export enum WebsocketMessageType {
  USER_JOINED,
  USER_EXIT,
  GAME_CHANGED,
  GAME_STATE_CHANGED,
  ROOM_REMOVED,
}

type WebsocketMessage = {
  type: WebsocketMessageType;
  payload: any;
};

export default WebsocketMessage;
