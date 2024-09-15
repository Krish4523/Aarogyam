import Format from "../utils/format";
import * as doctorDao from "../dao/doctor.dao";
import * as userDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import { Doctor, Role } from "@prisma/client";
import { CreateDoctorDTO, DoctorUpdateDTO, SafeUser } from "../types/user.dto";

export const create = async (
  hospitalUserId: number,
  createDoctorDTO: CreateDoctorDTO
): Promise<any> => {
  const existingUser: any = await userDao.findByEmailOrPhone(
    createDoctorDTO.email,
    createDoctorDTO.phone
  );

  if (existingUser) return Format.conflict(null, "Doctor already exists");

  const { gender, rating, ...userData } = createDoctorDTO;
  const hashPassword = await bcrypt.hash(createDoctorDTO.name + "@123", 10);

  const user = await userDao.create({
    ...userData,
    password: hashPassword,
    isVerified: true,
    role: Role.DOCTOR,
  });

  const userHospital = await userDao.getUserWithRole(
    hospitalUserId,
    Role.HOSPITAL
  );

  if (!userHospital) return Format.notFound("Hospital Not found");

  const doctor = await doctorDao.create(
    userHospital.hospital.id,
    user.id,
    gender,
    rating
  );

  return Format.success(doctor, "Doctor create successfully");
};

export const updateDoctor = async (
  userId: number,
  doctorUpdateDTO: DoctorUpdateDTO
): Promise<any> => {
  const existingDoctor = await doctorDao.findDoctorByUserId(userId);
  if (!existingDoctor) {
    return Format.notFound("User not found");
  }

  const { gender, rating, ...userData } = doctorUpdateDTO;

  if (userData) await userDao.updateUser(userId, userData);
  if (gender || rating)
    await doctorDao.updateDoctor(userId, {
      ...(gender && { gender }),
      ...(rating && { rating }),
    });

  const updatedUser = await userDao.getUserWithRole(userId, Role.DOCTOR);

  return Format.success(updatedUser, "Doctor update successfully");
};

export const deleteDoctor = async (doctorId: number): Promise<any> => {
  const doctor = (await doctorDao.getDoctor(doctorId)) as Doctor;
  if (!doctor) {
    return Format.notFound("Doctor not found");
  }
  await doctorDao.deleteDoctor(doctor.id);
  await userDao.deleteUser(doctor.userId);
  return Format.success({}, "Doctor delete successfully");
};

export const getDoctor = async (doctorId: number): Promise<any> => {
  const doctor = (await doctorDao.getDoctor(doctorId)) as Doctor;
  if (!doctor) {
    return Format.notFound("Doctor not found");
  }
  const { user, gender, rating, id } = doctor;
  const { name, email, phone, address, profileImage } = user as SafeUser;
  return Format.success({
    id,
    name,
    email,
    phone,
    address,
    profileImage,
    gender,
    rating,
  });
};
