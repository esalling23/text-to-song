'use client';

import { io } from 'socket.io-client'

export const socket = io();

export const SOCKET_EVENTS = {
	ERROR: 'socketError',
	CREATE_GAME: 'createGame',
	GAME_CREATED: 'gameCreated',
	JOIN_GAME: 'joinGame',
	JOIN_SUCCESS: 'joinSuccess',
	PLAYER_JOINED_GAME: 'playerJoinedGame',
	UPDATE_PLAYER_NAME: 'updatePlayerName',
	PLAYERS_UPDATED: 'playersUpdated'
}