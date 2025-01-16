import next from "next"
import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

import prisma from './prisma'
import { SOCKET_EVENTS } from './socket'
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';
import requestLogger from "./server/requestLogger"
import errorHandler from "./server/errorHandler"
import { gameNotFound } from "./server/customError"
import { findConnectedPlayers, getRoomName } from "./server/lib"
import { IconEvent } from "./components/game/PlayerForms/IconForm/IconForm"
import appRoutes from "./server/routes"

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
				const game = await prisma.game.findUniqueOrThrow({ where: { id: gameIdFromCookie } });
				if (game && !game.isCompleted) {
					// Game is active, rejoin the user
					socket.join(game.groupSocketId);
					// ... (rest of the rejoin logic)
					socket.join(getRoomName(game.gameCode))
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

		socket.onAny((eventName: string, ...args: any) => {
			console.log({ eventName, ...args })
		});

		socket.emit(SOCKET_EVENTS.CONNECTED, socket.id);

		socket.on(SOCKET_EVENTS.STOP_CLIP, async (gameId: string) => {
			const game = await prisma.game.findUniqueOrThrow({ where: { id: gameId }})
			if (!game) {
				socket.emit(SOCKET_EVENTS.ERROR, gameNotFound())
				return;
			}
			io.to(game?.groupSocketId).emit(SOCKET_EVENTS.STOP_CLIP)
		})

		socket.on(SOCKET_EVENTS.DESELECT_ICON, async ({ gameCode, icon, playerId }: IconEvent) => {
			// to do - debug rooms more to not need this check
			if (![...socket.rooms].includes(getRoomName(gameCode)))
				socket.join(getRoomName(gameCode))

			io.in(getRoomName(gameCode)).emit(SOCKET_EVENTS.DESELECT_ICON, { gameCode, icon, playerId })
		})

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, async (playerId: string) => {
			
			
			const updatedPlayer = await prisma.player.update({
				where: {
					id: playerId
				},
				data: { socketId: socket.id },
				include: { game: true }
			})

			socket.join(getRoomName(updatedPlayer.game.gameCode))

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
				const updatedGame = await prisma.game.findUniqueOrThrow({
					where: { id: game.id },
					include: { players: true }
				})
				io.to(game.groupSocketId).emit(SOCKET_EVENTS.REFRESH_GAME, updatedGame);
			}
   });
	})

	app.use('/api', appRoutes)
	
	app.all('*', (req: any, res: any) => handler(req, res))
	
	app.use(errorHandler)

	server
		.listen(port, () => {
			console.log(`> Ready on port ${port}`)
		})
})
