import { createServer } from "node:http"
import next from "next"
import { Server } from 'socket.io'
import crypto from 'crypto'
import express from 'express'
import http from 'http'

import { SOCKET_EVENTS } from './socket'
import bodyParser from "body-parser"
import { updatePlayerName, createGame, joinGame } from "./server/routes"
import requestLogger from "./server/requestLogger"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const nextApp = next({ dev, hostname, port })
const handler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
	const app = express()
	const server = http.createServer(app)

	const io = new Server(server)

	app.use(bodyParser.json())
	app.use(requestLogger)

	app.set('io', io)

	io.on("connection", (socket: any) => {
		console.log("connected to socket", socket.id)

		socket.emit(SOCKET_EVENTS.CONNECTED, socket.id);
	})


	app.post('/player/update-name', updatePlayerName)
	
	app.post('/game/create', createGame)
	app.post('/game/join', joinGame)

	app.all('*', (req: any, res: any) => handler(req, res))

	server
		.once("error", (err: string) => {
			console.error(err)
			process.exit(1)
		})
		.listen(port, () => {
			console.log(`> Ready on port ${port}`)
		})
})