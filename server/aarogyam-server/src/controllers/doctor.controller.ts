import { NextFunction, Request, Response } from "express";
import * as doctorService from "../services/doctor.service";
import {
  CreateDoctorSchema,
  DoctorUpdateSchema,
  SafeUser,
} from "../types/user.dto";
import Format from "../utils/format";

/**
 * Creates a new doctor.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the creation operation.
 */
export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user as SafeUser;
    // Validate the request body against the CreateDoctorSchema
    const validation = CreateDoctorSchema.safeParse({
      ...req.body,
      profileImage: req.file?.path,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result = await doctorService.create(user.id, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates an existing doctor.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user as SafeUser;
    // Validate the request body against the DoctorUpdateSchema
    const validation = DoctorUpdateSchema.safeParse({
      ...req.body,
      profileImage: req.file?.path,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result = await doctorService.updateDoctor(user.id, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes an existing doctor.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const doctorId = parseInt(req.params.id, 10);
    const result = await doctorService.deleteDoctor(doctorId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a doctor by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
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
