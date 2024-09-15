import { Doctor, PrismaClient } from "@prisma/client";
import { CreateDoctorDTO, SafeDoctor } from "../types/user";

const doctor = new PrismaClient().doctor;

export const create = async (
  hospitalId: number,
  userId: number,
  doctorData: CreateDoctorDTO
): Promise<Doctor> => {
  return doctor.create({
    data: {
      userId,
      gender: doctorData.gender,
      rating: doctorData.rating,
      hospitalId,
    },
  });
};

export const findById = async (doctorId: number): Promise<Doctor | null> => {
  return doctor.findUnique({
    where: {
      id: doctorId,
    },
  });
};

export const updateDoctor = async (
  userId: number,
  doctorData: SafeDoctor
): Promise<Doctor> => {
  return doctor.update({
    where: {
      userId: userId,
    },
    data: {
      gender: doctorData.gender,
      rating: doctorData.rating,
    },
  });
};

export const deleteDoctor = async (doctorId: number): Promise<Doctor> => {
  return doctor.delete({ where: { id: doctorId } });
};

export const getDoctor = async (doctorId: number): Promise<Doctor | null> => {
  return doctor.findUnique({ where: { id: doctorId } });
};

export const findUserByDoctorId = async (
  doctorId: number
): Promise<Doctor | null> => {
  return doctor.findUnique({
    where: { id: doctorId },
  });
};
