import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { findConnectedPlayers } from '../lib';

const getGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = req.params.gameId;
        const game = await prisma.game.findUniqueOrThrow({  // Use findUniqueOrThrow to simplify error handling
            where: { id: gameId },
			include: { 
				rounds: { 
					include: { 
						song: { include: { artist: true } }, 
						guesses: true 
					} 
				} 
			}
		})

		if (!game) {
			throw gameNotFound()
		}

		const players = await findConnectedPlayers(gameId);

		// console.log('players connected', players)
		// console.log('game round 1 with guesses', game.rounds[0]?.guesses)

		res.status(200).json({ game, players });
	} catch(err) {
		next(err)
	}
}


export default getGame
