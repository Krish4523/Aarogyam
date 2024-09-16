import { MedicalRecordFile, PrismaClient } from "@prisma/client";
import { MedicalRecordFileDTO } from "../types/medicalRecord.dto";

const medicalRecordFileClient = new PrismaClient().medicalRecordFile;

/**
 * Creates a new medical record file.
 *
 * @param {MedicalRecordFileDTO} data - The data for the new medical record file.
 * @returns {Promise<MedicalRecordFile | null>} A promise that resolves to the created medical record file.
 */
export const create = (
  data: MedicalRecordFileDTO
): Promise<MedicalRecordFile | null> => {
  return medicalRecordFileClient.create({
    data,
  });
};

/**
 * Deletes a medical record file by its ID.
 *
 * @param {number} id - The ID of the medical record file to delete.
 * @returns {Promise<MedicalRecordFile>} A promise that resolves to the deleted medical record file.
 */
export const deleteById = async (id: number) => {
  return medicalRecordFileClient.delete({
    where: {
      id,
    },
  });
};