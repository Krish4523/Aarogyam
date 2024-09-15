import { Hospital, PrismaClient } from "@prisma/client";

const hospital = new PrismaClient().hospital;

/**
 * Creates a new hospital record in the database.
 *
 * @param {number} userId - The ID of the user associated with the hospital.
 * @param {string | undefined} website - The website of the hospital.
 * @returns {Promise<Hospital>} A promise that resolves to the created hospital.
 */
export const create = async (
  userId: number,
  website: string | undefined
): Promise<Hospital> => {
  return hospital.create({
    data: {
      userId,
      website,
    },
  });
};

/**
 * Finds a hospital by its ID.
 *
 * @param {number} hospitalId - The ID of the hospital.
 * @returns {Promise<Hospital | null>} A promise that resolves to the hospital if found, otherwise null.
 */
export const findHospitalByID = async (
  hospitalId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({
    where: { id: hospitalId },
  });
};

/**
 * Deletes a hospital record from the database.
 *
 * @param {number} hospitalId - The ID of the hospital to be deleted.
 * @returns {Promise<Hospital>} A promise that resolves to the deleted hospital.
 */
export const deleteHospital = async (hospitalId: number): Promise<Hospital> => {
  return hospital.delete({ where: { id: hospitalId } });
};

/**
 * Retrieves a hospital by its ID, including the associated user.
 *
 * @param {number} hospitalId - The ID of the hospital.
 * @returns {Promise<Hospital | null>} A promise that resolves to the hospital if found, otherwise null.
 */
export const getHospitalWithUser = async (
  hospitalId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({
    where: { id: hospitalId },
    include: { user: true },
  });
};

/**
 * Updates a hospital record in the database.
 *
 * @param {number} userId - The ID of the user associated with the hospital.
 * @param {string} website - The new website of the hospital.
 * @returns {Promise<Hospital>} A promise that resolves to the updated hospital.
 */
export const updateHospital = async (
  userId: number,
  website: string
): Promise<Hospital> => {
  return hospital.update({
    where: { userId },
    data: { website },
  });
};

/**
 * Finds a hospital by the user ID.
 *
 * @param {number} userId - The ID of the user associated with the hospital.
 * @returns {Promise<Hospital>} A promise that resolves to the hospital if found.
 */
export const findHospitalByUserID = (
  userId: number
): Promise<Hospital | null> => {
  return hospital.findUnique({
    where: {
      userId,
    },
  });
};
