import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";
import * as emergencyContactController from "../controllers/contact.controller";

const router: Router = Router();

// Middleware to verify JWT token for all routes in this router
router.use(verifyJWT);

// Middleware to verify that the user has the PATIENT role for all routes in this router
router.use(verifyRole([Role.PATIENT]));

/**
 * Route to add a new emergency contact.
 *
 * @route POST /
 * @access Private
 */
router.post("", emergencyContactController.addEmergencyContact);

/**
 * Route to update an existing emergency contact.
 *
 * @route PATCH /
 * @access Private
 */
router.patch("", emergencyContactController.updateEmergencyContact);

/**
 * Route to delete an emergency contact by ID.
 *
 * @route DELETE /:id
 * @access Private
 */
router.delete("/:id", emergencyContactController.deleteEmergencyContact);

/**
 * Route to get all emergency contacts.
 *
 * @route GET /
 * @access Private
 */
router.get("", emergencyContactController.getEmergencyContacts);

export default router;
