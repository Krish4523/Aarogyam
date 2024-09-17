import { z } from "zod";

export const AppointmentSchema = z.object({
  date: z.string(),
  location: z.string().optional(),
  videoLink: z.string().optional(),
  status: z.enum(["AVAILABLE", "BOOKED"]),
  type: z.enum(["ONLINE", "OFFLINE"]),
  notes: z.string().optional(),
});
export const AppointmentUpdateSchema = AppointmentSchema.extend({
  id: z.number(),
});

export type AppointmentDTO = z.infer<typeof AppointmentSchema>;

export type AppointmentUpdateDTO = z.infer<typeof AppointmentUpdateSchema>;
