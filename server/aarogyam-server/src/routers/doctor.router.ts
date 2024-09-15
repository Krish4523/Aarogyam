import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

import * as doctorController from "../controllers/doctor.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

router.use(verifyJWT);

// medical record router (add/edit/get/(get/key))
// Doctor router (CRUD) | Appointment Slot (CRUD)
// admin router (add hospital)
// appointment router (CRUD)

// router.patch("", patientController.updatePatient);

router.post("", verifyRole([Role.HOSPITAL]), doctorController.createDoctor);
router.get(
  "/:id",
  verifyRole([Role.HOSPITAL, Role.PATIENT]),
  doctorController.getDoctors
);
router.patch(
  "",
  verifyRole([Role.DOCTOR]),
  upload.single("profileImage"),
  doctorController.updateDoctor
);
router.delete(
  "/:id",
  verifyRole([Role.HOSPITAL]),
  doctorController.deleteDoctor
);
export default router;
