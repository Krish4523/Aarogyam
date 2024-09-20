import { Doctor, PrismaClient } from "@prisma/client";

const doctorClient = new PrismaClient().doctor;

/**
 * Creates a new doctor record in the database.
 *
 * @param {number} hospitalId - The ID of the hospital.
 * @param {number} userId - The ID of the user.
 * @param {string} gender - The gender of the doctor.
 * @param {number} rating - The rating of the doctor.
 * @param {number[]} specialtyIds - An array of specialty IDs to associate with the doctor.
 * @returns {Promise<Doctor>} A promise that resolves to the created doctor.
 */
export const create = async (
  hospitalId: number,
  userId: number,
  gender: string,
  rating: number,
  specialtyIds: number[]
): Promise<Doctor> => {
  return doctorClient.create({
    data: {
      userId,
      hospitalId,
      gender,
      rating,
      specialties: {
        connect: specialtyIds.map((id) => ({ id })),
      },
    },
    include: {
      specialties: true,
    },
  });
};

/**
 * Finds a doctor by user ID.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Doctor | null>} A promise that resolves to the doctor if found, otherwise null.
 */
export async function findDoctorByUserId(
  userId: number
): Promise<Doctor | null> {
  return doctorClient.findUnique({
    where: { userId },
  });
}

/**
 * Updates a doctor record in the database.
 *
 * @param {number} userId - The ID of the user.
 * @param {Partial<Doctor>} data - The data to update.
 * @param {number[]} [specialtiesIds] - An optional array of specialty IDs to associate with the doctor.
 * @returns {Promise<Doctor>} A promise that resolves to the updated doctor.
 */
export const updateDoctor = async (
  userId: number,
  data: Partial<Doctor>,
  specialtiesIds?: number[]
): Promise<Doctor> => {
  const updateData: any = { ...data };

  if (specialtiesIds && specialtiesIds.length > 0) {
    updateData.specialties = {
      set: specialtiesIds.map((id) => ({ id })),
    };
  }

  return doctorClient.update({
    where: {
      userId,
    },
    data: updateData,
  });
};

/**
 * Deletes a doctor record from the database.
 *
 * @param {number} doctorId - The ID of the doctor.
 * @returns {Promise<Doctor>} A promise that resolves to the deleted doctor.
 */
export const deleteDoctor = async (doctorId: number): Promise<Doctor> => {
  return doctorClient.delete({ where: { id: doctorId } });
};

/**
 * Retrieves a doctor by ID.
 *
 * @param {number} doctorId - The ID of the doctor.
 * @returns {Promise<Doctor | null>} A promise that resolves to the doctor if found, otherwise null.
 */
export const getDoctor = async (doctorId: number): Promise<Doctor | null> => {
  return doctorClient.findUnique({
    where: { id: doctorId },
    include: {
      user: true,
      specialties: true,
    },
  });
};
