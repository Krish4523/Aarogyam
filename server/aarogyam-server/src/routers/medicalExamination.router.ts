import { Router } from "express";
import * as medicalExaminationController from "../controllers/medicalExamination.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.use(verifyJWT);

/**
 * Route to create a new medical examination.
 * Only accessible by users with the ADMIN role.
 */
router.post(
  "/",
  verifyRole([Role.ADMIN]),
  medicalExaminationController.createMedicalExamination
);

/**
 * Route to retrieve all medical examinations.
 */
router.get("/", medicalExaminationController.getAllMedicalExaminations);

/**
 * Route to retrieve a specific medical examination by ID.
 */
router.get("/:id", medicalExaminationController.getMedicalExaminationById);

/**
 * Route to update a medical examination by ID.
 * Only accessible by users with the ADMIN role.
 */
router.patch(
  "/:id",
  verifyRole([Role.ADMIN]),
  medicalExaminationController.updateMedicalExamination
);

/**
 * Route to delete a medical examination by ID.
 * Only accessible by users with the ADMIN role.
 */
router.delete(
  "/:id",
  verifyRole([Role.ADMIN]),
  medicalExaminationController.deleteMedicalExamination
);

export default router;
