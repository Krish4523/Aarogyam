import { NextFunction, Request, Response } from "express";
import Format from "../utils/format";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { prismaErrors } from "../utils/prisma.errors"; // Adjust the import path as needed

/**
 * Middleware to handle errors in the application.
 *
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param _
 */
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const status = err.statusCode || err.code || 500;
  const message = err.message || "Something went wrong";

  // Log error details if in development mode
  if (process.env.NODE_ENV === "development") {
    console.error(`[${req.method}] ${req.path} - Error: ${message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    res
      .status(400)
      .json(
        Format.error(
          400,
          "A known error occurred while processing your request.",
          prismaErrors[err.code]
        )
      );
  } else if (err instanceof PrismaClientUnknownRequestError) {
    res
      .status(500)
      .json(
        Format.internalError(
          message,
          "An unknown error occurred while processing your request."
        )
      );
  } else if (err instanceof PrismaClientRustPanicError) {
    res
      .status(500)
      .json(
        Format.internalError(
          message,
          "A Prisma Client Rust panic error occurred."
        )
      );
  } else if (err instanceof PrismaClientInitializationError) {
    res
      .status(500)
      .json(
        Format.internalError(
          message,
          "A Prisma Client initialization error occurred."
        )
      );
  } else if (err instanceof PrismaClientValidationError) {
    res
      .status(400)
      .json(
        Format.badRequest(
          null,
          "A validation error occurred with your request."
        )
      );
  } else {
    res.status(status).json(errorResponse);
  }
};

export default errorMiddleware;
