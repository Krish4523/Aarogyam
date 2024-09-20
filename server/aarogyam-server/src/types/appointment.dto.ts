import { z } from "zod";

export const AppointmentSchema = z.object({
  date: z.string(),
  doctorId: z.number(),
  location: z.string().optional(),
  videoLink: z.string().optional(),
  status: z.enum([
    "PENDING",
    "COMPLETED",
    "CANCELLED_BY_PATIENT",
    "CANCELLED_BY_DOCTOR",
  ]),
  type: z.enum(["ONLINE", "OFFLINE"]),
  notes: z.string().optional(),
});
export const AppointmentUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "COMPLETED",
    "CANCELLED_BY_PATIENT",
    "CANCELLED_BY_DOCTOR",
  ]),
  notes: z.string().optional(),
  id: z.number(),
});

export type AppointmentDTO = z.infer<typeof AppointmentSchema>;

export type AppointmentUpdateDTO = z.infer<typeof AppointmentUpdateSchema>;
