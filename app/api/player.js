import fetcher from '@/lib/fetcher'

const baseURL = 'http://localhost:3000'

export const updatePlayer = (playerId, name) => {
	return fetcher(`${baseURL}/update-player-name`, {
		method: 'post',
		headers: {
      "Content-Type": "application/json",
    },
		body: JSON.stringify({ playerId, name })
	})
}