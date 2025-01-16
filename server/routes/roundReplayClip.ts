import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';



export const roundReplayClip = async (req: Request, res: Response, next: NextFunction) => {
	const { io, socket } = getSocketFromRequest(req);
	const { gameId } = req.params;

	try {
		// Make sure the game exists
		const game = await prisma.game.findUnique({
			where: { id: gameId }
		});

		if (!game) {
			throw gameNotFound()
		}

		console.log(`Telling Group Socket ${game.groupSocketId} to Replay`)

		// Tell the group screen to replay
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.REPLAY_CLIP);

		res.sendStatus(200)
	} catch(err) {
		next(err);
	}
}

export default roundReplayClip
