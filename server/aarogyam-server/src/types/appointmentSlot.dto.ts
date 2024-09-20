import { z } from "zod";

export const AppointmentSlotSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["AVAILABLE", "BOOKED"]),
  type: z.enum(["ONLINE", "OFFLINE"]),
});
export const AppointmentSlotUpdateSchema = AppointmentSlotSchema.extend({
  id: z.number(),
});

export type AppointmentSlotDTO = z.infer<typeof AppointmentSlotSchema>;

export type AppointmentSlotUpdateDTO = z.infer<
  typeof AppointmentSlotUpdateSchema
>;
