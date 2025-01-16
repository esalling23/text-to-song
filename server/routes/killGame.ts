import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';
import { getRoomName } from '../lib';
import { Player } from '@prisma/client';



export const killGame = async (req: Request, res: Response, next: NextFunction) => {
	const { gameId } = req.params;
	const { io, socket } = getSocketFromRequest(req);
	try {
		const game = await prisma.game.update({ 
			where: { id: gameId },
			 { isActive: false },
			include: { players: true }
		})
		if (!game) {
			throw gameNotFound()
		}

		const room = getRoomName(game.gameCode)

		io.to(game.groupSocketId).emit(SOCKET_EVENTS.STOP_CLIP);
		io.to(room).emit(SOCKET_EVENTS.REFRESH_GAME, gameId)

		// game.players.forEach((player: Player) => {
		// 	const socket = io.sockets.sockets.get(player.socketId)
		// 	socket.leave(room)
		// })
		socket.leave(room)

		res.sendStatus(204)
	} catch(err) {
		next(err)
	}
}


export default killGame
