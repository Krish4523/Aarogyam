import Format from "../utils/format";
import * as doctorDao from "../dao/doctor.dao";
import * as userDao from "../dao/user.dao";
import bcrypt from "bcrypt";
import { Doctor, Hospital, Role, Speciality, User } from "@prisma/client";
import { DoctorCreateDTO, DoctorUpdateDTO, SafeUser } from "../types/user.dto";
import { upsertSpeciality } from "../dao/speciality.dao";

/**
 * Retrieves the IDs of the given specialties.
 *
 * @param {string[]} specialties - An array of specialty names.
 * @returns {Promise<number[]>} A promise that resolves to an array of specialty IDs.
 */
const getSpecialityIds = async (specialties: string[]): Promise<number[]> => {
  // Normalize the specialties (convert to lowercase and trim any whitespace)
  const normalizedSpecialties = specialties.map((s) => s.trim().toLowerCase());

  // Array to store the specialties ids
  const specialtiesIds: number[] = [];

  for (const specialty of normalizedSpecialties) {
    const specialtyRecord = await upsertSpeciality(specialty);
    specialtiesIds.push(specialtyRecord.id);
  }

  return specialtiesIds;
};

/**
 * Creates a new doctor.
 *
 * @param {number} hospitalUserId - The ID of the hospital user creating the doctor.
 * @param {DoctorCreateDTO} doctorCreateDTO - The data transfer object containing doctor creation details.
 * @returns {Promise<any>} A promise that resolves to the result of the creation operation.
 */
export const create = async (
  hospitalUserId: number,
  doctorCreateDTO: DoctorCreateDTO
): Promise<any> => {
  const existingUser: any = await userDao.findByEmailOrPhone(
    doctorCreateDTO.email,
    doctorCreateDTO.phone
  );

  if (existingUser) return Format.conflict(null, "Doctor already exists");

  const { gender, rating, specialties, ...userData } = doctorCreateDTO;
  const hashPassword = await bcrypt.hash(doctorCreateDTO.name + "@123", 10);

  const user = await userDao.create({
    ...userData,
    password: hashPassword,
    isVerified: true,
    role: Role.DOCTOR,
  });

  const specialtiesIds = await getSpecialityIds(specialties);

  const userHospital = (await userDao.getUserWithRole(
    hospitalUserId,
    Role.HOSPITAL
  )) as User & { hospital: Hospital };

  if (!userHospital) return Format.notFound("Hospital Not found");

  const doctor = await doctorDao.create(
    userHospital.hospital.id,
    user.id,
    gender,
    rating,
    specialtiesIds
  );

  return Format.success(doctor, "Doctor create successfully");
};

/**
 * Updates an existing doctor.
 *
 * @param {number} userId - The ID of the user to be updated.
 * @param {DoctorUpdateDTO} doctorUpdateDTO - The data transfer object containing doctor update details.
 * @returns {Promise<any>} A promise that resolves to the result of the update operation.
 */
export const updateDoctor = async (
  userId: number,
  doctorUpdateDTO: DoctorUpdateDTO
): Promise<any> => {
  const existingDoctor = await doctorDao.findDoctorByUserId(userId);
  if (!existingDoctor) {
    return Format.notFound("User not found");
  }

  const { gender, rating, specialties, ...userData } = doctorUpdateDTO;

  const specialtiesIds = await getSpecialityIds(specialties);

  if (userData) await userDao.updateUser(userId, userData);
  if (gender || rating)
    await doctorDao.updateDoctor(
      userId,
      {
        ...(gender && { gender }),
        ...(rating && { rating }),
      },
      specialtiesIds
    );

  const updatedUser = await userDao.getUserWithRole(userId, Role.DOCTOR);

  return Format.success(updatedUser, "Doctor update successfully");
};

/**
 * Deletes an existing doctor.
 *
 * @param {number} doctorId - The ID of the doctor to be deleted.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
export const deleteDoctor = async (doctorId: number): Promise<any> => {
  const doctor = (await doctorDao.getDoctor(doctorId)) as Doctor;
  if (!doctor) {
    return Format.notFound("Doctor not found");
  }
  await doctorDao.deleteDoctor(doctor.id);
  await userDao.deleteUser(doctor.userId);
  return Format.success({}, "Doctor delete successfully");
};

/**
 * Retrieves a doctor by ID.
 *
 * @param {number} doctorId - The ID of the doctor to be retrieved.
 * @returns {Promise<any>} A promise that resolves to the result of the retrieval operation.
 */
export const getDoctor = async (doctorId: number): Promise<any> => {
  const doctor = (await doctorDao.getDoctor(doctorId)) as Doctor;
  if (!doctor) {
    return Format.notFound("Doctor not found");
  }
  const { user, specialties, gender, rating, id } = doctor as Doctor & {
    user: User;
  } & {
    specialties: Speciality[];
  };
  const { name, email, phone, address, profileImage } = user as SafeUser;
  return Format.success({
    id,
    name,
    email,
    phone,
    address,
    profileImage,
    gender,
    rating,
    specialties,
  });
};
