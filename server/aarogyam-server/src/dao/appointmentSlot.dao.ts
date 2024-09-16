import { AppointmentSlot, PrismaClient } from "@prisma/client";
import {
  AppointmentSlotDTO,
  AppointmentSlotUpdateDTO,
} from "../types/appointmentSlot.dto";

const appointmentSlotClient = new PrismaClient().appointmentSlot;

export const createSlot = async (
  doctorId: number,
  appointmentSlotDTO: AppointmentSlotDTO
): Promise<AppointmentSlot> => {
  return appointmentSlotClient.create({
    data: {
      doctorId,
      ...appointmentSlotDTO,
    },
  });
};

export const checkSlotAvailability = async (
  doctorId: number,
  date: string,
  startTime: string,
  endTime: string
): Promise<AppointmentSlot | null> => {
  return appointmentSlotClient.findFirst({
    where: {
      doctorId,
      date,
      OR: [
        {
          startTime: {
            lte: endTime,
          },
          endTime: {
            gte: startTime,
          },
        },
      ],
    },
  });
};

export const getSlot = async (
  doctorId: number
): Promise<AppointmentSlot | null> => {
  return appointmentSlotClient.findFirst({
    where: {
      doctorId,
    },
  });
};

export const findAppointmentSlotByIdAndDoctorId = async (
  appointmentId: number,
  doctorId: number
) => {
  return appointmentSlotClient.findFirst({
    where: {
      id: appointmentId,
      doctorId,
    },
  });
};

export const updateAppointmentSlotById = async (
  appointmentId: number,
  appointmentSlotDTO: AppointmentSlotUpdateDTO
): Promise<AppointmentSlot> => {
  return appointmentSlotClient.update({
    where: { id: appointmentId },
    data: {
      date: appointmentSlotDTO.date,
      startTime: appointmentSlotDTO.startTime,
      endTime: appointmentSlotDTO.endTime,
      status: appointmentSlotDTO.status,
      type: appointmentSlotDTO.type,
      updatedAt: new Date(),
    },
  });
};

export const deleteAppointmentSlot = async (
  appointmentSlotId: number
): Promise<AppointmentSlot> => {
  return appointmentSlotClient.delete({
    where: {
      id: appointmentSlotId,
    },
  });
};

export const findAppointmentSlotById = async (
  appointmentSlotId: number
): Promise<AppointmentSlot | null> => {
  return appointmentSlotClient.findUnique({
    where: { id: appointmentSlotId },
  });
};
