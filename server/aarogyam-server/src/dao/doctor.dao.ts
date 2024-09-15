import { Doctor, PrismaClient } from "@prisma/client";

const doctorClient = new PrismaClient().doctor;

export const create = async (
  hospitalId: number,
  userId: number,
  gender: string,
  rating: number
): Promise<Doctor> => {
  return doctorClient.create({
    data: {
      userId,
      hospitalId,
      gender,
      rating,
    },
  });
};

export async function findDoctorByUserId(userId: number) {
  return doctorClient.findUnique({
    where: { userId },
  });
}

export const updateDoctor = async (
  userId: number,
  data: Partial<Doctor>
): Promise<Doctor> => {
  return doctorClient.update({
    where: {
      userId,
    },
    data,
  });
};

export const deleteDoctor = async (doctorId: number): Promise<Doctor> => {
  return doctorClient.delete({ where: { id: doctorId } });
};

export const getDoctor = async (doctorId: number): Promise<Doctor | null> => {
  return doctorClient.findUnique({
    where: { id: doctorId },
    include: {
      user: true,
    },
  });
};
