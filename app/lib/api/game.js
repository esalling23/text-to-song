import { fetcher, poster } from "@/lib/fetchHelpers"

export const createGame = (socketId) => poster('/game/create', { socketId })

export const killGame = () => {

}

export const joinGame = (socketId, gameCode) => poster('/game/join', {
	socketId, 
	gameCode
})