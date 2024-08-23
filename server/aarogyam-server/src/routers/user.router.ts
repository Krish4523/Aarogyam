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

router.post("/changePassword", userController.changePassword);

router.put(
  "/updateUser/",
  upload.single("profileImage"),
  userController.updateUser
);

export default router;
