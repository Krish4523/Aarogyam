import { NextFunction, Request, Response } from "express";
import * as medicalRecordService from "../services/medicalRecord.service";
import Format from "../utils/format";
import {
  MedicalRecordDetailSchema,
  MedicalRecordFileSchema,
  MedicalRecordSchema,
  MedicalRecordUpdateSchema,
} from "../types/medicalRecord.dto";
import { SafeUser } from "../types/user.dto";

/**
 * Deletes a medical record file.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteMedicalRecordFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.deleteMedicalRecordFile(
      req.user as SafeUser,
      parseInt(req.params.id, 10)
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a medical record detail.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteMedicalRecordDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.deleteMedicalRecordDetail(
      req.user as SafeUser,
      parseInt(req.params.id, 10)
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a medical record.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.deleteMedicalRecord(
      req.user as SafeUser,
      parseInt(req.params.id, 10)
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves all medical records.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
export const getAllMedicalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.getAllMedicalRecords(
      req.user as SafeUser
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Retrieves a medical record by ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
export const getMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.getMedicalRecord(
      req.user as SafeUser,
      parseInt(req.params.id, 10)
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Adds a medical record detail.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the addition operation.
 */
export const addMedicalRecordDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = MedicalRecordDetailSchema.safeParse(req.body);

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any = await medicalRecordService.addMedicalRecordDetail(
      req.user as SafeUser,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Adds a medical record file.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the addition operation.
 */
export const addMedicalRecordFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = MedicalRecordFileSchema.safeParse({
      medicalRecordId: parseInt(req.body.medicalRecordId, 10),
      name: req.file?.originalname,
      url: req.file?.path,
    });

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any = await medicalRecordService.addMedicalRecordFile(
      req.user as SafeUser,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates medical record details.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateMedicalRecordDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const result: any = await medicalRecordService.updateMedicalRecordDetails(
      req.user as SafeUser,
      parseInt(req.params.id, 10),
      req.body.result
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Adds a medical record.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the addition operation.
 */
export const addMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const files: any = req.files;

    const mappedFiles = files?.map((file) => ({
      name: file.originalname,
      url: file.path,
    }));

    // FIX
    const { details, ...body } = req.body;

    const validation = MedicalRecordSchema.safeParse({
      ...body,
      details: JSON.parse(details),
      files: mappedFiles,
    });

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any = await medicalRecordService.addMedicalRecord(
      req.user as SafeUser,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates a medical record.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = MedicalRecordUpdateSchema.safeParse(req.body);

    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    const result: any = await medicalRecordService.updateMedicalRecord(
      req.user as SafeUser,
      validation.data
    );
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
