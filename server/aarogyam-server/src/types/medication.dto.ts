import z from "zod";

const MedicationTimeSchema = z.object({
  time: z.string(),
  medicationId: z.number(),
});

export const MedicationSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  timesToTake: MedicationTimeSchema.array(),
  source: z.enum(["PATIENT", "DOCTOR"]),
});

export const MedicationUpdateSchema = MedicationSchema.extend({
  id: z.number(),
});

export type MedicationDTO = z.infer<typeof MedicationSchema>;

export type MedicationUpdateDTO = z.infer<typeof MedicationUpdateSchema>;
