import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateAccessToken";
import { Role, Token, TokenType, User } from "@prisma/client";
import crypto from "crypto";
import * as tokenDao from "../dao/token.dao";
import { sendEmail } from "./mail.service";
import env from "../configs/env";

/**
 * Logs in a user by verifying their email/phone and password.
 * If the user is not verified, a verification email is sent.
 * If the credentials are valid, an access token is returned.
 *
 * @param {string | null} email - The email of the user to log in.
 * @param {string | null} phone - The phone number of the user to log in.
 * @param {string} password - The password of the user to log in.
 * @returns {Promise<any>} The access token if the login is successful, or an error message if not.
 */
export const loginUser = async (
  email: string | null,
  phone: string | null,
  password: string
): Promise<any> => {
  if ((!email && !phone) || !password) {
    return Format.badRequest(
      null,
      "Username or phone number and password are required"
    );
  }

  const user: any = await userDao.findByEmailOrPhone(email, phone);

  if (!user) return Format.notFound("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!user.isVerified) {
    await sendVerificationMail(user);
    return Format.unAuthorized(
      "Email not verified. Verification link sent to your email."
    );
  }

  if (!isMatch) return Format.unAuthorized("Invalid credentials");

  const { accessToken } = generateTokens({ id: user.id, email: user.email });

  if (user) return Format.success(accessToken, "User login successful");
};

/**
 * Signs up a new user.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} phone - The phone number of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<any>} A promise that resolves to the result of the sign-up process.
 */
export async function signUp(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<any> {
  if (!name || !email || !phone || !password) {
    return Format.badRequest(null, "All fields are required");
  }

  const existingUser: any = await userDao.findByEmailOrPhone(email, phone);

  if (existingUser) return Format.conflict(null, "User already exists");

  const hashPassword = await bcrypt.hash(password, 10);

  const user: User = await userDao.create({
    name,
    email,
    phone,
    password: hashPassword,
    role: Role.PATIENT,
  });

  // create patient

  await sendVerificationMail(user);

  if (user)
    return Format.success(
      null,
      "User Signup successful\n Verification mail sent"
    );
}

/**
 * Sends a verification email to the user.
 *
 * @param {User} user - The user to send the verification email to.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
const sendVerificationMail = async (user: User) => {
  const uuid = crypto.randomUUID();
  await tokenDao.deleteTokensByUserId(user.id, TokenType.VERIFICATION);
  const verificationToken: Token = await tokenDao.createToken(
    user.id,
    uuid,
    TokenType.VERIFICATION
  );
  sendEmail({
    recipients: [{ email: user.email }],
    params: {
      verification_url: `${env.BACKEND_URL}/api/main_service/v1/auth/verify/${verificationToken.token}`,
      name: user.name,
    },
    templateId: 1,
  });
};

/**
 * Verifies a user's email using a verification token.
 *
 * @param {string} token - The verification token.
 * @returns {Promise<any>} A promise that resolves to the result of the verification process.
 */
export async function verifyToken(token: string) {
  if (!token) return Format.badRequest(null, "Sorry Some error occurred");

  const verificationToken: any = await tokenDao.getTokenByTokenString(
    token,
    TokenType.VERIFICATION
  );

  if (!verificationToken) return Format.notFound("Invalid Verification Token");

  const user: User = await userDao.updateIsVerified(verificationToken.user.id);

  if (!user.isVerified) return Format.error(500, "Some error occurred");

  if (verificationToken)
    await tokenDao.deleteTokensByUserId(user.id, TokenType.VERIFICATION);

  return Format.success(null, "Email successfully verified");
}

/**
 * Sends a reset password email to the user.
 *
 * @param {string} email - The email of the user to send the reset password email to.
 * @returns {Promise<any>} A promise that resolves to the result of the email sending process.
 */
export const sendResetPasswordMail = async (email: string): Promise<any> => {
  if (!email) return Format.badRequest(null, "All fields are required!");

  const user: User | null = await userDao.findByEmail(email);

  if (!user) return Format.notFound("User not found");

  const uuid = crypto.randomUUID();
  await tokenDao.deleteTokensByUserId(user.id, TokenType.RESET_PASSWORD);
  const resetPasswordToken: Token = await tokenDao.createToken(
    user.id,
    uuid,
    TokenType.RESET_PASSWORD
  );

  // Note: Change the below mail to reset mail
  sendEmail({
    recipients: [{ email: user.email }],
    params: {
      verification_url: `${env.BACKEND_URL}/api/main_service/v1/auth/reset-password/${resetPasswordToken.token}`,
      name: user.name,
    },
    templateId: 1,
  });

  if (user) return Format.success(null, "Reset password mail sent");
};

/**
 * Resets the user's password using a reset token.
 *
 * @param {string} password - The new password.
 * @param {string} token - The reset password token.
 * @returns {Promise<any>} A promise that resolves to the result of the password reset process.
 */
export const resetPassword = async (
  password: string,
  token: string
): Promise<any> => {
  if (!token) return Format.badRequest(null, "Sorry Some error occurred");

  if (!password) return Format.badRequest(null, "All fields are required!");

  const resetPasswordToken: any = await tokenDao.getTokenByTokenString(
    token,
    TokenType.RESET_PASSWORD
  );

  if (!resetPasswordToken) return Format.notFound("Invalid Verification Token");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await userDao.resetPassword(hashedPassword, resetPasswordToken.user.id);
  await tokenDao.deleteTokensByUserId(
    resetPasswordToken.user.id,
    TokenType.RESET_PASSWORD
  );
  return Format.success("Password reset successfully");
};
