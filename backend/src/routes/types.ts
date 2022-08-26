export class ServerError extends Error {
	private readonly httpStatus: number;

	constructor(httpStatus: number, message: string) {
		super(message);
		this.httpStatus = httpStatus;

		// required when extending a built-in class
		Object.setPrototypeOf(this, ServerError.prototype);
	}

	getErrorMessage(): string {
		return this.message;
	}

	getStatusCode(): number {
		return this.httpStatus;
	}
}
