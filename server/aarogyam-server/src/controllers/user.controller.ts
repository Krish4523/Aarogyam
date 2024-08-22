import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import { SafeUser } from "../types/user";

import httpStatus from "../utils/http-status";
import Format from "../utils/format";
import * as userService from "../services/user.service";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

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

/*
 * User can change password after authentication
 * */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { old_password, password, password_confirmation } = req.body;
    const userId = parseInt(req.params.id, 10);
    console.log("userId:", userId);
    if (!password || !password_confirmation || !old_password) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(Format.badRequest(null, "All fields are required!"));
    }
    const result: any = await userService.changePassword(
      old_password,
      password,
      password_confirmation,
      userId
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
