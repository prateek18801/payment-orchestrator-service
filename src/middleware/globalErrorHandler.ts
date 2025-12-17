import { Request, Response, NextFunction } from "express";
import { message } from "#config/constants.js";
import { AppError } from "#error/AppError.js";

async function ApplicationErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  // logging
  // metrics etc.

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.httpStatusCode).json({
      message: err.message,
      code: err.code
    });
  }

  return res.status(500).json({
    message: message.INT_SRVR_ERR,
    code: "INT_SRVR_ERR"
  });
}

export default ApplicationErrorHandler;
