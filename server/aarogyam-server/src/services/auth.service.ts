import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateAccessToken";
import { ResetPasswordToken, User, VerificationToken } from "@prisma/client";
import { UserSignUp } from "../types/user";
import crypto from "crypto";
import * as verificationTokenDao from "../dao/verificationToken.dao";
import { sendEmail } from "./mail.service";
import env from "../configs/env";
import * as resetPasswordTokenDao from "../dao/resetPasswordToken.dao";

/**
 * Logs in a user by verifying their email/phone and password.
 * If the user is not verified, a verification email is sent.
 * If the credentials are valid, an access token is returned.
 *
 * @param email - The email of the user to log in.
 * @param phone - The phone number of the user to log in.
 * @param password - The password of the user to log in.
 * @returns The access token if the login is successful, or an error message if not.
 */
export const loginUser = async (
  email: string | null,
  phone: string | null,
  password: string
): Promise<any> => {
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
 * @param userSignUp - The user data to sign up.
 * @returns A promise that resolves to the result of the sign-up process.
 */
export async function signUp(userSignUp: UserSignUp): Promise<any> {
  const { email, phone, password } = userSignUp;

  const existingUser: any = await userDao.findByEmailOrPhone(email, phone);

  if (existingUser) return Format.conflict(null, "User already exists");

  userSignUp.password = await bcrypt.hash(password, 10);

  const user: User = await userDao.create(userSignUp);

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
 * @param user - The user to send the verification email to.
 * @returns A promise that resolves when the email is sent.
 */
const sendVerificationMail = async (user: User) => {
  const uuid = crypto.randomUUID();
  await verificationTokenDao.deleteByUserId(user.id);
  const verificationToken: VerificationToken =
    await verificationTokenDao.create(user.id, uuid);
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
 * @param token - The verification token.
 * @returns A promise that resolves to the result of the verification process.
 */
export async function verifyToken(token: string) {
  const verificationToken: any = await verificationTokenDao.getByToken(token);

  if (!verificationToken) return Format.notFound("Invalid Verification Token");

  const user: User = await userDao.updateIsVerified(verificationToken.user.id);

  if (!user.isVerified) return Format.error(500, "Some error occurred");

  if (verificationToken) await verificationTokenDao.deleteByUserId(user.id);

  return Format.success(null, "Email successfully verified");
}

export const sendResetMail = async (email: string): Promise<any> => {
  const user = await userDao.findByEmail(email);
  if (!user) {
    return Format.notFound("User not found");
  }
  await sendRestPasswordMail(user);

  if (user) return Format.success(null, "Reset password mail sent");
};

const sendRestPasswordMail = async (user: User) => {
  const uuid = crypto.randomUUID();
  await resetPasswordTokenDao.deleteByUserId(user.id);
  const resetPasswordToken: ResetPasswordToken =
    await resetPasswordTokenDao.create(user.id, uuid);

  sendEmail({
    recipients: [{ email: user.email }],
    params: {
      verification_url: `${env.BACKEND_URL}/api/main_service/v1/auth/reset-password/${resetPasswordToken.token}`,
      name: user.name,
    },
    templateId: 1, // change template id for reset password
  });
};

export const resetPassword = async (
  password: string,
  passwordConfirmation: string,
  token: string
): Promise<any> => {
  const resetPasswordToken: any = await resetPasswordTokenDao.getByToken(token);

  if (!resetPasswordToken) return Format.notFound("Invalid Verification Token");

  if (password === passwordConfirmation) {
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);
    await userDao.resetPassword(newHashPassword, resetPasswordToken.user.id);
    return Format.success("Password reset successfully");
  } else {
    return Format.badRequest(null, "Passwords do not match");
  }
};
