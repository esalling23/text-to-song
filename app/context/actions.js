export const ACTION_TYPE = {
	SET_SOCKET: 'SET_SOCKET',
  SET_ROOM: 'SET_ROOM',
	SET_PLAYERS: 'SET_PLAYERS',
	SET_PLAYER_ID: 'SET_PLAYER_ID',
	SET_PLAYER_NAME: 'SET_PLAYER_NAME',
};

export const setSocketId = (id) => ({
  type: ACTION_TYPE.SET_SOCKET,
  payload: id,
});

export const setGameRoom = (id, code) => ({
  type: ACTION_TYPE.SET_ROOM,
  payload: { id, code },
});

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
