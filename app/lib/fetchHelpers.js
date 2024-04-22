export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const poster = (url, body) => fetcher(url, {
	method: 'post',
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(body)
})