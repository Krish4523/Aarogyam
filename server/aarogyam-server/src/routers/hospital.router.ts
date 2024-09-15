import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as hospitalController from "../controllers/hospital.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

router.use(verifyJWT);

/**
 * Route to create a new hospital.
 * Only accessible by users with the ADMIN role.
 * Uses multer middleware to handle profile image upload.
 */
router.post(
  "",
  verifyRole([Role.ADMIN]),
  upload.single("profileImage"),
  hospitalController.createHospital
);

/**
 * Route to get hospital details by ID.
 * Accessible by any authenticated user.
 */
router.get("/:id", hospitalController.getHospital);

/**
 * Route to update hospital details.
 * Only accessible by users with the HOSPITAL role.
 * Uses multer middleware to handle profile image upload.
 */
router.patch(
  "",
  verifyRole([Role.HOSPITAL]),
  upload.single("profileImage"),
  hospitalController.updateHospital
);

/**
 * Route to delete a hospital by ID.
 * Only accessible by users with the ADMIN role.
 */
router.delete(
  "/:id",
  verifyRole([Role.ADMIN]),
  hospitalController.deleteHospital
);

export default router;
