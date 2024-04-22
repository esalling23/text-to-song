import { fetcher } from '@/lib/fetchHelpers'

const baseURL = 'https://lrclib.net/api'
const searchEndpoint = 'search'

export const searchQuery = (query) => {
	return fetcher(`${baseURL}/${searchEndpoint}?q=${query}`)
}