import z from "zod";
import { MedicationSchema } from "./medication.dto";

const medicinesSchema = MedicationSchema.extend({
  patientId: z.number(),
});
export const PrescriptionSchema = z.object({
  patientId: z.number(),
  notes: z.string().optional(),
  medicines: medicinesSchema.array(),
});
