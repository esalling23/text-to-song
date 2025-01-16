import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';

const updatePlayerName = async (req: Request, res: Response, next: NextFunction) => {
	const { io } = getSocketFromRequest(req);
	
	try {
		const player = await prisma.player.update({
			where: {
				id: req.body.playerId
			},
			data: {
				displayName: req.body.name
			}
		});

		// console.log({player})

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
			throw gameNotFound()
		}
	
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, game.players);

		res.status(200).send({ success: true,  player })
	} catch(err) {
		next(err)
	}
}


export default updatePlayerName
