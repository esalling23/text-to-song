
// Room 
export const getGameRoom = (state) => ({ 
	gameId: state.room.gameId, 
	gameCode: state.room.gameCode
});
export const getSocketId = (state) => state.room.socketId;
export const getPlayersInRoom = (state) => state.room.playersInRoom;

// Player
export const getPlayerId = (state) => state.player.id;
export const getPlayerName = (state) => state.player.displayName;

export const getCurrentScreen = (state) => state.screen.current;
