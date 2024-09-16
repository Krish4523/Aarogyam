import * as medicationService from "../services/medication.service";
import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user.dto";
import Format from "../utils/format";
import { MedicationSchema } from "../types/medication.dto";

export const createMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const validation = MedicationSchema.safeParse({
    ...req.body,
  });
  if (!validation.success)
    return res
      .status(400)
      .json(Format.badRequest(validation.error.errors, "Validation error"));
  try {
    const result = await medicationService.createMedication(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const medicationId = parseInt(req.params.id, 10);
  try {
    const result = await medicationService.deleteAllMedication(medicationId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteMedicatonTime = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const medicationId = parseInt(req.params.id, 10);
  const { time } = req.body;
  try {
    const result = await medicationService.deleteAllMedicationByTime(
      medicationId,
      time
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  try {
    const result = await medicationService.getAllMedication(user.id);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateMedication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const validation = MedicationSchema.safeParse({
    ...req.body,
  });
  if (!validation.success)
    return res
      .status(400)
      .json(Format.badRequest(validation.error.errors, "Validation error"));
  try {
    const result = await medicationService.updateForMedication(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
