import { Prescription, PrismaClient } from "@prisma/client";
import {
  PrescriptionDTO,
  PrescriptionUpdateDTO,
} from "../types/prescription.dto";

const prescriptionClient = new PrismaClient().prescription;
const medicationClient = new PrismaClient().medication;
const medicationTimeClient = new PrismaClient().medicationTime;

export const createPrescription = async (
  doctorId: number,
  prescriptionData: PrescriptionDTO
): Promise<Prescription> => {
  return prescriptionClient.create({
    data: {
      doctorId,
      patientId: prescriptionData.patientId,
      notes: prescriptionData.notes,
    },
  });
};

export const deletePrescription = async (
  prescriptionId: number
): Promise<void> => {
  await medicationClient.deleteMany({
    where: {
      prescriptionId,
    },
  });

  await medicationTimeClient.deleteMany({
    where: {
      medication: {
        prescriptionId,
      },
    },
  });

  await prescriptionClient.delete({
    where: {
      id: prescriptionId,
    },
  });
};

// export const updatePrescription = async (
//   prescriptionId: number,
//   doctorId: number,
//   prescriptionData: PrescriptionUpdateDTO
// ): Promise<any> => {
//   return prescriptionClient.upsert({
//     where: { id: prescriptionId }, // Using prescription ID to find the record
//     create: {
//       patientId: prescriptionData.patientId,
//       doctorId,
//       notes: prescriptionData.notes,
//       medicines: {
//         create: prescriptionData.medicines.map((medication) => ({
//           patientId: prescriptionData.patientId,
//           name: medication.name,
//           dosage: medication.dosage,
//           frequency: medication.frequency,
//           timesToTake: {
//             create: medication.timesToTake.map((time) => ({
//               time,
//             })),
//           },
//           source: medication.source,
//         })),
//       },
//     },
//     update: {
//       patientId: prescriptionData.patientId,
//       notes: prescriptionData.notes,
//       medicines: {
//         deleteMany: { prescriptionId }, // Ensure only medicines related to this prescription are deleted
//         create: prescriptionData.medicines.map((medication) => ({
//           patientId: prescriptionData.patientId,
//           name: medication.name,
//           dosage: medication.dosage,
//           frequency: medication.frequency,
//           timesToTake: {
//             create: medication.timesToTake.map((time) => ({
//               time,
//             })),
//           },
//           source: medication.source,
//         })),
//       },
//     },
//     include: {
//       medicines: {
//         include: {
//           timesToTake: true,
//         },
//       },
//     },
//   });
// };

export const updatePrescription = async (
  prescriptionId: number,
  doctorId: number,
  prescriptionData: PrescriptionUpdateDTO
): Promise<any> => {
  return prescriptionClient.upsert({
    where: { id: prescriptionId },
    create: {
      patient: {
        connect: { id: prescriptionData.patientId }, // Relating patient with connect
      },
      doctor: {
        connect: { id: doctorId }, // Relating doctor with connect
      },
      notes: prescriptionData.notes,
      medicines: {
        create: prescriptionData.medicines.map((medication) => ({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timesToTake: {
            create: medication.timesToTake.map((time) => ({
              time: time.time, // No medicationId, Prisma will link it automatically
            })),
          },
          source: medication.source,
          patient: {
            connect: { id: prescriptionData.patientId }, // Connecting the patient to the medicine
          },
        })),
      },
    },
    update: {
      patient: {
        connect: { id: prescriptionData.patientId }, // Relating patient with connect
      },
      notes: prescriptionData.notes,
      medicines: {
        deleteMany: {
          prescriptionId, // Delete all old medicines related to this prescription
        },
        create: prescriptionData.medicines.map((medication) => ({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timesToTake: {
            create: medication.timesToTake.map((time) => ({
              time: time.time, // No medicationId needed here either
            })),
          },
          source: medication.source,
          patient: {
            connect: { id: prescriptionData.patientId }, // Connecting the patient to the medicine
          },
        })),
      },
    },
    include: {
      medicines: {
        include: {
          timesToTake: true, // Including timesToTake in the response
        },
      },
    },
  });
};

export const getAll = async (
  prescriptionId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      id: prescriptionId,
    },
    include: {
      medicines: {
        include: {
          timesToTake: true,
        },
      },
    },
  });
};

export const getByDoctorId = async (
  doctorId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      doctorId,
    },
  });
};

export const getByPatientId = async (
  patientId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      patientId,
    },
  });
};
