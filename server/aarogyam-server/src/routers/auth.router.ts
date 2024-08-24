import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router: Router = Router();

/**
 * Route to handle user login.
 *
 * @route POST /login
 * @access Public
 * @controller authController.loginController
 */
router.route("/login").post(authController.loginController);

/**
 * Route to handle user signup.
 *
 * @route POST /signup
 * @access Public
 * @controller authController.signUpController
 */
router.route("/signup").post(authController.signUpController);

/**
 * Route to verify user token.
 *
 * @route GET /verify/:token
 * @access Public
 * @controller authController.verifyTokenController
 */
router.route("/verify/:token").get(authController.verifyTokenController);

/**
 * Route to send a reset password email.
 *
 * @route POST /sendRestPasswordMail/
 * @access Public
 * @controller authController.sendRestPasswordMail
 */
router.post("/send-reset-password-mail/", authController.sendRestPasswordMail);

/**
 * Route to reset the user's password.
 *
 * @route POST /resetPassword/:token
 * @access Public
 * @controller authController.resetPassword
 */
router.post("/reset-password/:token", authController.resetPassword);

export default router;
