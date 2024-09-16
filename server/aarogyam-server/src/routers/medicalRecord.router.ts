import { Router } from "express";
import * as medicalRecordController from "../controllers/medicalRecord.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Middleware to verify user roles (PATIENT or DOCTOR)
router.use(verifyRole([Role.PATIENT, Role.DOCTOR]));

/**
 * Route to add a new medical record.
 * Uses multer middleware to handle file uploads.
 * Access: PATIENT, DOCTOR
 */
router.post("", upload.any(), medicalRecordController.addMedicalRecord);

/**
 * Route to add a new medical record detail.
 * Access: PATIENT, DOCTOR
 */
router.post("/detail", medicalRecordController.addMedicalRecordDetail);

/**
 * Route to add a new medical record file.
 * Uses multer middleware to handle single file upload.
 * Access: PATIENT, DOCTOR
 */
router.post(
  "/file",
  upload.single("file"),
  medicalRecordController.addMedicalRecordFile
);

/**
 * Route to update an existing medical record.
 * Access: PATIENT, DOCTOR
 */
router.patch("", medicalRecordController.updateMedicalRecord);

/**
 * Route to update an existing medical record detail by ID.
 * Access: PATIENT, DOCTOR
 */
router.patch("/detail/:id", medicalRecordController.updateMedicalRecordDetails);

/**
 * Route to get all medical records.
 * Access: PATIENT, DOCTOR
 */
router.get("", medicalRecordController.getAllMedicalRecords);

/**
 * Route to get a specific medical record by ID.
 * Access: PATIENT, DOCTOR
 */
router.get("/:id", medicalRecordController.getMedicalRecord);

/**
 * Route to delete a specific medical record by ID.
 * Access: PATIENT, DOCTOR
 */
router.delete("/:id", medicalRecordController.deleteMedicalRecord);

/**
 * Route to delete a specific medical record detail by ID.
 * Access: PATIENT, DOCTOR
 */
router.delete("/detail/:id", medicalRecordController.deleteMedicalRecordDetail);

/**
 * Route to delete a specific medical record file by ID.
 * Access: PATIENT, DOCTOR
 */
router.delete("/file/:id", medicalRecordController.deleteMedicalRecordFile);

export default router;
