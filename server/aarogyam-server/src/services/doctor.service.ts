import Format from "../utils/format";
import { CreateDoctorDTO, SafeDoctor } from "../types/user";
import * as doctorDao from "../dao/doctor.dao";
import * as userDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import { Role, User } from "@prisma/client";

export const getUserIdByDoctorId = async (
  doctorId: number
): Promise<number | null> => {
  const user = await doctorDao.findUserByDoctorId(doctorId);
  return user ? user.id : null;
};

export const create = async (
  hospitalId: number,
  doctorData: CreateDoctorDTO
): Promise<any> => {
  if (!doctorData) {
    return Format.notFound("Doctor is not Found");
  }

  if (
    !doctorData.name ||
    !doctorData.email ||
    !doctorData.phone ||
    !doctorData.gender ||
    !doctorData.rating
  ) {
    return Format.badRequest(null, "All fields are required");
  }

  const existingUser: any = await userDao.findByEmailOrPhone(
    doctorData.email,
    doctorData.phone
  );

  if (existingUser) return Format.conflict(null, "Doctor already exists");

  const hashPassword = await bcrypt.hash(doctorData.name + "@123", 10);

  const user: User = await userDao.create({
    name: doctorData.name,
    email: doctorData.email,
    phone: doctorData.phone,
    password: hashPassword,
    isVerified: true,
    role: Role.DOCTOR,
  });

  const doctor = await doctorDao.create(hospitalId, user.id, doctorData);
  return Format.success(doctor, "Doctor create successfully");
};

export const updateDoctor = async (
  userId: number,
  userData: Partial<User>,
  doctorData: SafeDoctor
): Promise<any> => {
  if (!doctorData || !userData) {
    return Format.badRequest(null, "No data provided for update");
  }
  const exitsingDoctor = await userDao.findByID(userId);
  if (!exitsingDoctor) {
    return Format.notFound("User not found");
  }
  const updatedUser = await userDao.updateUserForDoctor(userId, userData);
  const updatedDoctor = await doctorDao.updateDoctor(userId, doctorData);
  return Format.success(
    { updatedDoctor, updatedUser },
    "Doctor update successfully"
  );
};

export const deleteDoctor = async (doctorId: number): Promise<any> => {
  if (!doctorId) {
    return Format.notFound("Doctor not found");
  }
  const userId = await getUserIdByDoctorId(doctorId);
  if (!userId) {
    return Format.notFound("User not Found!");
  }
  const deletedDoctor = await doctorDao.deleteDoctor(doctorId);
  const deleteUser = await userDao.deleteDoctorUser(userId);
  return Format.success(
    { deleteUser, deletedDoctor },
    "Doctor delete successfully"
  );
};

export const getDoctor = async (doctorId: number): Promise<any> => {
  if (!doctorId) {
    return Format.notFound("Doctor not found");
  }
  const doctors = await doctorDao.getDoctor(doctorId);
  return Format.success(doctors, "Doctor getDoctor");
};
