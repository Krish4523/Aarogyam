import { PrismaClient, User } from "@prisma/client";
import { UserSignUp } from "../types/user";

const userClient = new PrismaClient().user;

/**
 * Finds a user by their email or phone number.
 *
 * @param email - The email of the user to find.
 * @param phone - The phone number of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findByEmailOrPhone = async (
  email: string | null,
  phone: string | null
): Promise<User | null> => {
  return userClient.findFirst({
    where: {
      OR: [{ email: email || undefined }, { phone: phone || undefined }],
    },
  });
};

/**
 * Creates a new user.
 *
 * @param user - The user data to create.
 * @returns A promise that resolves to the created user.
 */
export const create = async (user: UserSignUp): Promise<User> => {
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
 * Finds a user by their ID.
 *
 * @param id - The ID of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findByID = async (id: number) => {
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
      profile_image: true,
      isVerified: true,
      created_at: true,
      updated_at: true,
    },
  });
};
