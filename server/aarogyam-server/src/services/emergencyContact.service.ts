import * as emergencyContactDao from "../dao/emergencyContact.dao";
import Format from "../utils/format";
import { EmergencyContacts } from "@prisma/client";
import * as patientDao from "../dao/patient.dao";

export const getPatientIdByUserId = async (
  userId: number
): Promise<number | null> => {
  const patient = await patientDao.findPatientByUserId(userId);
  return patient ? patient.id : null;
};

export const addContact = async (
  userId: number,
  contactData: Partial<EmergencyContacts>
): Promise<any> => {
  const patientId = await getPatientIdByUserId(userId);
  if (!patientId) {
    return Format.notFound("Patient does not exist");
  }
  if (!contactData.name || !contactData.phone || !contactData.relation) {
    return Format.badRequest("Name,phone,and relation are required");
  }
  const contact = await emergencyContactDao.create(patientId, contactData);
  return Format.success(contact, "Emergency contact added successfully");
};

export const updateContact = async (
  contactData: Partial<EmergencyContacts>
): Promise<any> => {
  if (!contactData) {
    return Format.notFound("Contact does not exist");
  }

  const contactId = contactData.id!;
  const existingContact = await emergencyContactDao.findByContactId(contactId);

  if (!existingContact) {
    return Format.notFound("Emergency contact not found");
  }
  const updatedContact = await emergencyContactDao.updateContact(contactData);
  return Format.success(
    updatedContact,
    "Emergency contact updated successfully"
  );
};

export const deleteContact = async (contactId: number): Promise<any> => {
  if (!contactId) {
    return Format.notFound("Contact does not exist");
  }

  const deletedContact = await emergencyContactDao.deleteContact(contactId);
  return Format.success(
    deletedContact,
    "Emergency contact delete successfully"
  );
};

export const getContact = async (userId: number): Promise<any> => {
  const patientId = await getPatientIdByUserId(userId);
  if (!patientId) {
    return Format.notFound("Patient does not exist");
  }
  const contacts = await emergencyContactDao.getContacts(patientId);
  return Format.success(contacts, "Emergency contacts fetched successfully");
};
