export const getGameRoom = (state) => state.socket.roomId;

export const getPlayersInRoom = (state) => state.socket.playersInRoom;

export const getCurrentScreen = (state) => state.screen.current;
