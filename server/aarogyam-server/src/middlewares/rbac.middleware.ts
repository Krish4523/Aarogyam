import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to verify if the user has one of the specified roles.
 *
 * @param roles - An array of roles that are allowed to access the route.
 * @returns A middleware function that checks the user's role.
 */
export const verifyRole = (roles: Role[]) => {
  // @ts-ignore
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (roles.includes(userRole!)) {
      next();
    } else {
      return res.status(401).json("You don't have permission");
    }
  };
};
