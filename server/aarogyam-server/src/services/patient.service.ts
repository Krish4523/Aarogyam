import * as patientDao from "../dao/patient.dao";
import Format from "../utils/format";
import { Patient, User } from "@prisma/client";
import * as userDao from "../dao/user.dao";

export const updatePatient = async (
  userId: number,
  patientData: Partial<Patient>,
  userData: Partial<User>
): Promise<any> => {
  if (!patientData || !userData) {
    return Format.badRequest(null, "No data provided for update");
  }
  const existingUser = await userDao.findByID(userId);

  const existingPatient = await patientDao.findPatientByUserId(userId);
  if (!existingPatient || !existingUser) {
    return Format.notFound("Patient not found");
  }
  const updatedUser = await userDao.updateUser(
    userData.name!,
    userData.phone!,
    userData.address!,
    userData.profileImage!,
    userData.id!
  );
  const updatedPatient = await patientDao.updatePatient(userId, patientData);
  return Format.success(
    { updatedPatient, updatedUser },
    "Patient information updated successfully"
  );
};
