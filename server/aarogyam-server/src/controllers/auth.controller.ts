import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

/**
 * Handles user login requests.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the login request.
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, phone, password } = req.body;
    const result: any = await authService.loginUser(email, phone, password);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles user sign-up requests.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the sign-up request.
 */
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, email, phone, password } = req.body;
    const result: any = await authService.signUp(name, email, phone, password);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles token verification requests.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the token verification request.
 */
export const verifyTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.params;
    const result: any = await authService.verifyToken(token);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles requests to send a reset password email.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the reset password email request.
 */
export const sendRestPasswordMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    const result: any = await authService.sendResetPasswordMail(email);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles requests to reset a user's password.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the password reset request.
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result: any = await authService.resetPassword(password, token);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
