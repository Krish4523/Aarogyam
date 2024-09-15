import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateAccessToken";
import { Role, Token, TokenType, User } from "@prisma/client";
import crypto from "crypto";
import * as tokenDao from "../dao/token.dao";
import { sendEmail } from "./mail.service";
import env from "../configs/env";
import * as patientDao from "../dao/patient.dao";
import { UserLoginDTO, UserSignUpDTO } from "../types/user.dto";

/**
 * Logs in a user by verifying their credentials.
 *
 * @param {UserLoginDTO} param0 - The login details including email, phone, and password.
 * @returns {Promise<any>} A promise that resolves to the result of the login process.
 */
export const loginUser = async ({
  email,
  phone,
  password,
}: UserLoginDTO): Promise<any> => {
  // Find user by email or phone
  const user: any = await userDao.findByEmailOrPhone(email, phone);

  // If user not found, return not found response
  if (!user) return Format.notFound("User not found");

  // Compare provided password with stored password
  const isMatch = await bcrypt.compare(password, user.password);

  // If user is not verified, send verification mail and return unauthorized response
  if (!user.isVerified) {
    await sendVerificationMail(user);
    return Format.unAuthorized(
      "Email not verified. Verification link sent to your email."
    );
  }

  // If password does not match, return unauthorized response
  if (!isMatch) return Format.unAuthorized("Invalid credentials");

  // Generate access token for the user
  const { accessToken } = generateTokens({ id: user.id, email: user.email });

  // If user exists, return success response with access token
  if (user) return Format.success(accessToken, "User login successful");
};

/**
 * Signs up a new user and sends a verification email.
 *
 * @param {UserSignUpDTO} param0 - The sign-up details including name, email, phone, and password.
 * @returns {Promise<any>} A promise that resolves to the result of the sign-up process.
 */
export async function signUp({
  name,
  email,
  phone,
  password,
}: UserSignUpDTO): Promise<any> {
  // Check if user already exists by email or phone
  const existingUser: any = await userDao.findByEmailOrPhone(email, phone);

  // If user already exists, return conflict response
  if (existingUser) return Format.conflict(null, "User already exists");

  // Hash the user's password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new user with the provided details
  const user: User = await userDao.create({
    name,
    email,
    phone,
    password: hashPassword,
    isVerified: false,
    role: Role.PATIENT,
  });

  // Create a patient record for the new user
  await patientDao.create({ userId: user.id });

  // Send verification email to the new user
  await sendVerificationMail(user);

  // If user is created, return success response with verification mail sent message
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
 */
const sendVerificationMail = async (user: User) => {
  // Generate a unique verification token
  const uuid = crypto.randomUUID();
  await tokenDao.deleteTokensByUserId(user.id, TokenType.VERIFICATION);
  const verificationToken: Token = await tokenDao.createToken(
    user.id,
    uuid,
    TokenType.VERIFICATION
  );
  // Send verification email with the generated token
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
  // If token is not provided, return bad request response
  if (!token) return Format.badRequest(null, "Sorry Some error occurred");

  // Get the verification token from the database
  const verificationToken: any = await tokenDao.getTokenByTokenString(
    token,
    TokenType.VERIFICATION
  );

  // If verification token is not found, return not found response
  if (!verificationToken) return Format.notFound("Invalid Verification Token");

  // Update user's verification status
  const user: User = await userDao.updateIsVerified(verificationToken.user.id);

  // If user is not verified, return error response
  if (!user.isVerified) return Format.error(500, "Some error occurred");

  // Delete the verification token after successful verification
  if (verificationToken)
    await tokenDao.deleteTokensByUserId(user.id, TokenType.VERIFICATION);

  // Return success response for email verification
  return Format.success(null, "Email successfully verified");
}

/**
 * Sends a reset password email to the user.
 *
 * @param {string} email - The email of the user to send the reset password email to.
 * @returns {Promise<any>} A promise that resolves to the result of the email sending process.
 */
export const sendResetPasswordMail = async (email: string): Promise<any> => {
  // If email is not provided, return bad request response
  if (!email) return Format.badRequest(null, "All fields are required!");

  // Find user by email
  const user: User | null = await userDao.findByEmail(email);

  // If user is not found, return not found response
  if (!user) return Format.notFound("User not found");

  // Generate a unique reset password token
  const uuid = crypto.randomUUID();
  await tokenDao.deleteTokensByUserId(user.id, TokenType.RESET_PASSWORD);
  const resetPasswordToken: Token = await tokenDao.createToken(
    user.id,
    uuid,
    TokenType.RESET_PASSWORD
  );

  // Send reset password email with the generated token
  sendEmail({
    recipients: [{ email: user.email }],
    params: {
      verification_url: `${env.BACKEND_URL}/api/main_service/v1/auth/reset-password/${resetPasswordToken.token}`,
      name: user.name,
    },
    templateId: 1,
  });

  // Return success response for reset password mail sent
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
  // If token is not provided, return bad request response
  if (!token) return Format.badRequest(null, "Sorry Some error occurred");

  // If password is not provided, return bad request response
  if (!password) return Format.badRequest(null, "All fields are required!");

  // Get the reset password token from the database
  const resetPasswordToken: any = await tokenDao.getTokenByTokenString(
    token,
    TokenType.RESET_PASSWORD
  );

  // If reset password token is not found, return not found response
  if (!resetPasswordToken) return Format.notFound("Invalid Verification Token");

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update user's password with the new hashed password
  await userDao.resetPassword(hashedPassword, resetPasswordToken.user.id);

  // Delete the reset password token after successful password reset
  await tokenDao.deleteTokensByUserId(
    resetPasswordToken.user.id,
    TokenType.RESET_PASSWORD
  );

  // Return success response for password reset
  return Format.success("Password reset successfully");
};
