import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user.dto";
import Format from "../utils/format";
import * as userService from "../services/user.service";
import * as userDao from "../dao/user.dao";

/**
 * Handles the request to get the user information.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the get user request.
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Extract the authenticated user from the request
    const user = req.user as SafeUser;

    // Fetch the user information along with their role from the database
    const userWithRole = await userDao.getUserWithRole(user.id, user.role);

    // If user information is not found, return a 500 Internal Server Error response
    if (!userWithRole) return Format.error(500, "Some error occurred");

    const { password, ...safeUser } = userWithRole;

    // Return the user information with a 200 OK response
    return res.status(200).json(safeUser);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Handles the request to change the user's password.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the change password request.
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Extract the old and new passwords from the request body
    const { old_password, password } = req.body;

    // Extract the authenticated user from the request
    const user = req.user as SafeUser;

    // Call the userService to change the user's password
    const result: any = await userService.changePassword(
      old_password,
      password,
      user.id
    );

    // Return the result of the password change operation
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};
