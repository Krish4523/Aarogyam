import * as patientDao from "../dao/patient.dao";
import Format from "../utils/format";
import * as userDao from "../dao/user.dao";
import { PatientUpdateDTO, SafeUser } from "../types/user.dto";

/**
 * Updates patient information including user data and gender.
 *
 * @param {SafeUser} user - The user object containing user details.
 * @param {PatientUpdateDTO} patientUpdateDTO - The data transfer object containing patient update details.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updatePatient = async (
  user: SafeUser,
  patientUpdateDTO: PatientUpdateDTO
): Promise<any> => {
  // Destructure gender from patientUpdateDTO and get the rest of the user data
  const { gender, ...userData } = patientUpdateDTO;

  // If userData is provided, update the user information
  if (userData) await userDao.updateUser(user.id, userData);

  // If gender is provided, update the patient's gender
  if (gender) await patientDao.updatePatient(user.id, { gender });

  // Retrieve the updated user information with role
  const updatedUser = await userDao.getUserWithRole(user.id, user.role);

  // Return success response with the updated user information
  return Format.success(
    updatedUser,
    "Patient information updated successfully"
  );
};
