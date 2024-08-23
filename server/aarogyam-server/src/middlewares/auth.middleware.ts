import jwt from "jsonwebtoken";
import Format from "../utils/format";
import env from "../configs/env";
import * as userDao from "../dao/user.dao";
import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user";

/**
 * Middleware to verify the JWT token from the request.
 *
 * @param req - The request object.
 * @param _ - The response object (not used).
 * @param next - The next middleware function.
 * @returns A promise that resolves to the next middleware function.
 */
export const verifyJWT = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw Format.unAuthorized("Token not found");

    const { id }: any = await jwt.verify(token, env.JWT_SECRET);
    const user: any = await userDao.findSafeUserByID(id);

    if (!user) throw Format.unAuthorized("Invalid access token");

    req.user = user as SafeUser;

    next();
  } catch (error) {
    next(error);
  }
};
