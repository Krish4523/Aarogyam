import { z } from "zod";

export const AppointmentSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  time: z.string({ required_error: "Time is required" }),
  notes: z.string().optional(),
});
