import { z } from "zod";

export const patientProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z.string({ required_error: "Email is required." }).email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be less than 15 digits." })
    .optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required." }),
        relation: z.string().min(1, { message: "Relation is required." }),
        phone: z
          .string()
          .min(10, { message: "Phone number must be at least 10 digits." })
          .max(15, { message: "Phone number must be less than 15 digits." }),
      })
    )
    .max(5, { message: "You can add up to 5 emergency contacts." })
    .optional(),
});
export const hospitalProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z.string({ required_error: "Email is required." }).email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be less than 15 digits." })
    .optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  website: z.string().url({ message: "Website url is required." }),
  services: z.array(z.string()),
});
