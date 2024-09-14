import { Patient, PrismaClient } from "@prisma/client";

const patientClient = new PrismaClient().patient;

export const create = async (patient: { userId: number }): Promise<Patient> => {
  return patientClient.create({
    data: { userId: patient.userId },
  });
};

export const findPatientByUserId = async (
  userId: number
): Promise<Patient | null> => {
  return patientClient.findUnique({
    where: { userId },
  });
};

export const updatePatient = async (
  userId: number,
  patientData: Partial<Patient>
): Promise<Patient | null> => {
  return patientClient.update({
    where: {
      userId,
    },
    data: patientData,
  });
};
