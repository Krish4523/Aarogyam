import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";

/**
 * Changes the user's password.
 *
 * @param {string} oldPassword - The user's current password.
 * @param {string} password - The new password to be set.
 * @param {number} userId - The ID of the user whose password is to be changed.
 * @returns {Promise<any>} A promise that resolves to the result of the password change operation.
 */
export const changePassword = async (
  oldPassword: string,
  password: string,
  userId: number
): Promise<any> => {
  // Find user by ID
  const user = await userDao.findByID(userId);
  // If user not found, return not found response
  if (!user) {
    return Format.notFound("User not found");
  }
  // If password or oldPassword is not provided, return bad request response
  if (!password || !oldPassword)
    return Format.badRequest(null, "All fields are required!");

  // Compare provided old password with stored password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  // If old password does not match, return unauthorized response
  if (!isMatch) {
    return Format.unAuthorized("Old password is incorrect");
  }

  // Generate salt and hash the new password
  const salt = await bcrypt.genSalt(10);
  const newHashPassword = await bcrypt.hash(password, salt);
  // Update user's password with the new hashed password
  await userDao.updatePassword(userId, newHashPassword);
  // Return success response for password change
  return Format.success("Password changed successfully");
};
