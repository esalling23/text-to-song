'use client';

import { Request } from 'express';
import { io } from 'socket.io-client'

export const socket = io();

export const SOCKET_EVENTS = {
	CONNECTED: 'connected',
	ERROR: 'socketError',
	REFRESH_GAME: 'refreshGame',
	CREATE_GAME: 'createGame',
	JOIN_GAME: 'joinGame',
	START_GAME: 'startGame',
	ROUND_GUESS: 'roundGuess',
	PLAYER_JOINED_GAME: 'playerJoinedGame',
	UPDATE_PLAYER_NAME: 'updatePlayerName',
	PLAYERS_UPDATED: 'playersUpdated',
	REPLAY_CLIP: 'replayClip',
	STOP_CLIP: 'stopClip',
	COMPLETE_ROUND: 'completRound',
	COMPLETE_GAME: 'completeGame'
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