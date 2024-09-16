import { MedicationTime, PrismaClient } from "@prisma/client";

const medicationTimeClient = new PrismaClient().medicationTime;

export const getTimesForMedication = async (
  medicationId: number
): Promise<MedicationTime[]> => {
  return medicationTimeClient.findMany({
    where: {
      medicationId,
    },
  });
};

export const create = async (
  medicationId: number,
  time: string
): Promise<MedicationTime> => {
  return medicationTimeClient.create({
    data: {
      medicationId,
      time,
    },
  });
};

export const deleteAll = async (medicationId: number): Promise<any> => {
  return medicationTimeClient.deleteMany({
    where: {
      medicationId,
    },
  });
};

export const getMedicationTimeByIdAndTime = async (
  medicationId: number,
  time: string
): Promise<MedicationTime | null> => {
  return medicationTimeClient.findFirst({
    where: {
      medicationId,
      time,
    },
  });
};

export const deleteMedicationTime = async (
  medicationId: number,
  time: string
): Promise<any> => {
  return medicationTimeClient.delete({
    where: {
      time_medicationId: {
        medicationId,
        time,
      },
    },
  });
};
