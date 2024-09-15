import { NextFunction, Request, Response } from "express";
import * as patientService from "../services/patient.service";
import { SafeUser } from "../types/user";

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const userId = user.id;
  const { patientData, userData } = req.body;
  try {
    const result = await patientService.updatePatient(
      userId,
      patientData,
      userData
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
