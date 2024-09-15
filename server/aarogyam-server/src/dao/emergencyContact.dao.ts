import { EmergencyContacts, PrismaClient } from "@prisma/client";
import { ContactDTO, ContactUpdateDTO } from "../types/contact.dto";

const emergencyContact = new PrismaClient().emergencyContacts;

/**
 * Creates a new emergency contact for a patient.
 *
 * @param patientId - The ID of the patient.
 * @param contactData - The data of the contact to be created.
 * @returns A promise that resolves to the created emergency contact.
 */
export const create = async (
  patientId: number,
  contactData: ContactDTO
): Promise<EmergencyContacts> => {
  return emergencyContact.create({
    data: {
      patientId,
      ...contactData,
    },
  });
};

/**
 * Finds an emergency contact by contact ID and patient ID.
 *
 * @param id - The ID of the contact.
 * @param patientId - The ID of the patient.
 * @returns A promise that resolves to the found emergency contact or null if not found.
 */
export const findByContactIdAndPatientId = async (
  id: number,
  patientId: number
): Promise<EmergencyContacts | null> => {
  return emergencyContact.findUnique({
    where: {
      id,
      patientId,
    },
  });
};

/**
 * Updates an existing emergency contact.
 *
 * @param contactData - The data of the contact to be updated.
 * @returns A promise that resolves to the updated emergency contact or null if not found.
 */
export const updateContact = async (
  contactData: ContactUpdateDTO
): Promise<EmergencyContacts | null> => {
  return emergencyContact.update({
    where: {
      id: contactData.id,
    },
    data: contactData,
  });
};

/**
 * Deletes an emergency contact by ID.
 *
 * @param id - The ID of the contact to be deleted.
 * @returns A promise that resolves to the deleted emergency contact or null if not found.
 */
export const deleteContact = async (
  id: number
): Promise<EmergencyContacts | null> => {
  return emergencyContact.delete({
    where: {
      id,
    },
  });
};

/**
 * Retrieves all emergency contacts for a given patient ID.
 *
 * @param patientId - The ID of the patient.
 * @returns A promise that resolves to an array of emergency contacts or null if none found.
 */
export const getContactsByPatientId = async (
  patientId: number
): Promise<EmergencyContacts[] | null> => {
  return emergencyContact.findMany({
    where: {
      patientId,
    },
  });
};
