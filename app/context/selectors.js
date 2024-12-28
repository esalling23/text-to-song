// Screen
export const getCurrentScreen = (state) => state.screen.current;

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

// Gameplay
export const getIsPlaying = (state) => state.gameplay.isPlaying
export const getCurrentRoundIndex = (state) => state.gameplay.roundIndex
export const getCurrentRound = (state) => state.gameplay.rounds[getCurrentRoundIndex(state)]
export const getRoundSong = (state) => getCurrentRound(state).song
export const getRoundGuesses = (state) => state.gameplay.roundGuesses
export const getGuessCount = (state) => getRoundGuesses(state)?.length
export const getPlayerRoundGuess = state => {
	if (!state.player.roundGuess?.title || !state.player.roundGuess?.artist) return null;
	return state.player.roundGuess
}
export const getSongLyrics = (state) => {
	const round = getCurrentRound(state)
	console.log(round)
	return round?.song?.lyricBlocks[round.blockIndex];
}
