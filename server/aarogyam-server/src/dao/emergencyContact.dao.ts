import { EmergencyContacts, PrismaClient } from "@prisma/client";

const emergencyContact = new PrismaClient().emergencyContacts;

export const create = async (
  patientId: number,
  contactData: Partial<EmergencyContacts>
): Promise<EmergencyContacts> => {
  return emergencyContact.create({
    data: {
      patientId,
      name: contactData.name!,
      phone: contactData.phone!,
      relation: contactData.relation!,
    },
  });
};

export const findByContactId = async (
  id: number
): Promise<EmergencyContacts | null> => {
  return emergencyContact.findUnique({
    where: {
      id,
    },
  });
};

export const updateContact = async (
  contactData: Partial<EmergencyContacts>
): Promise<EmergencyContacts | null> => {
  return emergencyContact.update({
    where: {
      id: contactData.id,
    },
    data: contactData,
  });
};

export const deleteContact = async (
  id: number
): Promise<EmergencyContacts | null> => {
  return emergencyContact.delete({
    where: {
      id,
    },
  });
};

export const getContacts = async (
  id: number
): Promise<EmergencyContacts[] | null> => {
  return emergencyContact.findMany({
    where: {
      patientId: id,
    },
  });
};
