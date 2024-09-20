import * as prescriptionDao from "../dao/prescription.dao";
import Format from "../utils/format";
import {
  PrescriptionDTO,
  PrescriptionUpdateDTO,
} from "../types/prescription.dto";
import * as userDao from "../dao/user.dao";
import { Doctor, Role, User } from "@prisma/client";
import * as medicationDao from "../dao/medication.dao";
import * as medicationTimeDao from "../dao/medicationTime.dao";
import { SafeUser } from "../types/user.dto";

export const create = async (
  userId: number,
  prescriptionData: PrescriptionDTO
): Promise<any> => {
  const userDoctor = (await userDao.getUserWithRole(
    userId,
    Role.DOCTOR
  )) as User & { doctor: Doctor };
  const prescription = await prescriptionDao.createPrescription(
    userDoctor.doctor.id,
    prescriptionData
  );

  for (const med of prescriptionData.medicines) {
    const medication = await medicationDao.createMedicationWithPrescription(
      med.patientId,
      med.name,
      prescription.id,
      med.dosage,
      med.frequency
    );
    for (const time of med.timesToTake) {
      await medicationTimeDao.create(medication.id, String(time));
    }
  }

  return Format.success(prescription, "Prescription is added successfully");
};

export const deletePrescription = async (
  prescriptionId: number
): Promise<any> => {
  if (!prescriptionId) {
    throw new Error(`Prescription with id ${prescriptionId} not found`);
  }

  await prescriptionDao.deletePrescription(prescriptionId);

  return Format.success(null, "Prescription deleted successfully");
};

export const updatePrescription = async (
  prescriptionId: number,
  userId: number,
  prescriptionData: PrescriptionUpdateDTO
): Promise<{ code: number; data: any; message: string }> => {
  if (!prescriptionId) {
    return Format.badRequest("Prescription Id is required");
  }
  const userDoctor = (await userDao.getUserWithRole(
    userId,
    Role.DOCTOR
  )) as User & { doctor: Doctor };
  const updatedPrescription = await prescriptionDao.updatePrescription(
    prescriptionId,
    userDoctor.doctor.id,
    prescriptionData
  );
  return Format.success(
    updatedPrescription,
    "Prescription deleted successfully"
  );
};

export const getAllPrescriptionById = async (
  prescriptionId: number
): Promise<any> => {
  if (![prescriptionId]) {
    return Format.badRequest("Id is required");
  }
  const data = await prescriptionDao.getAll(prescriptionId);
  return Format.success(data, "Prescription details successfully");
};

export const getAll = async (user: SafeUser): Promise<any> => {
  if (user.role === Role.DOCTOR) {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };
    const prescription = await prescriptionDao.getByDoctorId(
      userDoctor.doctor.id
    );
    return Format.success(prescription, "Prescription details successfully");
  } else {
    const prescription = await prescriptionDao.getByPatientId(user.id);
    return Format.success(prescription, "Prescription details successfully");
  }
};
