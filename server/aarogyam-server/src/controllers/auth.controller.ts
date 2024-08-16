import { NextFunction, Request, Response } from "express";
import httpStatus from "../utils/http-status";
import Format from "../utils/format";
import * as authService from "../services/auth.service";
import { UserSignUp } from "../types/user";
import { Role } from "@prisma/client";

/**
 * Handles user login requests.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the login request.
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(
          Format.badRequest(
            null,
            "Username or phone number and password are required"
          )
        );
    }

    const result: any = await authService.loginUser(email, phone, password);

    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles user sign-up requests.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the sign-up request.
 */
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(Format.badRequest(null, "All fields are required"));
    }

    const user: UserSignUp = {
      name,
      email,
      phone,
      password,
      role: Role.Patient,
    };

    const result: any = await authService.signUp(user);

    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles token verification requests.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the token verification request.
 */
export const verifyTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.params;
    if (!token) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(Format.badRequest(null, "Sorry Some error occurred"));
    }

    const result: any = await authService.verifyToken(token);

    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
