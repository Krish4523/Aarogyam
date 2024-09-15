import { NextFunction, Request, Response } from "express";
import * as contactService from "../services/contact.service";
import { SafeUser } from "../types/user.dto";
import Format from "../utils/format";
import { ContactSchema, ContactUpdateSchema } from "../types/contact.dto";

/**
 * Adds an emergency contact for the user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the add contact request.
 */
export const addEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;

    // Validate the request body against the ContactSchema
    const validation = ContactSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    // Call the contactService to handle the add contact logic
    const result = await contactService.addContact(user.id, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Updates an emergency contact for the user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the update contact request.
 */
export const updateEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: SafeUser = req.user as SafeUser;

    // Validate the request body against the ContactUpdateSchema
    const validation = ContactUpdateSchema.safeParse(req.body);

    // If validation fails, return a 400 Bad Request response with validation errors
    if (!validation.success)
      return res
        .status(400)
        .json(Format.badRequest(validation.error.errors, "Validation error"));

    // Call the contactService to handle the update contact logic
    const result = await contactService.updateContact(user.id, validation.data);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Deletes an emergency contact for the user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the delete contact request.
 */
export const deleteEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const contactId = parseInt(req.params.id, 10);
  try {
    // Call the contactService to handle the delete contact logic
    const result = await contactService.deleteContact(user.id, contactId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};

/**
 * Retrieves the emergency contacts for the user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<any>} A promise that resolves to the response of the get contacts request.
 */
export const getEmergencyContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  try {
    // Call the contactService to handle the get contacts logic
    const result = await contactService.getContact(user.id);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    // Pass any errors to the next middleware
    next(error);
  }
};
