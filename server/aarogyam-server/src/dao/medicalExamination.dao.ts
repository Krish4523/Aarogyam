import { MedicalExamination, PrismaClient } from "@prisma/client";
import { MedicalExaminationDTO } from "../types/medicalRecord.dto";

const medicalExaminationClient = new PrismaClient().medicalExamination;

/**
 * Creates a new medical examination.
 *
 * @param {MedicalExaminationDTO} data - The data for the new medical examination.
 * @returns {Promise<MedicalExamination>} A promise that resolves to the created medical examination.
 */
export const createMedicalExamination = async (
  data: MedicalExaminationDTO
): Promise<MedicalExamination> => {
  return medicalExaminationClient.create({
    data,
  });
};

/**
 * Retrieves all medical examinations.
 *
 * @returns {Promise<MedicalExamination[]>} A promise that resolves to the retrieved medical examinations.
 */
export const getAllMedicalExaminations = async (): Promise<
  MedicalExamination[]
> => {
  return medicalExaminationClient.findMany();
};

/**
 * Retrieves a specific medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to retrieve.
 * @returns {Promise<MedicalExamination | null>} A promise that resolves to the retrieved medical examination.
 */
export const getMedicalExaminationById = async (
  id: number
): Promise<MedicalExamination | null> => {
  return medicalExaminationClient.findUnique({
    where: { id },
  });
};

/**
 * Updates a medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to update.
 * @param {MedicalExaminationDTO} data - The data to update the medical examination with.
 * @returns {Promise<MedicalExamination>} A promise that resolves to the updated medical examination.
 */
export const updateMedicalExamination = async (
  id: number,
  data: MedicalExaminationDTO
): Promise<MedicalExamination> => {
  return medicalExaminationClient.update({
    where: { id },
    data,
  });
};

/**
 * Deletes a medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to delete.
 * @returns {Promise<MedicalExamination>} A promise that resolves to the deleted medical examination.
 */
export const deleteMedicalExamination = async (
  id: number
): Promise<MedicalExamination> => {
  return medicalExaminationClient.delete({
    where: { id },
  });
};
