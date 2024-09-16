import { MedicalRecord, PrismaClient } from "@prisma/client";
import {
  MedicalRecordDTO,
  MedicalRecordUpdateDTO,
} from "../types/medicalRecord.dto";

const medicalRecordClient = new PrismaClient().medicalRecord;

/**
 * Deletes a medical record by its ID.
 *
 * @param {number} id - The ID of the medical record to delete.
 * @returns {Promise<MedicalRecord>} A promise that resolves to the deleted medical record.
 */
export const deleteById = async (id: number) => {
  return medicalRecordClient.delete({
    where: {
      id,
    },
  });
};

/**
 * Retrieves a medical record by its ID, including all related details.
 *
 * @param {number} id - The ID of the medical record to retrieve.
 * @returns {Promise<MedicalRecord | null>} A promise that resolves to the medical record if found, otherwise null.
 */
export const getMedicalRecordByIdWithAllDetails = async (
  id: number
): Promise<MedicalRecord | null> => {
  return medicalRecordClient.findUnique({
    where: {
      id,
    },
    include: {
      patient: true,
      doctor: true,
      files: true,
      details: {
        include: {
          examination: true,
        },
      },
    },
  });
};

/**
 * Retrieves medical records by doctor ID.
 *
 * @param {number} doctorId - The ID of the doctor whose medical records to retrieve.
 * @returns {Promise<MedicalRecord[] | null>} A promise that resolves to an array of medical records if found, otherwise null.
 */
export const getByDoctorId = async (
  doctorId: number
): Promise<MedicalRecord[] | null> => {
  return medicalRecordClient.findMany({
    where: {
      doctorId,
    },
  });
};

/**
 * Retrieves medical records by patient ID.
 *
 * @param {number} patientId - The ID of the patient whose medical records to retrieve.
 * @returns {Promise<MedicalRecord[] | null>} A promise that resolves to an array of medical records if found, otherwise null.
 */
export const getByPatientId = async (
  patientId: number
): Promise<MedicalRecord[] | null> => {
  return medicalRecordClient.findMany({
    where: {
      patientId,
    },
  });
};

/**
 * Retrieves a medical record by its ID.
 *
 * @param {number} id - The ID of the medical record to retrieve.
 * @returns {Promise<MedicalRecord | null>} A promise that resolves to the medical record if found, otherwise null.
 */
export const getMedicalRecordById = async (
  id: number
): Promise<MedicalRecord | null> => {
  return medicalRecordClient.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Updates a medical record by its ID.
 *
 * @param {number} id - The ID of the medical record to update.
 * @param {Partial<MedicalRecordUpdateDTO>} data - The data to update the medical record with.
 * @returns {Promise<MedicalRecord>} A promise that resolves to the updated medical record.
 */
export const updateMedicalRecord = async (
  id: number,
  data: Partial<MedicalRecordUpdateDTO>
): Promise<MedicalRecord> => {
  return medicalRecordClient.update({
    where: {
      id,
    },
    data,
    include: {
      files: true,
      details: true,
    },
  });
};

/**
 * Retrieves a medical record by its ID, patient ID, and optionally doctor ID.
 *
 * @param {number} id - The ID of the medical record to retrieve.
 * @param {number} patientId - The ID of the patient associated with the medical record.
 * @param {number | undefined} doctorId - The ID of the doctor associated with the medical record (optional).
 * @returns {Promise<MedicalRecord | null>} A promise that resolves to the medical record if found, otherwise null.
 */
export const getMedicalRecordByIds = async (
  id: number,
  patientId: number,
  doctorId: number | undefined
): Promise<MedicalRecord | null> => {
  await medicalRecordClient.findUnique({
    where: {
      id,
      patientId,
      ...(doctorId !== undefined && { doctorId }),
    },
  });
};

/**
 * Adds a new medical record.
 *
 * @param {MedicalRecordDTO} medicalRecordData - The data for the new medical record.
 * @returns {Promise<MedicalRecord>} A promise that resolves to the created medical record.
 */
export const addMedicalRecord = async (medicalRecordData: MedicalRecordDTO) => {
  const { details, files, ...data_ } = medicalRecordData;
  const data = data_ as MedicalRecordDTO & { patientId: number };
  return medicalRecordClient.create({
    data: {
      ...data,
      files: {
        create: files,
      },
      details: {
        create: details,
      },
    },
    include: {
      files: true,
      details: true,
    },
  });
};
