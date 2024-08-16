import { NextFunction, Request, Response } from "express";
import Format from "../utils/format";
import { User } from "@prisma/client";
import { SafeUser } from "../types/user";

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
    const user: SafeUser = req.user as User;
    if (!user) return Format.error(500, "Some error occurred");
    return res.status(200).json(user);
  } catch (error: unknown) {
    next(error);
  }
};
