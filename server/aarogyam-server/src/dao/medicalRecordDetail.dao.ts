import { MedicalRecordDetail, PrismaClient } from "@prisma/client";
import { MedicalRecordDetailDTO } from "../types/medicalRecord.dto";

const medicalRecordDetailClient = new PrismaClient().medicalRecordDetail;

/**
 * Updates a medical record detail by its ID.
 *
 * @param {number} id - The ID of the medical record detail to update.
 * @param {number} result - The result of the medical examination to update.
 * @returns {Promise<MedicalRecordDetail>} A promise that resolves to the updated medical record detail.
 */
export const updateMedicalRecord = async (
  id: number,
  result: number
): Promise<MedicalRecordDetail> => {
  return medicalRecordDetailClient.update({
    where: {
      id,
    },
    data: {
      result,
    },
  });
};

/**
 * Retrieves a medical record detail by its ID.
 *
 * @param {number} id - The ID of the medical record detail to retrieve.
 * @returns {Promise<MedicalRecordDetail | null>} A promise that resolves to the medical record detail if found, otherwise null.
 */
export const getById = async (
  id: number
): Promise<MedicalRecordDetail | null> => {
  return medicalRecordDetailClient.findUnique({
    where: {
      id,
    },
    include: {
      medicalRecord: true,
    },
  });
};

/**
 * Retrieves a medical record detail by medical record ID and examination reference ID.
 *
 * @param {number} medicalRecordId - The ID of the medical record.
 * @param {number} examinationReferenceId - The reference ID of the examination.
 * @returns {Promise<MedicalRecordDetail | null>} A promise that resolves to the medical record detail if found, otherwise null.
 */
export const getByRecordAndExaminationId = (
  medicalRecordId: number,
  examinationReferenceId: number
): Promise<MedicalRecordDetail | null> => {
  return medicalRecordDetailClient.findUnique({
    where: {
      medicalRecordId_examinationReferenceId: {
        medicalRecordId,
        examinationReferenceId,
      },
    },
  });
};

/**
 * Creates a new medical record detail.
 *
 * @param {MedicalRecordDetailDTO} data - The data for the new medical record detail.
 * @returns {Promise<MedicalRecordDetail | null>} A promise that resolves to the created medical record detail.
 */
export const create = (
  data: MedicalRecordDetailDTO
): Promise<MedicalRecordDetail | null> => {
  return medicalRecordDetailClient.create({
    data,
  });
};

/**
 * Deletes a medical record detail by its ID.
 *
 * @param {number} id - The ID of the medical record detail to delete.
 * @returns {Promise<MedicalRecordDetail>} A promise that resolves to the deleted medical record detail.
 */
export const deleteById = async (id: number) => {
  return medicalRecordDetailClient.delete({
    where: {
      id,
    },
  });
};
