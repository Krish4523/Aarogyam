import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import * as emergencyContactController from "../controllers/emergencyContact.controller";

const router: Router = Router();

// Use the verifyJWT middleware for all routes in this router
router.use(verifyJWT);
router.use(verifyRole([Role.PATIENT]));

router.post("", emergencyContactController.addEmergencyContact);

router.patch("", emergencyContactController.updateEmergencyContact);

router.delete("/:id", emergencyContactController.deleteEmergencyContact);

router.get("", emergencyContactController.getEmergencyContacts);

export default router;
