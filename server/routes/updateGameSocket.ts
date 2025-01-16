import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';
import { findConnectedPlayers, getRoomName } from '../lib';

const updateGameSocket = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { io, socket } = getSocketFromRequest(req)
		// console.log('updating game socket from socket: ', { socket })
		const gameId = req.params.gameId;
		// console.log('found socket?? ', !!socket)
		// if (!socket) res.send({ message: 'empty socket' });

		const game = await prisma.game.update({ 
			where: { id: gameId },
			data: { groupSocketId: socket?.id }
		})

		if (!game) {
			throw gameNotFound()
		}

		// console.log('game socket updated', game)

		const players = await findConnectedPlayers(gameId);

		// console.log('players connected', players)

		io.to(getRoomName(game.gameCode)).emit(SOCKET_EVENTS.REFRESH_GAME, gameId)

		res.status(200).json({ game, players });
	} catch(err) {
		next(err)
	}
}


export default updateGameSocket
