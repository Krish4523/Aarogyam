import jwt from "jsonwebtoken";
import Format from "../utils/format";
import env from "../configs/env";
import * as userDao from "../dao/user.dao";
import { Payload } from "../utils/generateAccessToken";
import { SafeUser } from "../types/user";

/**
 * Middleware to verify the JWT token from the request.
 *
 * @param req - The request object.
 * @param _ - The response object (not used).
 * @param next - The next middleware function.
 * @returns A promise that resolves to the next middleware function.
 */
export const verifyJWT = async (req, _, next) => {
  try {
    // Extract the token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is not found, respond with unauthorized error
    if (!token) Format.unAuthorized("Token not found");

    // Verify the token and extract the payload
    const { id }: Payload = await jwt.verify(token, env.JWT_SECRET);

    // Find the user by ID from the payload
    const user: SafeUser = await userDao.findByID(id);

    // If user is not found, respond with unauthorized error
    if (!user) Format.unAuthorized("Invalid access token");

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};
