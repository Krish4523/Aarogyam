import * as hospitalService from "../services/hospital.service";
import { NextFunction, Request, Response } from "express";
import {
  HospitalCreateSchema,
  HospitalUpdateSchema,
  SafeUser,
} from "../types/user.dto";
import Format from "../utils/format";

/**
 * Controller to create a new hospital.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the creation operation.
 */
export const createHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = HospitalCreateSchema.safeParse({
      ...req.body,
      profileImage: req.file?.path,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await hospitalService.createHospital(validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Controller to delete an existing hospital.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
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

/**
 * Controller to get hospital details by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
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

/**
 * Controller to update an existing hospital.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;
    const validation = HospitalUpdateSchema.safeParse({
      ...req.body,
      profileImage: req.file?.path,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));
    const result = await hospitalService.updateHospital(
      user.id,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
