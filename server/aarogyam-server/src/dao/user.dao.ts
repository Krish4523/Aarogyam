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
 * Finds a safe user by their ID.
 *
 * @param id - The ID of the user to find.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export const findSafeUserByID = async (id: number): Promise<User | null> => {
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
 * @param name
 * @param phone
 * @param address
 * @param profileImage
 * @param id - The ID of the user to update.
 * @returns A promise that resolves to the updated user.
 */
export const updateUser = async (
  name: string,
  phone: string,
  address: string | null,
  profileImage: string | undefined,
  id: number
): Promise<User> => {
  return userClient.update({
    where: {
      id,
    },
    data: {
      name,
      phone,
      address,
      profile_image: profileImage,
    },
  });
};
