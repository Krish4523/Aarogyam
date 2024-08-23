import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as userController from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";

const router: Router = Router();

// Use the verifyJWT middleware for all routes in this router
router.use(verifyJWT);

/**
 * Route to get user information.
 *
 * @route GET /
 * @access Protected
 * @controller userController.getUser
 */
router.route("").get(userController.getUser);

/**
 * Route to change the user's password.
 *
 * @route PATCH /changePassword
 * @access Protected
 * @controller userController.changePassword
 */
router.patch("/changePassword", userController.changePassword);

/**
 *
 * @route PUT /updateUser/
 * @access Protected
 * @middleware upload.single("profileImage")
 * @controller userController.updateUser
 */
router.put(
  "/update/",
  upload.single("profileImage"),
  userController.updateUser
);

export default router;
