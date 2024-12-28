import axios from "axios";

export const fetcher = (url, args) => axios({ url, ...args })
	
export const poster = (url, data) => fetcher(url, {
	method: 'post',
	headers: {
		"Content-Type": "application/json",
	},
	data
})