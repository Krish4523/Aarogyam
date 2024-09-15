import Format from "../utils/format";
import { CreateHospitalDTO } from "../types/user";
import * as hospitalDao from "../dao/hospital.dao";
import * as userDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import { Role, User } from "@prisma/client";

export const getUserIdByHospitalId = async (
  hospitalId: number
): Promise<number | null> => {
  const user = await hospitalDao.findUserByHospitalId(hospitalId);
  return user ? user.userId : null;
};

export const getHospitalIdByUserId = async (
  userId: number
): Promise<number | null> => {
  const hospital = await hospitalDao.findUserByUserId(userId);
  return hospital ? hospital.id : null;
};

export const createHospital = async (
  hospitalData: CreateHospitalDTO
): Promise<any> => {
  if (!hospitalData) {
    return Format.notFound("Hospital data is not found");
  }
  if (
    !hospitalData.name ||
    !hospitalData.address ||
    !hospitalData.phone ||
    !hospitalData.email
  ) {
    return Format.notFound("All Field Required!");
  }
  const existingUser: any = await userDao.findByEmailOrPhone(
    hospitalData.email,
    hospitalData.phone
  );

  if (existingUser) return Format.conflict(null, "Doctor already exists");

  const hashPassword = await bcrypt.hash(hospitalData.name + "@123", 10);

  const user: User = await userDao.create({
    name: hospitalData.name,
    email: hospitalData.email,
    phone: hospitalData.phone,
    password: hashPassword,
    isVerified: true,
    role: Role.HOSPITAL,
  });

  const hospital = await hospitalDao.create(user.id, hospitalData);
  return Format.success(hospital, "Hospital create successfully");
};

export const deleteHospital = async (hospitalId: number): Promise<any> => {
  if (!hospitalId) {
    return Format.notFound("Doctor not found");
  }
  const userId = await getUserIdByHospitalId(hospitalId);
  if (!userId) {
    return Format.notFound("User not Found!");
  }
  const deletedHospital = await hospitalDao.deleteHospital(hospitalId);
  const deleteUser = await userDao.deleteHospitalUser(userId);
  return Format.success(
    { deleteUser, deletedHospital },
    "Hospital delete successfully"
  );
};

export const getHospital = async (hospitalId: number): Promise<any> => {
  if (!hospitalId) {
    return Format.notFound("Doctor not found");
  }
  const doctors = await hospitalDao.getHospital(hospitalId);
  return Format.success(doctors, "Hospital Data");
};

export const updateHospital = async (
  userId: number,
  hospitalData: CreateHospitalDTO
): Promise<any> => {
  if (!hospitalData) {
    return Format.badRequest(null, "No data provided for update");
  }
  const exitsingHospital = await userDao.findByID(userId);
  if (!exitsingHospital) {
    return Format.notFound("User not found");
  }
  const updatedUser = await userDao.updateUserForHospital(
    userId,
    hospitalData.name,
    hospitalData.address,
    hospitalData.phone
  );

  const hospitalId = await getHospitalIdByUserId(userId);
  if (!hospitalId) {
    return Format.notFound("Hospital not found");
  }
  const updatedHospital = await hospitalDao.updateHospital(
    hospitalId,
    hospitalData
  );
  return Format.success(
    { updatedHospital, updatedUser },
    "Doctor update successfully"
  );
};
