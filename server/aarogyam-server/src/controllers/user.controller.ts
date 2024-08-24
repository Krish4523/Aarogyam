import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import { SafeUser } from "../types/user";
import Format from "../utils/format";
import * as userService from "../services/user.service";

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
    const user: SafeUser = req.user as SafeUser;
    if (!user) return Format.error(500, "Some error occurred");
    return res.status(200).json(user);
  } catch (error: unknown) {
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
    const { old_password, password } = req.body;
    const user = req.user as User;
    const result: any = await userService.changePassword(
      old_password,
      password,
      user.id
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles the request to update the user's information.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns A promise that resolves to the response of the update user request.
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user as User;
    const { name, phoneNumber, address } = req.body;
    const profileImage = req.file?.path;
    const result: any = await userService.updateUser(
      name,
      phoneNumber,
      address,
      profileImage,
      user.id
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
