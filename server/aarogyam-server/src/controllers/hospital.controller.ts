import * as hospitalService from "../services/hospital.service";
import { NextFunction, Request, Response } from "express";
import { CreateHospitalDTO, SafeUser } from "../types/user";
// import * as doctorService from "../services/doctor.service";
// import {Hospital} from "@prisma/client";

export const createHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // const user: SafeUser = req.user as SafeUser;
  // const userId = user.id;
  const hospitalData = req.body as CreateHospitalDTO;
  try {
    const result = await hospitalService.createHospital(hospitalData);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

// export const updateHospital = async();

export const deleteHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const hospitalId = parseInt(req.params.id, 10);
  try {
    const result = await hospitalService.deleteHospital(hospitalId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const hospitalId = parseInt(req.params.id, 10);
  try {
    const result = await hospitalService.getHospital(hospitalId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const userId = user.id;
  const { hospitalData } = req.body;
  try {
    const result = await hospitalService.updateHospital(userId, hospitalData);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
