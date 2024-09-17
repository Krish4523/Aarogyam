import { PrismaClient, Service } from "@prisma/client";

const serviceClient = new PrismaClient().service;

/**
 * Upsert a service record in the database.
 *
 * If a service with the given name exists, it updates the record.
 * Otherwise, it creates a new service record.
 *
 * @param {string} service - The name of the service.
 * @returns {Promise<Service>} A promise that resolves to the upserted service.
 */
export const upsertService = async (service: string): Promise<Service> => {
  return serviceClient.upsert({
    where: {
      name: service,
    },
    update: {},
    create: {
      name: service,
    },
  });
};
