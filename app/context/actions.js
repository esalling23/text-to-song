export const ACTION_TYPE = {
  SET_ROOM: 'SET_ROOM',
	SET_PLAYERS: 'SET_PLAYERS'
};

export const setGameRoom = (room) => ({
  type: ACTION_TYPE.SET_ROOM,
  payload: room,
});
export const setPlayers = (players) => ({
  type: ACTION_TYPE.SET_PLAYERS,
  payload: players,
});
