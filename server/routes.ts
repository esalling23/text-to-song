import { Server } from 'socket.io';
import { Request, Response } from 'express';

import prisma from '../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../socket';
import { generateRoomCode, getRoomName, getRoomState } from './lib';
import { gameNotFound, gameCreationFailed } from './customError';

export const updatePlayerName = async (req: Request, res: Response, next: Function) => {
	try {
		const player = await prisma.player.update({
			where: {
				id: req.body.playerId
			},
			data: {
				displayName: req.body.name
			}
		});
	
		const game = await prisma.game.findFirst({
			where: {
				players: {
					some: { id: player.id }
				},
				// isActive: true
			},
			include: { players: true }
		})

		if (!game) {
			next(gameNotFound('?'))
			return;
		}

		const io = req.app.get('io') 
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, game)
		res.status(200).send({ success: true, data: player })

	} catch(err) {
		next(err)
	}
}

export const createGame = async (req: Request, res: Response, next: Function) => {
	// code will be used to join this room
	const roomCode = generateRoomCode();
	const room = getRoomName(roomCode)

	// "create" a socket room
	const { io, socket } = getSocketFromRequest(req);
	socket.join(room)

	// Check room was created correctly
	const roomState = getRoomState(io, room)
	const groupSocketId = roomState.players[0] || '';
	if (!groupSocketId) {
		next(gameCreationFailed('No Group Client Connection'))
		return;
	}

	try {
		// delete any existing games on this socket 
		// there should be 1 but since groupSocketId is not unique, use deleteMany
		await prisma.game.deleteMany({
			where: {
				groupSocketId
			}
		})
		// Create game db object
		// groupSocketId will be set to the incoming client connection
		const game = await prisma.game.create({
			data: {
				gameCode: roomCode,
				groupSocketId  // will be the only player
			},
		});

		console.log('created game', game)
	
		res.status(200).send({ game })
	} catch(err) {
		next(err)
	}
}

export const joinGame = async (req: Request, res: Response, next: Function) => {
	const { io, socket } = getSocketFromRequest(req);
	const { gameCode } = req.body;
	const room = getRoomName(gameCode)

	try {
		const game = await prisma.game.findFirst({
			where: {
				gameCode,
				// isActive: true,
			},
			include: { players: true }
		})

		console.log('game to join', game)

		if (!game) {
			next(gameNotFound('No Game to Join'))
			return;
		}
	
		const player = await prisma.player.create({
			data: {
				socketId: socket.id,
				displayName: 'Anon',
				game: {
					connect: {
						id: game.id
					}
				}
			}
		})
		
		socket.join(room)
		
		const updatedGame = await prisma.game.findUnique({
			where: {
				id: game.id
			},
			include: {
				players: true
			}
		})
		
		console.log(updatedGame, player)
	
		io.to(room).emit(SOCKET_EVENTS.PLAYER_JOINED_GAME, updatedGame)
	
		res.status(200).json({ player, game: updatedGame })
	} catch(err) {
		next(err)
	}
}
