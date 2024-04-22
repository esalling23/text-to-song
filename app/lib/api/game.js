import fetcher from "@/lib/fetcher"

export const createGame = (socketId) => {
	return fetcher('/game/create', {
		method: 'post',
		headers: {
      "Content-Type": "application/json",
    },
		body: JSON.stringify({ socketId })
	})
}

export const killGame = () => {

}


export const joinGame = (socketId, gameCode) => {
	return fetcher(`/game/join`, {
		method: 'post',
		headers: {
      "Content-Type": "application/json",
    },
		body: JSON.stringify({ socketId, gameCode })
	})
}