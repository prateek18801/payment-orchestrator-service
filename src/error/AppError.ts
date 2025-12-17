export class AppError extends Error {

  public readonly code?: string;
  public readonly httpStatusCode: number;
  public readonly isOperational: boolean;

  constructor({
    message,
    code,
    httpStatusCode,
    isOperational = true
  }: {
    message: string,
    code?: string,
    httpStatusCode: number,
    isOperational?: boolean
  }) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype)

    this.code = code;
    this.httpStatusCode = httpStatusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
