import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const verifyRole = (roles: Role[]) => {
  // @ts-ignore
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).send("Not authorized");
    }
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      return res.status(401).json("You don't have permission");
    }
  };
};
