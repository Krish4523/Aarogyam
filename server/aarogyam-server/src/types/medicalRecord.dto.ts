import { z } from "zod";

/**
 * Schema for validating medical record file information.
 *
 * @property {number} [medicalRecordId] - The ID of the medical record (optional).
 * @property {string} name - The name of the medical record file.
 * @property {string} url - The URL of the medical record file, transformed to a relative path.
 */
const fileSchema = z.object({
  name: z.string(),
  url: z.string().transform((path) => {
    if (!path) return path;
    const relativePath = path.split("uploads")[1];
    return `${relativePath.replace(/\\/g, "/")}`;
  }),
});

/**
 * Schema for validating medical record detail information.
 *
 * @property {number} [medicalRecordId] - The ID of the medical record (optional).
 * @property {number} result - The result of the medical examination.
 * @property {number} examinationReferenceId - The reference ID of the examination.
 */
const detailSchema = z.object({
  result: z.number(),
  examinationReferenceId: z.number(),
});

/**
 * Schema for validating medical record information.
 *
 * @property {number} [patientId] - The ID of the patient (optional).
 * @property {string} name - The name of the medical record.
 * @property {string} [description] - The description of the medical record (optional).
 * @property {Date} recordDate - The date of the medical record.
 * @property {MedicalRecordFileSchema[]} files - An array of medical record files.
 * @property {MedicalRecordDetailSchema[]} details - An array of medical record details.
 */
export const MedicalRecordSchema = z.object({
  patientId: z.number().optional(),
  doctorId: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  recordDate: z.string().date(),
  files: fileSchema.array(),
  details: detailSchema.array(),
});

export const MedicalRecordFileSchema = fileSchema.extend({
  medicalRecordId: z.number(),
});

export const MedicalRecordDetailSchema = detailSchema.extend({
  medicalRecordId: z.number(),
});

/**
 * Type definition for medical record file data transfer object.
 * Inferred from MedicalRecordFileSchema.
 */
export type MedicalRecordFileDTO = z.infer<typeof MedicalRecordFileSchema>;

/**
 * Type definition for medical record detail data transfer object.
 * Inferred from MedicalRecordDetailSchema.
 */
export type MedicalRecordDetailDTO = z.infer<typeof MedicalRecordDetailSchema>;

/**
 * Type definition for medical record data transfer object.
 * Inferred from MedicalRecordSchema.
 */
export type MedicalRecordDTO = z.infer<typeof MedicalRecordSchema>;

/**
 * Schema for validating medical examination information.
 *
 * @property {number} name - The name of the medical examination.
 * @property {string} [unit] - The unit of measurement for the examination (optional).
 * @property {("MALE" | "FEMALE")} [gender] - The gender for which the examination is applicable (optional).
 * @property {number} [normalRangeStart] - The start of the normal range for the examination (optional).
 * @property {number} [normalRangeEnd] - The end of the normal range for the examination (optional).
 */
export const MedicalExaminationSchema = z.object({
  name: z.string(),
  unit: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  normalRangeStart: z.number().optional(),
  normalRangeEnd: z.number().optional(),
});

/**
 * Type definition for medical examination data transfer object.
 * Inferred from MedicalExaminationSchema.
 */
export type MedicalExaminationDTO = z.infer<typeof MedicalExaminationSchema>;

export const MedicalRecordUpdateSchema = z.object({
  id: z.number(),
  patientId: z.number(),
  doctorId: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  recordDate: z.string().date(),
});

/**
 * Type definition for medical record update data transfer object.
 * Inferred from MedicalRecordUpdateSchema.
 */
export type MedicalRecordUpdateDTO = z.infer<typeof MedicalRecordUpdateSchema>;
