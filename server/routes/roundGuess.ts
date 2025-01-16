import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { cleanSongData } from '../lib';
import { gameNotFound, playerAlreadyGuessed, playerNotInGame } from '../customError';



export const roundGuess = async (req: Request, res: Response, next: NextFunction) => {
	const { io, socket } = getSocketFromRequest(req);
	const { gameId } = req.params;
	const { title, artist, socketId, playerId } = req.body;

	try {
		const game = await prisma.game.findUnique({
			where: {
				id: gameId,
				isActive: true,
				isStarted: true,
				isCompleted: false
			},
			include: { 
				players: true, 
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

		const player = game.players.find(p => p.id === playerId)
		if (!player) {
			throw playerNotInGame()
		}
		
		// Sanity check for duplicate round guesses
		const round = game.rounds[game.roundIndex]
		// console.log({game, round})
		const currentRoundGuess = round.guesses.some(g => g.playerId === playerId)
		if (currentRoundGuess) throw playerAlreadyGuessed()

		// Create guess object
		const isCorrectTitle = cleanSongData(title) === cleanSongData(round.song.title)
		const isCorrectArtist = cleanSongData(artist) === cleanSongData(round.song.artist.name)
		const guess = await prisma.guess.create({
			 {
				title,
				artist,
				player: { connect: { id: player.id } },
				round: { connect: { id: round.id } },
				isCorrect: isCorrectTitle && isCorrectArtist,
				score: (isCorrectArtist ? 50 : 0) + (isCorrectTitle ? 50 : 0)
			},
			include: { player: true }
		})

		// update player total score
		await prisma.player.update({
			where: {
				id: playerId
			},
			 {
				totalScore: player.totalScore + guess.score
			}
		})


		// Send back all players & round guesses
		const updatedPlayers = await prisma.player.findMany({
			where: {
				gameId: game.id
			}
		})

		const roundGuesses = await prisma.guess.findMany({
			where: { 
				roundId: round.id, 
			},
			include: { player: true }
		})

		// console.log({updatedPlayers, roundGuesses})

		io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, updatedPlayers);
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.ROUND_GUESS, roundGuesses);

		res.status(200).json({ game })
	} catch(err) {
		next(err);
	}
}



export default roundGuess
