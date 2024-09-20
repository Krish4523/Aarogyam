import * as prescriptionService from "../services/prescription.service";
import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user.dto";
import Format from "../utils/format";
import {
  PrescriptionSchema,
  PrescriptionUpdateSchema,
} from "../types/prescription.dto";

export const createPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const validation = PrescriptionSchema.safeParse({
      ...req.body,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await prescriptionService.create(user.id, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deletePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const prescriptionId = parseInt(req.params.id, 10);

  try {
    const result = await prescriptionService.deletePrescription(prescriptionId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updatePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const prescriptionId = parseInt(req.params.id, 10);
    const user: SafeUser = req.user as SafeUser;
    const validation = PrescriptionUpdateSchema.safeParse({
      ...req.body,
    });
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await prescriptionService.updatePrescription(
      prescriptionId,
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllPrescriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const prescriptionId = parseInt(req.params.id, 10);
    const result = await prescriptionService.getAllPrescriptionById(
      prescriptionId
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const result = await prescriptionService.getAll(user);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
