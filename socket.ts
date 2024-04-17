'use client';

import { io } from 'socket.io-client'

export const socket = io();

export const SOCKET_EVENTS = {
	ERROR: 'socketError',
	CREATE_GAME: 'createGame',
	GAME_CREATED: 'gameCreated',
	JOIN_GAME: 'joinGame',
	PLAYER_JOINED_GAME: 'playerJoinedGame',
}