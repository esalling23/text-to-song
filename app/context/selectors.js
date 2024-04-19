export const getGameRoom = (state) => ({ 
	roomId: state.socket.roomId, 
	gameCode: state.socket.gameCode
});

export const getPlayersInRoom = (state) => state.socket.playersInRoom;

export const getPlayerId = (state) => state.player.id;

export const getPlayerName = (state) => state.player.displayName;

export const getCurrentScreen = (state) => state.screen.current;
