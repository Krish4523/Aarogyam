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
 * Extends the UserUpdateDTOSchema with an additional gender field.
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
 * Inferred from PatientUpdateDTOSchema.
 */
export type PatientUpdateDTO = z.infer<typeof PatientUpdateSchema>;
export const CreateDoctorSchema = z.object({
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
});

export type CreateDoctorDTO = z.infer<typeof CreateDoctorSchema>;

export const DoctorUpdateSchema = UserUpdateSchema.extend({
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  rating: z.number().optional(),
}).refine(
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: "At least one field must be provided.",
  }
);

export type DoctorUpdateDTO = z.infer<typeof DoctorUpdateSchema>;
// export type CreateHospitalDTO = UserSignUp & {
//   name: string;
//   phone: string;
//   address: string;
// };
