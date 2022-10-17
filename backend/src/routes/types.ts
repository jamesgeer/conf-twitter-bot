export class ServerError extends Error {
	private readonly httpStatus: number;

	constructor(httpStatus: number, message: string) {
		super(message);
		this.httpStatus = httpStatus;

		// required when extending a built-in class
		Object.setPrototypeOf(this, ServerError.prototype);
	}

	getMessage(): string {
		return this.message;
	}

	getStatusCode(): number {
		return this.httpStatus;
	}
}

export interface User {
	id: number;
	username: string;
}
