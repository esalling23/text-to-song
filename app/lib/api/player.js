import { poster } from '@/lib/fetchHelpers'

const baseURL = 'http://localhost:3000'

export const updatePlayer = (playerId, name) => poster(
	'/player/update-name', 
	{ playerId, name }
)