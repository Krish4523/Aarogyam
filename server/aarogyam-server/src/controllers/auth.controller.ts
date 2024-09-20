import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { UserLoginSchema, UserSignUpSchema } from "../types/user.dto";
import Format from "../utils/format";

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
    // Validate the request body against the UserLoginSchema
    const validation = UserLoginSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    // Call the authService to handle the login logic
    const result: any = await authService.loginUser(validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
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
    // Validate the request body against the UserSignUpSchema
    const validation = UserSignUpSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.error(400, "Validation error", validation.error.errors));

    // Call the authService to handle the sign-up logic
    const result: any = await authService.signUp(validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
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
    // Extract the token from the request parameters
    const { token } = req.params;

    // Call the authService to handle the token verification logic
    const result: any = await authService.verifyToken(token);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
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
    // Extract the email from the request body
    const { email } = req.body;

    // Call the authService to handle the reset password email logic
    const result: any = await authService.sendResetPasswordMail(email);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
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
    // Extract the token from the request parameters and the new password from the request body
    const { token } = req.params;
    const { password } = req.body;

    // Call the authService to handle the password reset logic
    const result: any = await authService.resetPassword(password, token);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};
