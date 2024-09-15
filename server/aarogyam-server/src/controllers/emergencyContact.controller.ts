import { NextFunction, Request, Response } from "express";
import * as emergnecyContact from "../services/emergencyContact.service";
import { SafeUser } from "../types/user";

export const addEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const userId = user.id;
  const contactData = req.body;
  try {
    const result = await emergnecyContact.addContact(userId, contactData);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const contactData = req.body;

  try {
    const result = await emergnecyContact.updateContact(contactData);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteEmergencyContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // const userId = req.params.userId;
  const contactId = parseInt(req.params.id, 10); // Assuming contactId is passed as a route parameter

  try {
    const result = await emergnecyContact.deleteContact(contactId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const getEmergencyContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user: SafeUser = req.user as SafeUser;
  const userId = user.id;
  try {
    const result = await emergnecyContact.getContact(userId);
    return res.status(result.code).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
