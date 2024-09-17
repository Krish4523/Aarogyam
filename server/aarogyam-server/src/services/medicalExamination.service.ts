import { MedicalExaminationDTO } from "../types/medicalRecord.dto";
import * as medicalExaminationDao from "../dao/medicalExamination.dao";
import Format from "../utils/format";

/**
 * Creates a new medical examination.
 *
 * @param {MedicalExaminationDTO} data - The data for the new medical examination.
 * @returns {Promise<object>} A promise that resolves to the created medical examination.
 */
export const createMedicalExamination = async (
  data: MedicalExaminationDTO
): Promise<object> => {
  const medicalExamination =
    await medicalExaminationDao.createMedicalExamination(data);
  return Format.success(
    medicalExamination,
    "Medical Examination created successfully"
  );
};

/**
 * Retrieves all medical examinations.
 *
 * @returns {Promise<object>} A promise that resolves to the retrieved medical examinations.
 */
export const getAllMedicalExaminations = async (): Promise<object> => {
  const medicalExaminations =
    await medicalExaminationDao.getAllMedicalExaminations();
  return Format.success(medicalExaminations);
};

/**
 * Retrieves a specific medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to retrieve.
 * @returns {Promise<object>} A promise that resolves to the retrieved medical examination.
 */
export const getMedicalExaminationById = async (
  id: number
): Promise<object> => {
  const medicalExamination =
    await medicalExaminationDao.getMedicalExaminationById(id);
  if (!medicalExamination)
    return Format.notFound("Medical Examination not found");
  return Format.success(medicalExamination);
};

/**
 * Updates a medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to update.
 * @param {MedicalExaminationDTO} data - The data to update the medical examination with.
 * @returns {Promise<object>} A promise that resolves to the updated medical examination.
 */
export const updateMedicalExamination = async (
  id: number,
  data: MedicalExaminationDTO
): Promise<object> => {
  const medicalExamination =
    await medicalExaminationDao.updateMedicalExamination(id, data);
  return Format.success(
    medicalExamination,
    "Medical Examination updated successfully"
  );
};

/**
 * Deletes a medical examination by ID.
 *
 * @param {number} id - The ID of the medical examination to delete.
 * @returns {Promise<object>} A promise that resolves to the result of the deletion operation.
 */
export const deleteMedicalExamination = async (id: number): Promise<object> => {
  await medicalExaminationDao.deleteMedicalExamination(id);
  return Format.success({}, "Medical Examination deleted successfully");
};
