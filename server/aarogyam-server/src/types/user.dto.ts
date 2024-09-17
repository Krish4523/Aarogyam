import { Role } from "@prisma/client";
import { z } from "zod";

/**
 * Schema for validating user sign-up information.
 *
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} phone - The phone number of the user, must be at least 10 characters long.
 * @property {string} password - The password of the user, must be at least 8 characters long.
 */
export const UserSignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
});

/**
 * Type definition for user sign-up data transfer object.
 * Inferred from UserSignUpSchema.
 */
export type UserSignUpDTO = z.infer<typeof UserSignUpSchema>;

/**
 * Schema for creating a new user.
 * Extends the UserSignUpSchema with additional fields.
 *
 * @property {string} [address] - The address of the user (optional).
 * @property {string} [profileImage] - The profile image URL of the user (optional).
 * @property {boolean} [isVerified] - The verification status of the user (optional).
 */
const CreateUserSchema = UserSignUpSchema.extend({
  address: z.string().optional(),
  profileImage: z
    .string()
    .optional()
    .transform((path) => {
      if (!path) return path;
      const relativePath = path.split("public")[1];
      return `${relativePath.replace(/\\/g, "/")}`;
    }),
  isVerified: z.boolean().optional(),
});

/**
 * Type definition for creating a new user.
 * Inferred from CreateUserSchema.
 */
export type CreateUser = z.infer<typeof CreateUserSchema>;

/**
 * Schema for validating user login information.
 * Either email or phone must be provided.
 *
 * @property {string} [email] - The email address of the user (optional).
 * @property {string} [phone] - The phone number of the user, must be at least 10 characters long (optional).
 * @property {string} password - The password of the user, must be at least 8 characters long.
 */
export const UserLoginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    password: z.string().min(8),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email", "phone"],
  });

/**
 * Type definition for user login data transfer object.
 * Inferred from UserLoginSchema.
 */
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

/**
 * Type definition for a safe user object.
 *
 * @property {number} id - The unique identifier of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {Role} role - The role of the user.
 * @property {string} phone - The phone number of the user.
 * @property {string} [address] - The address of the user (optional).
 * @property {string} [profileImage] - The profile image URL of the user (optional).
 * @property {boolean} isVerified - The verification status of the user.
 */
export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string;
  address?: string;
  profileImage?: string;
  isVerified: boolean;
};

/**
 * Schema for validating user update information.
 *
 * @property {string} [name] - The name of the user (optional).
 * @property {string} [phone] - The phone number of the user, must be at least 10 characters long (optional).
 * @property {string} [address] - The address of the user (optional).
 * @property {string} [profileImage] - The profile image URL of the user (optional).
 */
const UserUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10).optional(),
  address: z.string().optional(),
  profileImage: z
    .string()
    .optional()
    .transform((path) => {
      if (!path) return path;
      const relativePath = path.split("public")[1];
      return `${relativePath.replace(/\\/g, "/")}`;
    }),
});

/**
 * Schema for validating patient update information.
 * Extends the UserUpdateSchema with an additional gender field.
 * At least one field must be provided.
 *
 * @property {string} [gender] - The gender of the patient, must be either "MALE" or "FEMALE" (optional).
 */
export const PatientUpdateSchema = UserUpdateSchema.extend({
  gender: z.enum(["MALE", "FEMALE"]).optional(),
}).refine(
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: "At least one field must be provided.",
  }
);

/**
 * Type definition for patient update data transfer object.
 * Inferred from PatientUpdateSchema.
 */
export type PatientUpdateDTO = z.infer<typeof PatientUpdateSchema>;

/**
 * Schema for creating a new doctor.
 *
 * @property {string} name - The name of the doctor.
 * @property {string} phone - The phone number of the doctor, must be at least 10 characters long.
 * @property {string} address - The address of the doctor.
 * @property {string} [profileImage] - The profile image URL of the doctor (optional).
 * @property {string} email - The email address of the doctor.
 * @property {string} gender - The gender of the doctor, must be either "MALE" or "FEMALE".
 * @property {number} rating - The rating of the doctor.
 * @property {string[]} specialties - An array of specialties of the doctor.
 */
export const DoctorCreateSchema = z.object({
  name: z.string(),
  phone: z.string().min(10),
  address: z.string(),
  profileImage: z
    .string()
    .optional()
    .transform((path) => {
      if (!path) return path;
      const relativePath = path.split("public")[1];
      return `${relativePath.replace(/\\/g, "/")}`;
    }),
  email: z.string().email(),
  gender: z.enum(["MALE", "FEMALE"]),
  rating: z.number(),
  specialties: z.string().array(),
});

/**
 * Type definition for creating a new doctor.
 * Inferred from DoctorCreateSchema.
 */
export type DoctorCreateDTO = z.infer<typeof DoctorCreateSchema>;

/**
 * Schema for updating doctor information.
 * Extends the UserUpdateSchema with additional fields.
 * At least one field must be provided.
 *
 * @property {string} [gender] - The gender of the doctor, must be either "MALE" or "FEMALE" (optional).
 * @property {number} [rating] - The rating of the doctor (optional).
 * @property {string[]} specialties - An array of specialties of the doctor.
 */
export const DoctorUpdateSchema = UserUpdateSchema.extend({
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  rating: z.number().optional(),
  specialties: z.string().array(),
});

/**
 * Type definition for updating doctor information.
 * Inferred from DoctorUpdateSchema.
 */
export type DoctorUpdateDTO = z.infer<typeof DoctorUpdateSchema>;

/**
 * Schema for creating a new hospital.
 *
 * @property {string} name - The name of the hospital.
 * @property {string} phone - The phone number of the hospital, must be at least 10 characters long.
 * @property {string} address - The address of the hospital.
 * @property {string} [profileImage] - The profile image URL of the hospital (optional).
 * @property {string} email - The email address of the hospital.
 * @property {string} [website] - The website URL of the hospital (optional).
 */
export const HospitalCreateSchema = z.object({
  name: z.string(),
  phone: z.string().min(10),
  address: z.string(),
  profileImage: z
    .string()
    .optional()
    .transform((path) => {
      if (!path) return path;
      const relativePath = path.split("public")[1];
      return `${relativePath.replace(/\\/g, "/")}`;
    }),
  email: z.string().email(),
  website: z.string().url().optional(),
  services: z.string().array(),
});

/**
 * Type definition for creating a new hospital.
 * Inferred from HospitalCreateSchema.
 */
export type HospitalCreateDTO = z.infer<typeof HospitalCreateSchema>;

/**
 * Schema for updating hospital information.
 * Extends the UserUpdateSchema with additional fields.
 * At least one field must be provided.
 *
 * @property {string} [website] - The website URL of the hospital (optional).
 */
export const HospitalUpdateSchema = UserUpdateSchema.extend({
  website: z.string().url().optional(),
  services: z.string().array(),
});

/**
 * Type definition for updating hospital information.
 * Inferred from HospitalUpdateSchema.
 */
export type HospitalUpdateDTO = z.infer<typeof HospitalUpdateSchema>;
