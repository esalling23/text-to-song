type ErrorName = 
	| 'Error'
	| 'GameError';

type StatusCode = 
	| 400;

export class CustomError extends Error {
	name: ErrorName;
	message: string;
	// cause: any;
	status: StatusCode

	constructor({
		name,
		message,
		// cause,
		status
	}: {
		name: ErrorName
		message: string;
		// cause: any;
		status: StatusCode;
	}) {
		super()
		this.name = name;
		this.message = message;
		// this.cause = cause;
		this.status = status;
	} 
}

export const makeError = (name: ErrorName = 'Error', status: StatusCode, message: string) => new CustomError({
	name,
	message,
	// cause,
	status: 400
})

export const gameCreationFailed = (message: string) => gameError(`Game Creation Failed${message ? `: ${message}` : ''}`)

export const notEnoughPlayers = () => gameError('Not Enough Players to Start Game')
export const gameNotFound = () => gameError('Game Not Found')
export const playerNotInGame = () => gameError('Player Not in Game')
export const playerAlreadyGuessed = () => gameError('Player Already Guessed This Round')

export const gameError = (message: string) => makeError(
	'GameError',
	400,
	message
)