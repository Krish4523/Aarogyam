import { Patient, PrismaClient } from "@prisma/client";

const patientClient = new PrismaClient().patient;

/**
 * Creates a new patient record.
 *
 * @param patient - An object containing the user ID of the patient.
 * @returns A promise that resolves to the created patient record.
 */
export const create = async (patient: { userId: number }): Promise<Patient> => {
  return patientClient.create({
    data: { userId: patient.userId },
  });
};

/**
 * Finds a patient record by user ID.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the found patient record or null if not found.
 */
export const findPatientByUserId = async (
  userId: number
): Promise<Patient | null> => {
  return patientClient.findUnique({
    where: { userId },
  });
};

/**
 * Updates an existing patient record.
 *
 * @param userId - The ID of the user.
 * @param patientData - An object containing the patient data to be updated.
 * @returns A promise that resolves to the updated patient record or null if not found.
 */
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
