import { Appointment, PrismaClient } from "@prisma/client";
import { AppointmentDTO, AppointmentUpdateDTO } from "../types/appointment.dto";

const appointmentClient = new PrismaClient().appointment;

export const createAppointment = async (
  patientId: number,
  appointmentData: AppointmentDTO
): Promise<Appointment> => {
  return appointmentClient.create({
    data: {
      patientId,
      ...appointmentData,
    },
  });
};

export const getByPatient = async (
  patientId: number
): Promise<Appointment[]> => {
  return appointmentClient.findMany({
    where: {
      patientId,
    },
  });
};

export const getByDoctor = async (doctorId: number): Promise<Appointment[]> => {
  return appointmentClient.findMany({
    where: {
      doctorId,
    },
  });
};

export const getAllByHospitalId = async (
  hospitalId: number
): Promise<Appointment[]> => {
  return appointmentClient.findMany({
    where: {
      doctor: { hospitalId },
    },
  });
};

export const updateAppointment = async (
  appointmentId: number,
  appointmentData: AppointmentUpdateDTO
): Promise<Appointment> => {
  return appointmentClient.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: appointmentData.status,
    },
  });
};

export const findPatientAppointmnet = async (
  patientId: number,
  appointmentId: number
): Promise<Appointment[]> => {
  return appointmentClient.findMany({
    where: {
      id: appointmentId,
      patientId,
    },
  });
};

export const findDoctorAppointmnet = async (
  doctorId: number,
  appointmentId: number
): Promise<Appointment[]> => {
  return appointmentClient.findMany({
    where: {
      id: appointmentId,
      doctorId,
    },
  });
};
