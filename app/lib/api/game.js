import { fetcher, poster } from "@/lib/fetchHelpers"

export const createGame = (socketId) => poster('/api/game', { socketId })

export const killGame = (gameId, socketId) => fetcher(`/api/game/${gameId}`, {
	method: 'delete',
	data: { socketId }
})

export const getGame = (gameId) => fetcher(`/api/game/${gameId}`)

export const joinGame = (socketId, gameCode, playerId) => poster('/api/game/join', {
	socketId, 
	gameCode,
	playerId
})

export const startGame = (gameId) => poster(`/api/game/${gameId}/start`, {})