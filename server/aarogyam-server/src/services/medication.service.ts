import * as medicationDao from "../dao/medication.dao";
import Format from "../utils/format";
import { MedicationDTO } from "../types/medication.dto";
import * as userDao from "../dao/user.dao";
import { Patient, Role, User } from "@prisma/client";
import * as medicationTimeDao from "../dao/medicationTime.dao";

export const createMedication = async (
  userId: number,
  medicationData: MedicationDTO
): Promise<any> => {
  const userPatient = (await userDao.getUserWithRole(
    userId,
    Role.PATIENT
  )) as User & { patient: Patient };

  if (!userPatient) {
    return Format.notFound("Patient is not found");
  }

  const createdMedication = await medicationDao.create(
    userPatient.patient.id,
    medicationData
  );

  const newTimes = new Set(
    medicationData.timesToTake.map((time) => String(time))
  );

  for (const time of newTimes) {
    await medicationTimeDao.create(createdMedication.id, time);
  }
  return Format.success(createdMedication, "Medication Created successfully");
};

export const deleteAllMedication = async (
  medicationId: number
): Promise<any> => {
  if (!medicationId) {
    return Format.badRequest("Medication id is required");
  }
  await medicationTimeDao.deleteAll(medicationId);
  const medication = medicationDao.deleteMedication(medicationId);
  return Format.success(medication, "Medication deleted successfully");
};

export const deleteAllMedicationByTime = async (
  medicationId: number,
  time: string
): Promise<any> => {
  if (!medicationId) {
    return Format.badRequest("Medication Id is required");
  }
  if (!time) {
    return Format.notFound("Time is required");
  }
  const existingMedicationTime =
    await medicationTimeDao.getMedicationTimeByIdAndTime(medicationId, time);

  if (!existingMedicationTime) {
    return Format.notFound("Medication time not found");
  }
  await medicationTimeDao.deleteMedicationTime(medicationId, time);
  return Format.success({}, "Medication Time deleted successfully");
};

export const getAllMedication = async (userId: number): Promise<any> => {
  const userPatient = (await userDao.getUserWithRole(
    userId,
    Role.PATIENT
  )) as User & { patient: Patient };

  if (!userPatient) {
    return Format.notFound("Patient is not found");
  }
  const medications = await medicationDao.getAllMedicationsByPatientId(
    userPatient.patient.id
  );

  if (!medications) {
    return Format.notFound("No medications found for this patient");
  }
  return Format.success(medications, "Medication Get successfully");
};

export const updateForMedication = async (
  userId: number,
  medicationData: MedicationDTO
): Promise<any> => {
  const userPatient = (await userDao.getUserWithRole(
    userId,
    Role.PATIENT
  )) as User & { patient: Patient };

  if (!userPatient) {
    return Format.notFound("Patient is not found");
  }

  const medicationDataIdForUpdate =
    await medicationDao.getMedicationIdByPatient(userPatient.patient.id);
  const medicationId = medicationDataIdForUpdate
    ? medicationDataIdForUpdate.id
    : 0;
  const medication = await medicationDao.upsertMedication(
    userPatient.patient.id,
    medicationData,
    medicationId
  );
  return Format.success(medication, "Medication Updated successfully");
};
