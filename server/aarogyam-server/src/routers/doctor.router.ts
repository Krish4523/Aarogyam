import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

import * as doctorController from "../controllers/doctor.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

// Use the verifyJWT middleware for all routes in this router
router.use(verifyJWT);

// router.use(verifyRole([Role.]));

// create,edit patient  --Done
// add/remove/edit emergency contact --Done
// doctor --> Get all     --Done
//        --> Create and Delete -> Hospital   --Done
//        --> Edit Doctor and Hospital    --Done
// Hospital --> Get all  --Done
//        --> Create and Delete -> admin  --Done
//        --> Edit Hospital

// medical record router (add/edit/get/(get/key))
// Doctor router (CRUD) | Appointment Slot (CRUD)
// admin router (add hospital)
// appointment router (CRUD)

// router.patch("", patientController.updatePatient);

router.post("", verifyRole([Role.HOSPITAL]), doctorController.createDoctor);
router.get("/:id", doctorController.getDoctors);
router.patch(
  "",
  verifyRole([Role.HOSPITAL, Role.DOCTOR]),
  doctorController.updateDoctor
);
router.delete(
  "/:id",
  verifyRole([Role.HOSPITAL]),
  doctorController.deleteDoctor
);
export default router;
