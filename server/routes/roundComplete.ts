import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';
import { getRoomName } from '../lib';



export const roundComplete = async (req: Request, res: Response, next: NextFunction) => {
	const { io, socket } = getSocketFromRequest(req);
	const { gameId } = req.params;
	const { title, artist, socketId, playerId } = req.body;

	const include = {
		include: { 
			players: true, 
			rounds: { 
				include: { 
					song: { include: { artist: true } }, 
					guesses: true 
				} 
			} 
		}
	}

	try {
		const game = await prisma.game.findUnique({
			where: {
				id: gameId,
				isActive: true,
				isStarted: true,
				isCompleted: false
			},
			...include
		})

		if (!game) {
			throw gameNotFound()
		}

		const room = getRoomName(game.gameCode)

		if (game.roundIndex >= game.rounds.length - 1) {
			console.log('Final round complete - game finished!')

			io.to(room).emit(SOCKET_EVENTS.COMPLETE_GAME, game)

			res.status(200).json({ game })
			return;
		}

		const updatedGame = await prisma.game.update({
			where: {
				id: game.id,
			},
			 {
				roundIndex: game.roundIndex + 1,
			},
			...include
		})
		io.to(room).emit(SOCKET_EVENTS.COMPLETE_ROUND, updatedGame);

		res.status(200).json({ game })
	} catch(err) {
		next(err);
	}
}


export default roundComplete
