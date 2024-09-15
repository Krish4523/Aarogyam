import { Hospital, PrismaClient } from "@prisma/client";
import { CreateHospitalDTO } from "../types/user";

const hospital = new PrismaClient().hospital;

export const create = async (
  userId: number,
  hospitalData: CreateHospitalDTO
): Promise<Hospital> => {
  return hospital.create({
    data: {
      userId,
      name: hospitalData.name,
      phone: hospitalData.phone,
      address: hospitalData.address,
      isApproved: true,
    },
  });
};

export const findUserByHospitalId = async (
  hospitalId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({
    where: { id: hospitalId },
  });
};

export const deleteHospital = async (hospitalId: number): Promise<Hospital> => {
  return hospital.delete({ where: { id: hospitalId } });
};

export const getHospital = async (
  hospitalId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({ where: { id: hospitalId } });
};

export const updateHospital = async (
  hospitalId: number,
  hospitalData: CreateHospitalDTO
): Promise<Hospital> => {
  return hospital.update({
    where: { id: hospitalId },
    data: hospitalData,
  });
};

export const findUserByUserId = async (
  userId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({
    where: { userId },
  });
};
