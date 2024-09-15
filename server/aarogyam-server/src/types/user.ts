import { Doctor, Role, User } from "@prisma/client";

/**
 * Represents the data required for a user to sign up.
 *
 * @typedef {Object} UserSignUp
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} phone - The phone number of the user.
 * @property {string} password - The password of the user.
 * @property {Role} role - The role of the user.
 */
export type UserSignUp = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  isVerified: boolean;
};

/**
 * Represents a user object without sensitive information.
 *
 * @typedef {Omit<User, "password" | "VerificationToken">} SafeUser
 */
export type SafeUser = Omit<User, "password" | "VerificationToken">;

export type SafeDoctor = Omit<
  Doctor,
  "id" | "createdAt" | "updatedAt" | "hospitalId"
>;

export type CreateDoctorDTO = UserSignUp & { gender: string; rating: number };

export type CreateHospitalDTO = UserSignUp & {
  name: string;
  phone: string;
  address: string;
};
