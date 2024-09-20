import Format from "../utils/format";
import { AppointmentDTO, AppointmentUpdateDTO } from "../types/appointment.dto";
import * as userDao from "../dao/user.dao";
import { Doctor, Hospital, Patient, Role, User } from "@prisma/client";
import * as appointmentDao from "../dao/appointment.dao";
import { SafeUser } from "../types/user.dto";

export const createAppointment = async (
  userId: number,
  appointmentData: AppointmentDTO
): Promise<any> => {
  const userPatient = (await userDao.getUserWithRole(
    userId,
    Role.PATIENT
  )) as User & { patient: Patient };

  if (!userPatient) {
    return Format.notFound("Patient not found");
  }
  const appointment = await appointmentDao.createAppointment(
    userPatient.patient.id,
    appointmentData
  );
  return Format.success(appointment, "Appointment created successfully");
};

export const getAllAppointmentByRole = async (user: SafeUser): Promise<any> => {
  if (user.role === "PATIENT") {
    const userPatient = (await userDao.getUserWithRole(
      user.id,
      Role.PATIENT
    )) as User & { patient: Patient };
    const appointment = await appointmentDao.getByPatient(
      userPatient.patient.id
    );
    return Format.success(appointment, "Patient Appointment");
  } else if (user.role === "DOCTOR") {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };

    const appointment = await appointmentDao.getByDoctor(userDoctor.doctor.id);
    return Format.success(appointment, "Doctor Appointment");
  } else if (user.role === "HOSPITAL") {
    const userHospital = (await userDao.getUserWithRole(
      user.id,
      Role.HOSPITAL
    )) as User & { hospital: Hospital };

    const appointment = await appointmentDao.getAllByHospitalId(
      userHospital.hospital.id
    );
    return Format.success(appointment, "Hospital all doctor Appointment");
  }
};

export const updateAppointmentByRole = async (
  user: SafeUser,
  appointmentData: AppointmentUpdateDTO
): Promise<any> => {
  if (user.role === "PATIENT") {
    const userPatient = (await userDao.getUserWithRole(
      user.id,
      Role.PATIENT
    )) as User & { patient: Patient };
    const appointment = await appointmentDao.findPatientAppointmnet(
      userPatient.patient.id,
      appointmentData.id
    );
    if (!appointment) {
      return Format.badRequest("Patient has no appointment");
    }
    const updateAppointment = await appointmentDao.updateAppointment(
      appointmentData.id,
      appointmentData
    );
    return Format.success(updateAppointment, "Patient Appointment");
  } else if (user.role === "DOCTOR") {
    const userDoctor = (await userDao.getUserWithRole(
      user.id,
      Role.DOCTOR
    )) as User & { doctor: Doctor };
    const appointment = await appointmentDao.findDoctorAppointmnet(
      userDoctor.doctor.id,
      appointmentData.id
    );
    if (!appointment) {
      return Format.badRequest("Patient has no appointment");
    }
    const updateAppointment = await appointmentDao.updateAppointment(
      appointmentData.id,
      appointmentData
    );
    return Format.success(updateAppointment, "Doctor Appointment");
  }
};
