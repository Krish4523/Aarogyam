import z from "zod";
import { MedicationSchema } from "./medication.dto";

const medicinesSchema = MedicationSchema.extend({
  patientId: z.number(),
});
export const PrescriptionSchema = z.object({
  patientId: z.number(),
  notes: z.string().optional(),
  medicines: medicinesSchema.array(),
  appointmentId: z.number().optional(),
});

export const PrescriptionUpdateSchema = PrescriptionSchema.extend({
  id: z.number(),
});

export type PrescriptionDTO = z.infer<typeof PrescriptionSchema>;

export type PrescriptionUpdateDTO = z.infer<typeof PrescriptionUpdateSchema>;
