import { PrismaClient, Role, User } from "@prisma/client";
import { CreateUser } from "../types/user.dto";

const userClient = new PrismaClient().user;

/**
 * Finds a user by their email or phone number.
 *
 * @param email - The email of the user to find.
 * @param phone - The phone number of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findByEmailOrPhone = async (
  email: string | undefined,
  phone: string | undefined
): Promise<User | null> => {
  return userClient.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
};

/**
 * Creates a new user.
 *
 * @param user - The user data to create.
 * @returns A promise that resolves to the created user.
 */
export const create = async (
  user: CreateUser & { role: Role }
): Promise<User> => {
  return userClient.create({
    data: user,
  });
};

/**
 * Updates the verification status of a user.
 *
 * @param id - The ID of the user to update.
 * @returns A promise that resolves to the updated user.
 */
export const updateIsVerified = async (id: number): Promise<User> => {
  return userClient.update({
    where: {
      id,
    },
    data: {
      isVerified: true,
    },
  });
};

/**
 * Retrieves a user along with their role-specific information.
 *
 * @param id - The ID of the user.
 * @param role - The role of the user (e.g., PATIENT, DOCTOR, HOSPITAL).
 * @returns A promise that resolves to the user with their role-specific information or null if not found.
 */
export async function getUserWithRole(id: number, role: Role) {
  return userClient.findUnique({
    where: {
      id,
    },
    include: {
      patient:
        role === Role.PATIENT
          ? {
              include: {
                emergencyContacts: true,
              },
            }
          : false,
      doctor:
        role === Role.DOCTOR
          ? {
              include: {
                specialties: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            }
          : false,
      hospital:
        role === Role.HOSPITAL
          ? {
              include: {
                services: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            }
          : false,
    },
  });
}

/**
 * Finds a safe user by their ID.
 *
 * @param id - The ID of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findSafeUserByID = async (id: number): Promise<any> => {
  return userClient.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      profileImage: true,
      isVerified: true,
    },
  });
};

/**
 * Finds a user by their ID.
 *
 * @param id - The ID of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findByID = async (id: number): Promise<User | null> => {
  return userClient.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Updates the password of a user.
 *
 * @param id - The ID of the user to update.
 * @param newPassword - The new password to set.
 * @returns A promise that resolves to the updated user.
 */
export const updatePassword = async (id: number, newPassword: string) => {
  return userClient.update({
    where: {
      id,
    },
    data: {
      password: newPassword,
    },
  });
};

/**
 * Finds a user by their email.
 *
 * @param email - The email of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findByEmail = async (email: string): Promise<User | null> => {
  return userClient.findUnique({
    where: {
      email,
    },
  });
};

/**
 * Resets the password of a user.
 *
 * @param password - The new password to set.
 * @param id - The ID of the user to update.
 * @returns A promise that resolves to the updated user.
 */
export const resetPassword = async (
  password: string,
  id: number
): Promise<User> => {
  return userClient.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });
};

/**
 * Updates the user information.
 *
 * @param id - The ID of the user to update.
 * @param data - The data to update.
 * @returns A promise that resolves to the updated user.
 */
export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  return userClient.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteUser = async (userId: number): Promise<User | null> => {
  return userClient.delete({
    where: {
      id: userId,
    },
  });
};
