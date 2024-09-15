import * as emergencyContactDao from "../dao/emergencyContact.dao";
import Format from "../utils/format";
import * as patientDao from "../dao/patient.dao";
import { ContactDTO, ContactUpdateDTO } from "../types/contact.dto";

/**
 * Retrieves the patient ID associated with a given user ID.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number | null>} The patient ID if found, otherwise null.
 */
const getPatientIdByUserId = async (userId: number): Promise<number | null> => {
  // Find patient by user ID
  const patient = await patientDao.findPatientByUserId(userId);
  // Return patient ID if found, otherwise null
  return patient ? patient.id : null;
};

/**
 * Adds a new emergency contact for a patient.
 *
 * @param {number} userId - The ID of the user.
 * @param {ContactDTO} contactData - The data of the contact to be added.
 * @returns {Promise<any>} The result of the addition operation.
 */
export const addContact = async (
  userId: number,
  contactData: ContactDTO
): Promise<any> => {
  // Get patient ID by user ID
  const patientId = await getPatientIdByUserId(userId);
  // If patient does not exist, return not found response
  if (!patientId) return Format.notFound("Patient does not exist");
  // Create a new emergency contact for the patient
  const contact = await emergencyContactDao.create(patientId, contactData);
  // Return success response with the created contact
  return Format.success(contact, "Emergency contact added successfully");
};

/**
 * Updates an existing emergency contact for a patient.
 *
 * @param {number} userId - The ID of the user.
 * @param {ContactUpdateDTO} contactData - The updated data of the contact.
 * @returns {Promise<any>} The result of the update operation.
 */
export const updateContact = async (
  userId: number,
  contactData: ContactUpdateDTO
): Promise<any> => {
  // Get patient ID by user ID
  const patientId = await getPatientIdByUserId(userId);
  // If patient does not exist, return not found response
  if (!patientId) return Format.notFound("Patient does not exist");

  // Get contact ID from the contact data
  const contactId = contactData.id;
  // Find existing contact by contact ID and patient ID
  const existingContact = await emergencyContactDao.findByContactIdAndPatientId(
    contactId,
    patientId
  );

  // If contact does not exist, return not found response
  if (!existingContact)
    return Format.notFound(
      "Emergency contact not found Or Patient doesn't have authorization to update this contact"
    );

  // Update the existing contact with the new data
  const updatedContact = await emergencyContactDao.updateContact(contactData);
  // Return success response with the updated contact
  return Format.success(
    updatedContact,
    "Emergency contact updated successfully"
  );
};

/**
 * Deletes an existing emergency contact for a patient.
 *
 * @param {number} userId - The ID of the user.
 * @param {number} contactId - The ID of the contact to be deleted.
 * @returns {Promise<any>} The result of the deletion operation.
 */
export const deleteContact = async (
  userId: number,
  contactId: number
): Promise<any> => {
  // Get patient ID by user ID
  const patientId = await getPatientIdByUserId(userId);
  // If patient does not exist, return not found response
  if (!patientId) return Format.notFound("Patient does not exist");

  // Find existing contact by contact ID and patient ID
  const existingContact = await emergencyContactDao.findByContactIdAndPatientId(
    contactId,
    patientId
  );

  // If contact does not exist, return not found response
  if (!existingContact)
    return Format.notFound(
      "Emergency contact not found Or Patient doesn't have authorization to update this contact"
    );

  // Delete the existing contact
  const deletedContact = await emergencyContactDao.deleteContact(contactId);
  // Return success response with the deleted contact
  return Format.success(
    deletedContact,
    "Emergency contact delete successfully"
  );
};

/**
 * Retrieves all emergency contacts for a patient.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<any>} The result of the retrieval operation.
 */
export const getContact = async (userId: number): Promise<any> => {
  // Get patient ID by user ID
  const patientId = await getPatientIdByUserId(userId);
  // If patient does not exist, return not found response
  if (!patientId) return Format.notFound("Patient does not exist");
  // Retrieve all contacts by patient ID
  const contacts = await emergencyContactDao.getContactsByPatientId(patientId);
  // Return success response with the retrieved contacts
  return Format.success(contacts, "Emergency contacts fetched successfully");
};
