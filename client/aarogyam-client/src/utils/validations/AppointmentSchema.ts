import { z } from "zod";

export const AppointmentSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string({ required_error: "start time is required" }),
  endTime: z.string({ required_error: "end time is required" }),
  notes: z.string().optional(),
});
