import { NextFunction, Request, Response } from "express";
import * as doctorService from "../services/doctor.service";
import { CreateDoctorDTO, SafeUser } from "../types/user";

export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const hospitalId = user.id;
  const doctorData = req.body as CreateDoctorDTO;
  try {
    const result = await doctorService.create(hospitalId, doctorData);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const userId = user.id;
  const { userData, doctorData } = req.body;
  try {
    const result = await doctorService.updateDoctor(
      userId,
      userData,
      doctorData
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const doctorId = parseInt(req.params.id, 10);
  try {
    const result = await doctorService.deleteDoctor(doctorId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const doctorId = parseInt(req.params.id, 10);
  try {
    const result = await doctorService.getDoctor(doctorId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
