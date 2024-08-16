import jwt from "jsonwebtoken";
import env from "../configs/env.ts";

/**
 * Interface representing the payload for the JWT.
 *
 * @interface Payload
 * @property {number} id - The user ID.
 * @property {string} email - The user email.
 */
export interface Payload {
  id: number;
  email: string;
}

/**
 * Generates JWT tokens.
 *
 * @param {Payload} payload - The payload to include in the JWT.
 * @returns {{ accessToken: string }} An object containing the generated access token.
 */
export const generateTokens = (payload: Payload): { accessToken: string } => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "30d",
    algorithm: "HS256",
  });

  return { accessToken };
};
