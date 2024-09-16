import { Medication, PrismaClient } from "@prisma/client";
import { MedicationDTO } from "../types/medication.dto";

const medicationClient = new PrismaClient().medication;

export const create = async (
  patientId: number,
  medicationData: MedicationDTO
): Promise<Medication> => {
  return medicationClient.create({
    data: {
      patientId,
      name: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      source: medicationData.source,
    },
  });
};

export const deleteMedication = async (
  medicationId: number
): Promise<Medication> => {
  return medicationClient.delete({
    where: {
      id: medicationId,
    },
  });
};

export const getAllMedicationsByPatientId = async (
  patientId: number
): Promise<Medication | null> => {
  return medicationClient.findFirst({
    where: {
      patientId,
    },
    include: { timesToTake: true },
  });
};

export const getMedicationIdByPatient = async (
  patientId: number
): Promise<Medication | null> => {
  return medicationClient.findFirst({
    where: {
      patientId,
    },
  });
};

export const upsertMedication = async (
  patientId: number,
  medicationData: MedicationDTO,
  medicationId: number
): Promise<Medication | null> => {
  const { name, dosage, frequency, timesToTake, source } = medicationData;

  return medicationClient.upsert({
    where: { id: medicationId || 0 }, // Use `id` for the `where` clause
    create: {
      patientId,
      name,
      dosage,
      frequency,
      // prescriptionId, // Include prescriptionId if needed
      source,
      timesToTake: {
        create: timesToTake.map((time) => ({
          time: time.time,
        })),
      },
    },
    update: {
      name,
      dosage,
      frequency,
      // prescriptionId, // Include prescriptionId if needed
      source,
      updatedAt: new Date(),
      timesToTake: {
        deleteMany: {
          NOT: timesToTake.map((time) => ({ time: time.time })),
        },
        upsert: timesToTake.map((time) => ({
          where: {
            time_medicationId: {
              time: time.time,
              medicationId, // Use `id` for the `medicationId`
            },
          },
          create: { time: time.time },
          update: { time: time.time },
        })),
      },
    },
    include: {
      timesToTake: true,
    },
  });
};
