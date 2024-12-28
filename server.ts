import { createServer } from "node:http"
import next from "next"
import { Server } from 'socket.io'
import crypto from 'crypto'
import express from 'express'
import http from 'http'

import prisma from './prisma'
import { SOCKET_EVENTS } from './socket'
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';
import { updatePlayerName, createGame, joinGame, startGame, roundReplayClip, roundGuess, getGame, getAllGames, killGame, updateGameSocket } from "./server/routes"
import requestLogger from "./server/requestLogger"
import errorHandler from "./server/errorHandler"
import { gameNotFound } from "./server/customError"
import { findConnectedPlayers } from "./server/lib"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const nextApp = next({ dev, hostname, port })
const handler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
	const app = express()
	const server = http.createServer(app)

	const io = new Server(server, {
		connectionStateRecovery: {} // temporary state recovery support
	})

	app.use(bodyParser.json())
	app.use(cookieParser())
	app.use(requestLogger)

	app.set('io', io)

	io.on("connection", async (socket: any) => {
		console.log("connected to socket", socket.id)

		const gameIdFromCookie = socket.handshake.headers.cookie?.gameId;

		if (gameIdFromCookie) {
			// Attempt to rejoin the game
			try {
				const game = await prisma.game.findUnique({ where: { id: gameIdFromCookie } });
				if (game && !game.isCompleted) {
					// Game is active, rejoin the user
					socket.join(game.groupSocketId);
					// ... (rest of the rejoin logic)
				} else {
					// Game is inactive, clear the cookie
					socket.emit('clearCookie', 'gameId');
				}
			} catch (error) {
				console.error('Error rejoining game:', error);
				// Handle error, potentially clear the cookie
				socket.emit('clearCookie', 'gameId');
			}
		}

		socket.emit(SOCKET_EVENTS.CONNECTED, socket.id);

		socket.on(SOCKET_EVENTS.STOP_CLIP, async (gameId: string) => {
			const game = await prisma.game.findUnique({ where: { id: gameId }})
			if (!game) {
				socket.emit(SOCKET_EVENTS.ERROR, gameNotFound())
				return;
			}
			io.to(game?.groupSocketId).emit(SOCKET_EVENTS.STOP_CLIP)
		})

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, async (playerId: string) => {
			const updatedPlayer = await prisma.player.update({
				where: {
					id: playerId
				},
				data: { socketId: socket.id }
			})

			const playersInGame = await findConnectedPlayers(updatedPlayer.gameId)

			console.log({ updatedPlayer, playersInGame })
			socket.emit(SOCKET_EVENTS.PLAYER_JOINED_GAME, playersInGame)
		})

		// to do - debug this, it's not working right
		socket.on('disconnect', async function() {
      console.log('Got disconnect!', socket.id);

			// probably only one, but find all anyway
      const playersToDisconnect = await prisma.player.updateMany({
				where: { socketId: socket.id },
				data: { socketId: null }
			});

			console.log('players disconnected', playersToDisconnect);

			// Tell the games
			const gamesWithDisconnectedPlayers = await prisma.game.findMany({
				where: {
					players: {
						some: { socketId: socket.id }
					}
				},
				include: { players: true }
			})

			console.log('games with disconnected players', gamesWithDisconnectedPlayers)

			for(const game of gamesWithDisconnectedPlayers) {
				io.to(game.groupSocketId).emit(SOCKET_EVENTS.REFRESH_GAME, game.id);
			}
   });
	})

	app.post('/api/player/update-name', updatePlayerName)
	
	app.get('/api/game/:gameId', getGame)
	app.delete('/api/game/:gameId', killGame)
	// Only for group socket updates
	app.patch('/api/game/:gameId', updateGameSocket)

	app.get('/api/game', getAllGames)
	app.post('/api/game', createGame)

	app.post('/api/game/join', joinGame)
	app.post('/api/game/:gameId/start', startGame)

	app.post('/api/game/:gameId/round/replay', roundReplayClip)
	app.patch('/api/game/:gameId/round/guess', roundGuess)
	
	app.all('*', (req: any, res: any) => handler(req, res))
	
	app.use(errorHandler)

	server
		.listen(port, () => {
			console.log(`> Ready on port ${port}`)
		})
})
