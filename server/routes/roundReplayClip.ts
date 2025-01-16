import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { gameNotFound } from '../customError';

const roundReplayClip = async (req: Request, res: Response, next: NextFunction) => {
	const { io, socket } = getSocketFromRequest(req);
	const { gameId } = req.params;

	try {
        const game = await prisma.game.findUniqueOrThrow({ // Use findUniqueOrThrow
            where: { id: gameId }
        });

        console.log(`Telling Group Socket ${game.groupSocketId} to Replay`)

        io.to(game.groupSocketId).emit(SOCKET_EVENTS.REPLAY_CLIP);

        res.sendStatus(200)
    } catch (err) {
        next(err);
    }
}

export default roundReplayClip
