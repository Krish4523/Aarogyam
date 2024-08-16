import { Role, User } from "@prisma/client";

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
};

/**
 * Represents a user object without sensitive information.
 *
 * @typedef {Omit<User, "password" | "VerificationToken">} SafeUser
 */
export type SafeUser = Omit<User, "password" | "VerificationToken">;
