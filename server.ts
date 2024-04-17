import { createServer } from "node:http"
import next from "next"
import { Server } from 'socket.io'
import crypto from 'crypto'

import { SOCKET_EVENTS } from './socket'
import prisma from './prisma'

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

const getRoomName = (id: string) => `room-${id}`
const generateRoomCode = (length = 4) => {
	// Create a new Uint8Array to store the random values.
	const array = new Uint8Array(length);

	// Get cryptographically strong random values and fill the array.
	crypto.getRandomValues(array);

	// Convert the array to a string of letters.
	const letters = String.fromCharCode(...Array.from(array.map(n => n % 26 + 97)));

	// Print the random string of letters.
	console.log(letters);
	return letters
}

app.prepare().then(() => {
	const httpServer = createServer(handler)

	const io = new Server(httpServer)

	const getRoomState = (room: string) => {
		const usersInRoom = io.sockets.adapter.rooms.get(room);
		return {
			roomId: room,
			players: usersInRoom ? Array.from(usersInRoom) : []
		}
	}

	io.on("connection", (socket) => {
		console.log("connected to socket")

		socket.on(SOCKET_EVENTS.CREATE_GAME, async () => {
			// code will be used to join this room
			const roomCode = generateRoomCode();
			console.log("created game room", roomCode)
			const room = getRoomName(roomCode)

			socket.join(room) // is this a problem?
			const roomState = getRoomState(room)
			if (roomState.players.length === 0) {
				io.to(room).emit(SOCKET_EVENTS.ERROR, "Room Create Error - no players in room after creation")
				return;
			}
			// create db game object
			const game = await prisma.game.create({
				data: {
					gameCode: roomCode,
					groupSocketId: roomState.players[0] // will be the only player
				},
			});
			console.log(game)
			io.to(room).emit(SOCKET_EVENTS.GAME_CREATED, game)
		})

		socket.on(SOCKET_EVENTS.JOIN_GAME, async (data) => {
			const game = await prisma.game.findFirst({
				where: {
					gameCode: data.room,
				},
			})

			const room = getRoomName(data.room)

			if (!game) {
				io.to(room).emit(SOCKET_EVENTS.ERROR, "Room Join Error - room doesn't exist")
				return;
			}
			
			const player = await prisma.player.create({
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

			console.log("player joined room ---", room)
			
			const updatedGame = await prisma.game.findUnique({
				where: {
					id: game.id
				},
				include: {
					players: true
				}
			})
			
			console.log(updatedGame, player)

			io.to(room).emit(SOCKET_EVENTS.PLAYER_JOINED_GAME, updatedGame)
		})
	})

	httpServer
		.once("error", err => {
			console.error(err)
			process.exit(1)
		})
		.listen(port, () => {
			console.log(`> Ready on port ${port}`)
		})
})