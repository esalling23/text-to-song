import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';
import { findConnectedPlayers, getRoomName } from '../lib';

const updateGameSocket = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { io, socket } = getSocketFromRequest(req)
		const gameId = req.params.gameId;

		const game = await prisma.game.update({ 
			where: { id: gameId },
			data: { groupSocketId: socket?.id }
		})

		if (!game) {
			return next(gameNotFound())
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
