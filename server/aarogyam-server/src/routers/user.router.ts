import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as userController from "../controllers/user.controller";

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

router.post("/changePassword/:id", userController.changePassword);

export default router;
