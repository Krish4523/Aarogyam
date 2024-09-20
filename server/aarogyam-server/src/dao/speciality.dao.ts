import { PrismaClient, Speciality } from "@prisma/client";

const specialtyClient = new PrismaClient().speciality;

/**
 * Upsert a specialty record in the database.
 *
 * If a specialty with the given name exists, it updates the record.
 * Otherwise, it creates a new specialty record.
 *
 * @param {string} specialty - The name of the specialty.
 * @returns {Promise<Speciality>} A promise that resolves to the upserted specialty.
 */
export const upsertSpeciality = async (
  specialty: string
): Promise<Speciality> => {
  return specialtyClient.upsert({
    where: {
      name: specialty,
    },
    update: {},
    create: {
      name: specialty,
    },
  });
};
