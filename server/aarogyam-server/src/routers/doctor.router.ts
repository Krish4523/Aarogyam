import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as doctorController from "../controllers/doctor.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

router.use(verifyJWT);

// medical record router (add/edit/get/(get/key))
// Appointment Slot (CRUD)
// appointment router (CRUD)

// router.patch("", patientController.updatePatient);

/**
 * Route to create a new doctor.
 * Only accessible by users with the HOSPITAL role.
 */
router.post(
  "",
  verifyRole([Role.HOSPITAL]),
  upload.single("profileImage"),
  doctorController.createDoctor
);

/**
 * Route to get doctor details by ID.
 * Accessible by users with the HOSPITAL or PATIENT role.
 */
router.get(
  "/:id",
  verifyRole([Role.HOSPITAL, Role.PATIENT]),
  doctorController.getDoctors
);

/**
 * Route to update doctor details.
 * Only accessible by users with the DOCTOR role.
 * Uses multer middleware to handle profile image upload.
 */
router.patch(
  "",
  verifyRole([Role.DOCTOR]),
  upload.single("profileImage"),
  doctorController.updateDoctor
);

/**
 * Route to delete a doctor by ID.
 * Only accessible by users with the HOSPITAL role.
 */
router.delete(
  "/:id",
  verifyRole([Role.HOSPITAL]),
  doctorController.deleteDoctor
);

export default router;
