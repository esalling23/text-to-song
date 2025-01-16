import { NextFunction, Request, Response } from 'express';

import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { findConnectedPlayers, getRoomName } from '../lib';
import { gameError, gameNotFound } from '../customError';

const joinGame = async (req: Request, res: Response, next: NextFunction) => {
	const { io, socket } = getSocketFromRequest(req);
	const { playerId, gameCode } = req.body;
	const room = getRoomName(gameCode)

	try {
		const game = await prisma.game.findFirst({
			where: {
				gameCode,
				// isActive: true,
			},
			include: { 
				players: true, 
				rounds: { 
					include: { 
						song: { 
							include: { artist: true } 
						}
					}
				} 
			}
		})

		// console.log('game to join', game)

		if (!game) {
			return next(gameNotFound())
		} else if (!game.isActive) {
			return next(gameError('Game Not Active'))
		} else if (game.isCompleted) {
			return next(gameError('Cannot Join Completed Game'))
		}

		let player;
		if (playerId) {
			player = await prisma.player.findUniqueOrThrow({ where: { id: playerId }})
		}

		// console.log('found player', {player, playerId})

		if (!player && socket?.id) {
			player = await prisma.player.create({
				data: {
					socketId: socket.id,
					displayName: 'Anon',
					game: {
						connect: {
							id: game.id
						}
					}
				}
			})
			socket.join(room)
			console.log('socket joined a room', {socket, room, rooms: socket.rooms})
		}
		
		const updatedGame = await prisma.game.findUniqueOrThrow({
			where: {
				id: game.id
			},
		})

		const players = await findConnectedPlayers(game.id)
		
		// console.log(updatedGame, players)
	
		io.to(room).emit(SOCKET_EVENTS.PLAYER_JOINED_GAME, players)
	
		res.status(200).json({ player, game: updatedGame })
	} catch(err) {
		next(err)
	}
}


export default joinGame
