import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super({
      message,
      httpStatusCode: 401,
      code: "UNAUTHORIZED"
    });
  }
}
