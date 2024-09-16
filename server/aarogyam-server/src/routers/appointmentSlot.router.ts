import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as appointmentSlotController from "../controllers/appointmentSlot.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.use(verifyJWT);

router.get(
  "/:id",
  verifyRole([Role.DOCTOR, Role.PATIENT]),
  appointmentSlotController.getAppointmentSlot
);

router.patch(
  "",
  verifyRole([Role.DOCTOR]),
  appointmentSlotController.updateAppointmentSlot
);

router.post(
  "",
  verifyRole([Role.DOCTOR]),
  appointmentSlotController.createAppointmentSlot
);

router.delete(
  "",
  verifyRole([Role.DOCTOR]),
  appointmentSlotController.deleteAppointmentSlot
);

export default router;
