'use client';

import { Request } from 'express';
import { io } from 'socket.io-client'

export const socket = io();

export const SOCKET_EVENTS = {
	CONNECTED: 'connected',
	ERROR: 'socketError',
	CREATE_GAME: 'createGame',
	GAME_CREATED: 'gameCreated',
	JOIN_GAME: 'joinGame',
	JOIN_SUCCESS: 'joinSuccess',
	PLAYER_JOINED_GAME: 'playerJoinedGame',
	UPDATE_PLAYER_NAME: 'updatePlayerName',
	PLAYERS_UPDATED: 'playersUpdated'
}

export const getSocketFromRequest = (req: Request) => {
	const io = req.app.get('io');
	const socketId = req.body.socketId;

	if (!socketId) return { io }

	const senderSocket = io.sockets.sockets.get(socketId)

	return {
		io,
		socket: senderSocket,
	}
}