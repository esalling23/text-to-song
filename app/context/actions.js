import { GameData, GuessData, PlayerData, RoundData } from '@/lib/types';

export enum ACTION_TYPE {
	SET_SOCKET = 'SET_SOCKET',
  SET_ROOM = 'SET_ROOM',
	CLEAR_ROOM = 'CLEAR_ROOM',
	SET_PLAYERS = 'SET_PLAYERS',
	SET_PLAYER_ID = 'SET_PLAYER_ID',
	SET_PLAYER_NAME = 'SET_PLAYER_NAME',
	SET_PLAYER_ROUND_GUESS = 'SET_PLAYER_ROUND_GUESS',
	SET_ROUND_GUESSES = 'SET_ROUND_GUESSES',
	INIT_GAME = 'INIT_GAME',
	SET_GAME = 'SET_GAME',
	COMPLETE_ROUND = 'COMPLETE_ROUND',
	COMPLETE_GAME = 'COMPLETE_GAME',
};

interface Action {
	type: ACTION_TYPE,
	payload?: any
}

export const setSocketId = (id: string): Action => ({
  type: ACTION_TYPE.SET_SOCKET,
  payload: id,
});

export const setGameRoom = (id: string, code: string): Action => ({
  type: ACTION_TYPE.SET_ROOM,
  payload: { id, code },
});

export const clearRoom = (): Action => ({
	type: ACTION_TYPE.CLEAR_ROOM
})

export const setGameState = (game: GameData): Action => ({
	type: ACTION_TYPE.SET_GAME,
	payload: game
})

export const initGame = (rounds: RoundData[]): Action => ({
	type: ACTION_TYPE.INIT_GAME,
	payload: rounds
})
export const setPlayers = (players: PlayerData[]): Action => ({
  type: ACTION_TYPE.SET_PLAYERS,
  payload: players,
});

export const setPlayerId = (id: string): Action => ({
  type: ACTION_TYPE.SET_PLAYER_ID,
  payload: id,
});

export const setPlayerName = (name: string): Action => ({
  type: ACTION_TYPE.SET_PLAYER_NAME,
  payload: name,
});

export const setGameStarted = (rounds: RoundData[]): Action => ({
	type: ACTION_TYPE.INIT_GAME,
	payload: rounds
})

export const setPlayerRoundGuess = (guess: GuessData): Action => ({
	type: ACTION_TYPE.SET_PLAYER_ROUND_GUESS,
	payload: guess
})

export const setRoundGuesses = (guesses: GuessData[]): Action => ({
		type: ACTION_TYPE.SET_ROUND_GUESSES,
		payload: guesses
})

export const setRoundComplete = (): Action => ({
	type: ACTION_TYPE.COMPLETE_ROUND
})

export const setGameComplete = (): Action => ({
	type: ACTION_TYPE.COMPLETE_GAME
})
