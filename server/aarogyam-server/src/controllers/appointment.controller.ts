import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user.dto";

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    // const appointmentData = req.body;
  } catch (error: unknown) {
    next(error);
  }
};
