export const ACTION_TYPE = {
	SET_SOCKET: 'SET_SOCKET',
  SET_ROOM: 'SET_ROOM',
	CLEAR_ROOM: 'CLEAR_ROOM',
	SET_PLAYERS: 'SET_PLAYERS',
	SET_PLAYER_ID: 'SET_PLAYER_ID',
	SET_PLAYER_NAME: 'SET_PLAYER_NAME',
	SET_PLAYER_ROUND_GUESS: 'SET_PLAYER_ROUND_GUESS',
	SET_ROUND_GUESSES: 'SET_ROUND_GUESSES',
	INIT_GAME: 'INIT_GAME',
	SET_GAME: 'SET_GAME',
	SET_ROUNDS: 'SET_ROUNDS',
	COMPLETE_ROUND: 'COMPLETE_ROUND',
	COMPLETE_GAME: 'COMPLETE_GAME',
};

export const setSocketId = (id) => ({
  type: ACTION_TYPE.SET_SOCKET,
  payload: id,
});

export const setGameRoom = (id, code) => ({
  type: ACTION_TYPE.SET_ROOM,
  payload: { id, code },
});

export const clearRoom = () => ({
	type: ACTION_TYPE.CLEAR_ROOM
})

export const setGameState = (game) => ({
	type: ACTION_TYPE.SET_GAME,
	payload: game
})

export const initGame = (rounds) => ({
	type: ACTION_TYPE.INIT_GAME,
	payload: rounds
})
export const setPlayers = (players) => ({
  type: ACTION_TYPE.SET_PLAYERS,
  payload: players,
});

export const setPlayerId = (id) => ({
  type: ACTION_TYPE.SET_PLAYER_ID,
  payload: id,
});

export const setPlayerName = (name) => ({
  type: ACTION_TYPE.SET_PLAYER_NAME,
  payload: name,
});

export const setGameStarted = (rounds) => ({
	type: ACTION_TYPE.INIT_GAME,
	payload: rounds
})

export const setPlayerRoundGuess = (guess) => ({
	type: ACTION_TYPE.SET_PLAYER_ROUND_GUESS,
	payload: guess
})

export const setRoundGuesses = (guesses) => {
	return {
		type: ACTION_TYPE.SET_ROUND_GUESSES,
		payload: guesses
	}
}

export const setRoundComplete = () => ({
	type: ACTION_TYPE.COMPLETE_ROUND
})

export const setGameComplete = () => ({
	type: ACTION_TYPE.COMPLETE_GAME
})