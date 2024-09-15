import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";

/**
 * Changes the user's password.
 *
 * @param oldPassword - The user's current password.
 * @param password - The new password to be set.
 * @param userId - The ID of the user whose password is to be changed.
 * @returns A promise that resolves to the result of the password change operation.
 */
export const changePassword = async (
  oldPassword: string,
  password: string,
  userId: number
): Promise<any> => {
  const user = await userDao.findByID(userId);
  if (!user) {
    return Format.notFound("User not found");
  }
  if (!password || !oldPassword)
    return Format.badRequest(null, "All fields are required!");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return Format.unAuthorized("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const newHashPassword = await bcrypt.hash(password, salt);
  await userDao.updatePassword(userId, newHashPassword);
  return Format.success("Password changed successfully");
};

/**
 * Updates the user's information.
 *
 * @param name - The new name of the user.
 * @param phoneNumber - The new phone number of the user.
 * @param address - The new address of the user.
 * @param profileImage - The new profile image of the user.
 * @param userId - The ID of the user whose information is to be updated.
 * @returns A promise that resolves to the result of the update operation.
 */
export const updateUser = async (
  name: string,
  phoneNumber: string,
  address: string,
  profileImage: string | null,
  userId: number
): Promise<any> => {
  const existingUser = await userDao.findByID(userId);
  if (!existingUser) {
    return Format.notFound("User not found");
  }
  if (!profileImage) {
    profileImage = existingUser.profileImage;
  }
  await userDao.updateUser(
    name || existingUser.name,
    phoneNumber || existingUser.phone,
    address || existingUser.address,
    profileImage,
    userId
  );
  return Format.success("User update successfully");
};
