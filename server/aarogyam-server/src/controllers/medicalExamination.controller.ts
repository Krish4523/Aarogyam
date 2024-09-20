import { NextFunction, Request, Response } from "express";
import { MedicalExaminationSchema } from "../types/medicalRecord.dto";
import * as medicalExaminationService from "../services/medicalExamination.service";
import Format from "../utils/format";

/**
 * Creates a new medical examination.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the creation operation.
 */
export const createMedicalExamination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = MedicalExaminationSchema.safeParse(req.body);

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any =
      await medicalExaminationService.createMedicalExamination(validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves all medical examinations.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the retrieved medical examinations.
 */
export const getAllMedicalExaminations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any =
      await medicalExaminationService.getAllMedicalExaminations();
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a specific medical examination by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the retrieved medical examination.
 */
export const getMedicalExaminationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any =
      await medicalExaminationService.getMedicalExaminationById(
        parseInt(req.params.id, 10)
      );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates a medical examination by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateMedicalExamination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = MedicalExaminationSchema.safeParse(req.body);

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any =
      await medicalExaminationService.updateMedicalExamination(
        parseInt(req.params.id, 10),
        validation.data
      );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a medical examination by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteMedicalExamination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any =
      await medicalExaminationService.deleteMedicalExamination(
        parseInt(req.params.id, 10)
      );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
