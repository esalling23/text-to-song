import { poster } from '@/lib/fetchHelpers'

const baseURL = 'http://localhost:3000'

export const updatePlayer = (playerId, name) => poster(
	'/api/player/update-name', 
	{ playerId, name }
)
export const selectIcon = ({playerId, icon, gameCode}) => poster(
	'/api/player/icon', 
	{ playerId, icon, gameCode }
)