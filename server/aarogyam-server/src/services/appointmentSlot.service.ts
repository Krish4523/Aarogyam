import * as appointmentSlotDao from "../dao/appointmentSlot.dao";
import Format from "../utils/format";
import {
  AppointmentSlotDTO,
  AppointmentSlotUpdateDTO,
} from "../types/appointmentSlot.dto";
import * as userDao from "../dao/user.dao";
import { Doctor, Role, User } from "@prisma/client";

export const createAppointmentSlot = async (
  userId: number,
  appointmentSlotDTO: AppointmentSlotDTO
): Promise<any> => {
  const userDoctor = (await userDao.getUserWithRole(
    userId,
    Role.DOCTOR
  )) as User & { doctor: Doctor };

  if (!userDoctor) {
    return Format.notFound("Doctor is not found");
  }

  const isSlotAvailable = await appointmentSlotDao.checkSlotAvailability(
    userDoctor.doctor.id,
    appointmentSlotDTO.date,
    appointmentSlotDTO.startTime,
    appointmentSlotDTO.endTime
  );

  if (!isSlotAvailable) {
    return Format.badRequest(
      "An appointment slot is already booked or unavailable in this time range."
    );
  }

  const appointmentSlot = await appointmentSlotDao.createSlot(
    userDoctor.doctor.id,
    appointmentSlotDTO
  );
  return Format.success(
    appointmentSlot,
    "Appointment Slot created successfully"
  );
};

export const getAppointmentSlot = async (doctorId: number): Promise<any> => {
  if (!doctorId) {
    return Format.badRequest("Doctor ID is required");
  }

  const getAppointment = await appointmentSlotDao.getSlot(doctorId);
  return Format.success(
    getAppointment,
    "Appointment Slot created successfully"
  );
};

export const updateAppointmentSlot = async (
  userId: number,
  appointmentSlotDTO: AppointmentSlotUpdateDTO
): Promise<any> => {
  const userDoctor = (await userDao.getUserWithRole(
    userId,
    Role.DOCTOR
  )) as User & { doctor: Doctor };

  if (!userDoctor) {
    return Format.notFound("Doctor is not found");
  }

  const existingAppointment =
    await appointmentSlotDao.findAppointmentSlotByIdAndDoctorId(
      appointmentSlotDTO.id,
      userDoctor.doctor.id
    );

  if (!existingAppointment) {
    return Format.notFound("Appointment not found");
  }

  if (existingAppointment.status !== "AVAILABLE") {
    return Format.badRequest(
      "Appointment can only be updated if it's available."
    );
  }

  const updatedAppointmentSlot =
    await appointmentSlotDao.updateAppointmentSlotById(
      appointmentSlotDTO.id,
      appointmentSlotDTO
    );

  return Format.success(
    updatedAppointmentSlot,
    "Appointment slot updated successfully"
  );
};

export const deleteSlot = async (appointmentSlotId: number): Promise<any> => {
  if (!appointmentSlotId) {
    return Format.badRequest("Appointment slot ID is required");
  }

  const appointmentSlot = await appointmentSlotDao.findAppointmentSlotById(
    appointmentSlotId
  );

  if (!appointmentSlot) {
    return Format.notFound("Appointment slot not found");
  }

  if (appointmentSlot.status !== "AVAILABLE") {
    return Format.badRequest(
      "Cannot delete the appointment slot because it is already booked."
    );
  }

  const deleteAppointment = await appointmentSlotDao.deleteAppointmentSlot(
    appointmentSlotId
  );
  return Format.success(
    deleteAppointment,
    "Appointment slot deleted successfully"
  );
};
