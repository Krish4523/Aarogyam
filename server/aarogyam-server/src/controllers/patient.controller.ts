import { NextFunction, Request, Response } from "express";
import * as patientService from "../services/patient.service";
import { PatientUpdateSchema, SafeUser } from "../types/user.dto";
import Format from "../utils/format";

/**
 * Updates patient information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the update patient request.
 */
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Extract the authenticated user from the request
    const user: SafeUser = req.user as SafeUser;

    // Validate the request body against the PatientUpdateDTOSchema
    const validation = PatientUpdateSchema.safeParse({
      ...req.body,
      profileImage: req.file?.path,
    });

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    // Call the patientService to handle the update patient logic
    const result = await patientService.updatePatient(user, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};
