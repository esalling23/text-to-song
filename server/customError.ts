type ErrorName = 
	| 'GameCreationFailed'
	| 'GameNotFound';

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

export const makeError = (name: ErrorName, status: StatusCode, message: string) => new CustomError({
	name: 'GameCreationFailed',
	message,
	// cause,
	status: 400
})

export const gameCreationFailed = (message: string) => makeError(
	'GameCreationFailed',
	400,
	message
)

export const gameNotFound = (message: string) => makeError(
	'GameNotFound',
	400,
	message
)