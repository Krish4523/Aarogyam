import { SafeUser } from "../types/user.dto";
import {
  MedicalRecordDetailDTO,
  MedicalRecordDTO,
  MedicalRecordFileDTO,
  MedicalRecordUpdateDTO,
} from "../types/medicalRecord.dto";
import {
  Doctor,
  MedicalRecord,
  MedicalRecordDetail,
  Patient,
  Role,
  User,
} from "@prisma/client";
import Format from "../utils/format";
import * as userDao from "../dao/user.dao";
import * as medicalRecordDao from "../dao/medicalRecord.dao";
import * as medicalRecordDetailDao from "../dao/medicalRecordDetail.dao";
import * as medicalRecordFileDao from "../dao/medicalRecordFile.dao";

/**
 * Checks if the user has permission to access the medical record.
 *
 * @param {MedicalRecord} medicalRecord - The medical record to check.
 * @param {SafeUser} user - The user to check permissions for.
 * @returns {Promise<boolean>} - True if the user has permission, false otherwise.
 */
const hasPermission = async (
  medicalRecord: MedicalRecord,
  user: SafeUser
): Promise<boolean> => {
  if (user.role === Role.DOCTOR) {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };

    return userDoctor.doctor.id !== medicalRecord.doctorId;
  } else {
    const userPatient = (await userDao.getUserWithRole(
      user.id,
      Role.PATIENT
    )) as User & { patient: Patient };

    return userPatient.patient.id === medicalRecord.patientId;
  }
};

/**
 * Deletes a medical record by ID.
 *
 * @param {SafeUser} user - The user requesting the deletion.
 * @param {number} id - The ID of the medical record to delete.
 * @returns {Promise<object>} - The result of the deletion operation.
 */
export const deleteMedicalRecord = async (user: SafeUser, id: number) => {
  const medicalRecord = await medicalRecordDao.getMedicalRecordById(id);
  if (!medicalRecord) return Format.notFound("Medical Record Not found");
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");
  await medicalRecordDao.deleteById(medicalRecord.id);
  return Format.success({}, "Medical Record Deleted");
};

/**
 * Deletes a medical record detail by ID.
 *
 * @param {SafeUser} user - The user requesting the deletion.
 * @param {number} id - The ID of the medical record detail to delete.
 * @returns {Promise<object>} - The result of the deletion operation.
 */
export const deleteMedicalRecordDetail = async (user: SafeUser, id: number) => {
  const medicalRecordDetail = await medicalRecordDetailDao.getById(id);
  if (!medicalRecordDetail) return Format.notFound("Medical Record Not found");
  const { medicalRecord } = medicalRecordDetail as MedicalRecordDetail & {
    medicalRecord: MedicalRecord;
  };
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");

  await medicalRecordDetailDao.deleteById(medicalRecordDetail.id);
  return Format.success({}, "Medical Record Deleted");
};

/**
 * Deletes a medical record file by ID.
 *
 * @param {SafeUser} user - The user requesting the deletion.
 * @param {number} id - The ID of the medical record file to delete.
 * @returns {Promise<object>} - The result of the deletion operation.
 */
export const deleteMedicalRecordFile = async (user: SafeUser, id: number) => {
  const medicalRecordDetail = await medicalRecordDetailDao.getById(id);
  if (!medicalRecordDetail) return Format.notFound("Medical Record Not found");
  const { medicalRecord } = medicalRecordDetail as MedicalRecordDetail & {
    medicalRecord: MedicalRecord;
  };
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");

  await medicalRecordFileDao.deleteById(medicalRecordDetail.id);
  return Format.success({}, "Medical Record Deleted");
};

/**
 * Retrieves a medical record by ID.
 *
 * @param {SafeUser} user - The user requesting the medical record.
 * @param {number} id - The ID of the medical record to retrieve.
 * @returns {Promise<object>} - The retrieved medical record.
 */
export const getMedicalRecord = async (user: SafeUser, id: number) => {
  const medicalRecord =
    await medicalRecordDao.getMedicalRecordByIdWithAllDetails(id);
  if (!medicalRecord) return Format.notFound("No medical record found");
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");
  return Format.success(medicalRecord);
};

/**
 * Retrieves all medical records for the user.
 *
 * @param {SafeUser} user - The user requesting the medical records.
 * @returns {Promise<object>} - The retrieved medical records.
 */
export const getAllMedicalRecords = async (user: SafeUser) => {
  if (user.role === Role.DOCTOR) {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };
    const medicalRecords = await medicalRecordDao.getByDoctorId(
      userDoctor.doctor.id
    );
    if (!medicalRecords)
      return Format.notFound("No medical record issued by doctor");
    return Format.success(medicalRecords);
  } else {
    const userPatient = (await userDao.getUserWithRole(
      user.id,
      Role.PATIENT
    )) as User & { patient: Patient };
    const medicalRecords = await medicalRecordDao.getByPatientId(
      userPatient.patient.id
    );
    if (!medicalRecords)
      return Format.notFound("No medical record for the patient");
    return Format.success(medicalRecords);
  }
};

/**
 * Adds a new medical record detail.
 *
 * @param {SafeUser} user - The user adding the medical record detail.
 * @param {MedicalRecordDetailDTO} medicalRecordDetailDTO - The medical record detail data.
 * @returns {Promise<object>} - The result of the addition operation.
 */
export async function addMedicalRecordDetail(
  user: SafeUser,
  medicalRecordDetailDTO: MedicalRecordDetailDTO
) {
  const { medicalRecordId, examinationReferenceId } = medicalRecordDetailDTO;
  const medicalRecord = await medicalRecordDao.getMedicalRecordById(
    medicalRecordId
  );
  if (!medicalRecord) return Format.notFound("medical record not found");
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");
  const existingDetail =
    await medicalRecordDetailDao.getByRecordAndExaminationId(
      medicalRecordId,
      examinationReferenceId
    );
  if (existingDetail) return Format.badRequest({}, "detail already exist");
  const detail = await medicalRecordDetailDao.create(medicalRecordDetailDTO);
  return Format.success(detail, "created successfully");
}

/**
 * Adds a new medical record file.
 *
 * @param {SafeUser} user - The user adding the medical record file.
 * @param {MedicalRecordFileDTO} medicalRecordFileDTO - The medical record file data.
 * @returns {Promise<object>} - The result of the addition operation.
 */
export async function addMedicalRecordFile(
  user: SafeUser,
  medicalRecordFileDTO: MedicalRecordFileDTO
) {
  const { medicalRecordId } = medicalRecordFileDTO;
  const medicalRecord = await medicalRecordDao.getMedicalRecordById(
    medicalRecordId
  );
  if (!medicalRecord) return Format.notFound("medical record not found");

  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");
  const file = await medicalRecordFileDao.create(medicalRecordFileDTO);
  return Format.success(file, "created successfully");
}

/**
 * Updates a medical record detail by ID.
 *
 * @param {SafeUser} user - The user updating the medical record detail.
 * @param {number} id - The ID of the medical record detail to update.
 * @param {number} result - The new result value.
 * @returns {Promise<object>} - The result of the update operation.
 */
export const updateMedicalRecordDetails = async (
  user: SafeUser,
  id: number,
  result: number
) => {
  if (!result || !id) return Format.badRequest({}, "Result or Id not provided");
  const existingMedicalRecordDetail = await medicalRecordDetailDao.getById(id);
  if (!existingMedicalRecordDetail)
    return Format.notFound("Medical Record Detail is not found");
  const { medicalRecord } =
    existingMedicalRecordDetail as MedicalRecordDetail & {
      medicalRecord: MedicalRecord;
    };
  if (!(await hasPermission(medicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");
  const updatedMedicalRecordDetail =
    await medicalRecordDetailDao.updateMedicalRecord(id, result);
  return Format.success(updatedMedicalRecordDetail, "Updated successfully");
};

/**
 * Updates a medical record.
 *
 * @param {SafeUser} user - The user updating the medical record.
 * @param {MedicalRecordUpdateDTO} medicalRecordUpdateDTO - The medical record update data.
 * @returns {Promise<object>} - The result of the update operation.
 */
export const updateMedicalRecord = async (
  user: SafeUser,
  medicalRecordUpdateDTO: MedicalRecordUpdateDTO
) => {
  const { doctorId, patientId, id, ...updateData } = medicalRecordUpdateDTO;

  const existingMedicalRecord = await medicalRecordDao.getMedicalRecordById(id);

  if (!existingMedicalRecord)
    return Format.notFound("Medical Record Detail is not found");

  if (!(await hasPermission(existingMedicalRecord, user)))
    return Format.badRequest({}, "User doesn't have permission");

  const updatedMedicalRecord = await medicalRecordDao.updateMedicalRecord(
    id,
    updateData
  );

  return Format.success(
    updatedMedicalRecord,
    "Medical Record updated successfully"
  );
};

/**
 * Adds a new medical record.
 *
 * @param {SafeUser} user - The user adding the medical record.
 * @param {MedicalRecordDTO} medicalRecordDTO - The medical record data.
 * @returns {Promise<object>} - The result of the addition operation.
 */
export const addMedicalRecord = async (
  user: SafeUser,
  medicalRecordDTO: MedicalRecordDTO
) => {
  if (user.role === Role.DOCTOR) {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };

    if (!medicalRecordDTO?.patientId)
      return Format.notFound("Patient ID not found");

    medicalRecordDTO.doctorId = userDoctor.doctor.id;
  } else {
    const userPatient = (await userDao.getUserWithRole(
      user.id,
      Role.PATIENT
    )) as User & { patient: Patient };
    medicalRecordDTO.patientId = userPatient.patient.id;
  }

  const medicalRecord = await medicalRecordDao.addMedicalRecord(
    medicalRecordDTO
  );

  return Format.success(medicalRecord);
};
