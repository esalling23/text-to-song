export const getGameRoom = (state) => state.socket.roomId;

export const getPlayersInRoom = (state) => state.socket.playersInRoom;

export const getPlayerId = (state) => state.player.id;

export const getPlayerName = (state) => state.player.displayName;

export const getCurrentScreen = (state) => state.screen.current;
