import Format from "../utils/format";
import {
  HospitalCreateDTO,
  HospitalUpdateDTO,
  SafeUser,
} from "../types/user.dto";
import * as hospitalDao from "../dao/hospital.dao";
import * as userDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import { Hospital, Role, User } from "@prisma/client";

/**
 * Creates a new hospital.
 *
 * @param {HospitalCreateDTO} hospitalCreateDTO - The data transfer object containing hospital creation details.
 * @returns {Promise<any>} A promise that resolves to the result of the creation operation.
 */
export const createHospital = async (
  hospitalCreateDTO: HospitalCreateDTO
): Promise<any> => {
  const existingUser: any = await userDao.findByEmailOrPhone(
    hospitalCreateDTO.email,
    hospitalCreateDTO.phone
  );

  if (existingUser) return Format.conflict(null, "Hospital already exists");

  const hashPassword = await bcrypt.hash(hospitalCreateDTO.name + "@123", 10);

  const { website, ...userData } = hospitalCreateDTO;

  const user: User = await userDao.create({
    ...userData,
    password: hashPassword,
    isVerified: true,
    role: Role.HOSPITAL,
  });

  const hospital = await hospitalDao.create(user.id, website);
  return Format.success(hospital, "Hospital create successfully");
};

/**
 * Deletes an existing hospital.
 *
 * @param {number} hospitalId - The ID of the hospital to be deleted.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteHospital = async (hospitalId: number): Promise<any> => {
  const hospital = await hospitalDao.findHospitalByID(hospitalId);
  if (!hospital) {
    return Format.notFound("Hospital not Found!");
  }
  await hospitalDao.deleteHospital(hospitalId);
  await userDao.deleteUser(hospital.userId);
  return Format.success({}, "Hospital delete successfully");
};

/**
 * Retrieves a hospital by ID.
 *
 * @param {number} hospitalId - The ID of the hospital to be retrieved.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
export const getHospital = async (hospitalId: number): Promise<any> => {
  const hospital = await hospitalDao.getHospitalWithUser(hospitalId);
  if (!hospital) {
    return Format.notFound("Hospital not found");
  }

  const { user, website, id } = hospital as Hospital & { user: User };
  const { name, email, phone, address, profileImage } = user as SafeUser;
  return Format.success({
    id,
    name,
    email,
    phone,
    address,
    profileImage,
    website,
  });
};

/**
 * Updates an existing hospital.
 *
 * @param {number} userId - The ID of the user associated with the hospital.
 * @param {HospitalUpdateDTO} hospitalData - The data transfer object containing hospital update details.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateHospital = async (
  userId: number,
  hospitalData: HospitalUpdateDTO
): Promise<any> => {
  const existingHospital = await hospitalDao.findHospitalByUserID(userId);
  if (!existingHospital) {
    return Format.notFound("Hospital not found");
  }

  const { website, ...userData } = hospitalData;

  if (userData) await userDao.updateUser(userId, userData);

  if (website) await hospitalDao.updateHospital(userId, website);

  const updatedUser = await userDao.getUserWithRole(userId, Role.HOSPITAL);

  return Format.success(updatedUser, "Hospital update successfully");
};
