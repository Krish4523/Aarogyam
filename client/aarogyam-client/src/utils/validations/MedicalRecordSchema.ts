import { z } from "zod";

export const MedicalRecordSchema = z.object({
  name: z.string().min(1, "Record name is required"),
  description: z.string().optional(),
  recordDate: z.date({ required_error: "Record date is required" }),
  patientID: z.number().optional(),
  doctorID: z.number().optional(),
  recordDetails: z
    .array(
      z.object({
        name: z.string().min(1, "Detail name is required"),
        unit: z.string().optional(),
        normalRangeStart: z.number({
          required_error: "Normal range start is required",
        }),
        normalRangeEnd: z.number({
          required_error: "Normal range end is required",
        }),
        result: z.number({ required_error: "Result is required" }),
      })
    )
    .min(1, "At least one record detail is required"),
  medicalRecordFiles: z.array(z.instanceof(File)).optional(),
});
