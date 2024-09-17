import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import * as patientController from "../controllers/patient.controller";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

// Middleware to verify JWT token for all routes in this router
router.use(verifyJWT);

// Middleware to verify that the user has the PATIENT role for all routes in this router
router.use(verifyRole([Role.PATIENT]));

/**
 * Route to update patient information, including profile image upload.
 *
 * (PATIENT role required)
 * @route PATCH /
 * @access Private
 * @param {string} profileImage - The profile image file to be uploaded.
 */
router.patch(
  "",
  upload.single("profileImage"),
  patientController.updatePatient
);

export default router;
