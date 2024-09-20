import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../types/user.dto";
import Format from "../utils/format";
import {
  AppointmentSchema,
  AppointmentUpdateSchema,
} from "../types/appointment.dto";
import * as appointmentService from "../services/appointment.service";

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const validation = AppointmentSchema.safeParse({
      ...req.body,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await appointmentService.createAppointment(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const result = await appointmentService.getAllAppointmentByRole(user);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const validation = AppointmentUpdateSchema.safeParse({
      ...req.body,
    });
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result = await appointmentService.updateAppointmentByRole(
      user,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
