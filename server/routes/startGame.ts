import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from "../../socket";
import { gameNotFound, notEnoughPlayers } from '../customError';
import { MIN_PLAYERS } from '../../lib/constants';
import { generateRounds } from '../gameplay';
import { findConnectedPlayers, getRoomName } from '../lib';


const startGame = async (req: Request, res: Response, next: NextFunction) => {
	const { io } = getSocketFromRequest(req);
	const { gameId } = req.params;

	try {
		const gamePlayers = await prisma.player.findMany({
			where: { gameId },
		})

		if (gamePlayers.length < MIN_PLAYERS) {
			return next(notEnoughPlayers());
		}

		const rounds = await generateRounds();
		// console.log('generated rounds', rounds)
		const game = await prisma.game.update({
			where: {
				id: gameId,
				isActive: true,
				isStarted: false,
				isCompleted: false
			},
			data: {
				roundIndex: 0,
				isStarted: true,
				rounds: { createMany: { data: rounds } }
			},
			include: { rounds: { 
				include: { song: { 
					include: { artist: true } } 
				} } 
			}
		})

		// console.log('game updated', game)

		if (!game) {
			return next(gameNotFound())
		} 

		const players = await findConnectedPlayers(game.id)

		// console.log('game started', game)

		io.in(getRoomName(game.gameCode)).emit(SOCKET_EVENTS.START_GAME, {
			game,
			players
		});

		res.status(200).json({ game })
	} catch(err) {
		next(err);
	}
}

export default startGame
