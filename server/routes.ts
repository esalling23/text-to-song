import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid' 

import prisma from '../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../socket';
import { cleanSongData, findConnectedPlayers, generateRoomCode, getRoomName, getRoomState } from './lib';
import { gameNotFound, gameCreationFailed, gameError, playerNotInGame, playerAlreadyGuessed } from './customError';
import { generateRounds } from './gameplay';

export const updatePlayerName = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.body)
		const player = await prisma.player.update({
			where: {
				id: req.body.playerId
			},
			data: {
				displayName: req.body.name
			}
		});

		console.log({player})

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
		
		console.log({players: game.players})

		// await prisma.player.deleteMany({
		// 	where: { gameId: game.id, socketId: undefined }
		// })

		// const cleanGame = await prisma.game.update({
		// 	where: {
		// 		id: game.id,
		// 	},
		// 	include: { players: true },
		// 	data: {
		// 		players: cleanPlayers
		// 	}
		// })


		// Tell the group screen about this change
		const io = req.app.get('io') 
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, game.players);

		res.status(200).send({ success: true, data: player })
	} catch(err) {
		next(err)
	}
}

export const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const games = await prisma.game.findMany({})
		res.status(200).json({ games });
	} catch(err) {
		next(err)
	}
}

export const getGame = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const gameId = req.params.gameId;
		const game = await prisma.game.findUnique({ 
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

		console.log('players connected', players)
		console.log('game round 1 with guesses', game.rounds[0]?.guesses)

		res.status(200).json({ game, players });
	} catch(err) {
		next(err)
	}
}

export const cleanupGames = async (req: Request, res: Response, next: NextFunction) => {
	const { io } = getSocketFromRequest(req);

	
	const allGames = await prisma.game.findMany()

	const gamesToRemove = allGames.filter(game => {
		// REturn if game is NOT connected
		return !io.sockets.sockets[game.groupSocketId]
	}).map(game => game.id);

	const gamesRemoved = await prisma.game.deleteMany({
		where: { id: { in: gamesToRemove } }
	})

	console.log({ gamesRemoved })

	res.status(201).send({ message: 'success' })
}

export const updateGameSocket = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { io, socket } = getSocketFromRequest(req)
		// console.log('updating game socket from socket: ', { socket })
		const gameId = req.params.gameId;
		console.log('found socket?? ', !!socket)
		// if (!socket) res.send({ message: 'empty socket' });

		const game = await prisma.game.update({ 
			where: { id: gameId },
			data: { groupSocketId: socket?.id }
		})

		if (!game) {
			throw gameNotFound()
		}

		console.log('game socket updated', game)

		const players = await findConnectedPlayers(gameId);

		console.log('players connected', players)

		io.to(getRoomName(game.gameCode)).emit(SOCKET_EVENTS.REFRESH_GAME, { game, players })

		res.status(200).json({ game, players });
	} catch(err) {
		next(err)
	}
}

export const createGame = async (req: Request, res: Response, next: NextFunction) => {
	// Generate unique game code
	const games = await prisma.game.findMany({ select: { gameCode: true }})
	const existingGameCodes = games.map(g => g.gameCode);

	let roomCode: string
	do {
		// code will be used to join this room instead of ID for UX
		roomCode = generateRoomCode();
	} while (existingGameCodes.includes(roomCode))
	
	// "create" a socket room
	const room = getRoomName(roomCode);
	const { io, socket } = getSocketFromRequest(req);
	socket.join(room)

	// Check room was created correctly
	const roomState = getRoomState(io, room)
	const groupSocketId = roomState.players[0] || '';
	if (!groupSocketId) {
		throw gameCreationFailed('No Group Client Connection')
	}

	try {
		// Create game db object
		// groupSocketId will be set to the incoming client connection
		const game = await prisma.game.create({
			data: {
				isActive: true,
				gameCode: roomCode,
				groupSocketId  // will be the only player
			},
		});

		console.log('created game', game)
	
		res.status(200).send({ game })
	} catch(err) {
		next(err)
	}
}

export const joinGame = async (req: Request, res: Response, next: NextFunction) => {
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

		console.log('game to join', game)

		if (!game) {
			throw gameNotFound()
			return;
		} else if (!game.isActive) {
			throw gameError('Game Not Active')
			return;
		} else if (game.isCompleted) {
			throw gameError('Cannot Join Completed Game')
			return;
		}

		let player;
		if (playerId) {
			player = await prisma.player.findUnique({ where: { id: playerId }})
		}

		console.log('found player', {player, playerId})

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
			console.log('socket joined a room', {socket, room})
		}
		
		const updatedGame = await prisma.game.findUnique({
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

export const startGame = async (req: Request, res: Response, next: NextFunction) => {
	const { io } = getSocketFromRequest(req);
	const { gameId } = req.params;

	try {
		const rounds = await generateRounds();
		console.log('generated rounds', rounds)
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

		console.log('game updated', game)

		if (!game) {
			throw gameNotFound()
		} 

		const players = await findConnectedPlayers(game.id)

		console.log('game started', game)

		console.log(game.gameCode)
		console.log(getRoomName(game.gameCode))

		io.in(getRoomName(game.gameCode)).emit(SOCKET_EVENTS.START_GAME, {
			game,
			players
		});

		// res.status(200).json({ game })
	} catch(err) {
		next(err);
	}
}

export const killGame = async (req: Request, res: Response, next: NextFunction) => {
	const { gameId } = req.params;
	const { io, socket } = getSocketFromRequest(req);
	try {
		const game = await prisma.game.update({ 
			where: { id: gameId },
			data: { isActive: false }
		})
		if (!game) {
			throw gameNotFound()
		}
		const room = getRoomName(game.gameCode)

		io.to(room).emit(SOCKET_EVENTS.REFRESH_GAME, gameId)

		socket.leave(room)

		res.sendStatus(204)
	} catch(err) {
		next(err)
	}
}

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
		console.log({game, round})
		const currentRoundGuess = round.guesses.some(g => g.playerId === playerId)
		if (currentRoundGuess) throw playerAlreadyGuessed()

		// Create guess object
		const isCorrectTitle = cleanSongData(title) === cleanSongData(round.song.title)
		const isCorrectArtist = cleanSongData(artist) === cleanSongData(round.song.artist.name)
		const guess = await prisma.guess.create({
			data: {
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
			data: {
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

		console.log({updatedPlayers, roundGuesses})

		io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, updatedPlayers);
		io.to(game.groupSocketId).emit(SOCKET_EVENTS.ROUND_GUESS, roundGuesses);

		res.status(200).json({ game })
	} catch(err) {
		next(err);
	}
}

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
			data: {
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