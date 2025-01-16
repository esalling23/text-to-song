import { initialState } from './reducer';
import { GuessData, LyricBlock, PlayerData, RoundData, SearchResult } from '@/lib/types';

type GameState = typeof initialState

// Screen
export const getCurrentScreen = (state: GameState) => state.screen.current;

// Room 
export const getGameRoom = (state: GameState) => ({ 
	gameId: state.room.gameId, 
	gameCode: state.room.gameCode
});
export const getSocketId = (state: GameState) => state.room.socketId;
export const getPlayersInRoom = (state: GameState): PlayerData[] => state.room.playersInRoom;

// Player
export const getPlayerId = (state: GameState) => state.player.id;
export const getPlayerName = (state: GameState) => state.player.displayName;

// Gameplay
export const getIsPlaying = (state: GameState) => state.gameplay.isPlaying
export const getCurrentRoundIndex = (state: GameState) => state.gameplay.roundIndex
export const getCurrentRound = (state: GameState): RoundData | undefined => state.gameplay.rounds[getCurrentRoundIndex(state)]
export const getRoundSong = (state: GameState): SearchResult | undefined => getCurrentRound(state)?.song
export const getRoundGuesses = (state: GameState): GuessData[] => state.gameplay.roundGuesses
export const getGuessCount = (state: GameState) => getRoundGuesses(state).length
export const getPlayerRoundGuess = (state: GameState): GuessData | null => state.player.roundGuess
export const getSongLyrics = (state: GameState): LyricBlock | undefined => {
	const round = getCurrentRound(state)
	return round?.song?.lyricBlocks[round.blockIndex];
}
