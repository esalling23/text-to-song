import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid' 

import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameCreationFailed } from '../customError';
import { generateRoomCode, getRoomName, getRoomState } from '../lib';



export const createGame = async (req: Request, res: Response, next: NextFunction) => {
	// Generate unique game code
	const games = await prisma.game.findMany({ select: { gameCode: true }})
	const existingGameCodes = games.map(g => g.gameCode);

	let roomCode: string
	do {
		// code will be used to join this room instead of ID for UX
		roomCode = generateRoomCode();
	} while (existingGameCodes.includes(roomCode))
	
	// "create" a socket room
	const room = getRoomName(roomCode);
	const { io, socket } = getSocketFromRequest(req);
	socket.join(room)

	console.log({ rooms: socket.rooms })

	// Check room was created correctly
	const roomState = getRoomState(io, room)
	const groupSocketId = roomState.players[0] || '';
	if (!groupSocketId) {
		throw gameCreationFailed('No Group Client Connection')
	}

	try {
		// Create game db object
		// groupSocketId will be set to the incoming client connection
		const game = await prisma.game.create({
			 {
				isActive: true,
				gameCode: roomCode,
				groupSocketId  // will be the only player
			},
		});

		// console.log('created game', game)
	
		res.status(200).send({ game })
	} catch(err) {
		next(err)
	}
}

export default createGame
