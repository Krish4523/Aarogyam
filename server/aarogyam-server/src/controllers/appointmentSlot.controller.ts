import * as appointmentSlotService from "../services/appointmentSlot.service";
import { NextFunction, Request, Response } from "express";
import Format from "../utils/format";
import {
  AppointmentSlotSchema,
  AppointmentSlotUpdateSchema,
} from "../types/appointmentSlot.dto";
import { SafeUser } from "../types/user.dto";

export const createAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const validation = AppointmentSlotSchema.safeParse({
      ...req.body,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await appointmentSlotService.createAppointmentSlot(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const doctorId = parseInt(req.params.id, 10);

  try {
    const result = await appointmentSlotService.getAppointmentSlot(doctorId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const validation = AppointmentSlotUpdateSchema.safeParse({
    ...req.body,
  });
  if (!validation.success)
    return res
      .status(400)
      .json(Format.badRequest(validation.error.errors, "Validation error"));
  try {
    const result = await appointmentSlotService.updateAppointmentSlot(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const appointmentSlotId = parseInt(req.params.id, 10);
  try {
    const result = await appointmentSlotService.deleteSlot(appointmentSlotId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
