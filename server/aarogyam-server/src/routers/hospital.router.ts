import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

import * as hospitalController from "../controllers/hospital.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

// Use the verifyJWT middleware for all routes in this router
router.use(verifyJWT);

router.post("", verifyRole([Role.ADMIN]), hospitalController.createHospital);
router.get("/:id", hospitalController.getHospital);
router.patch(
  "",
  verifyRole([Role.HOSPITAL]),
  hospitalController.updateHospital
);
router.delete(
  "/:id",
  verifyRole([Role.ADMIN]),
  hospitalController.deleteHospital
);
export default router;
