import * as userDao from "../dao/user.dao";
import Format from "../utils/format";
import bcrypt from "bcrypt";

export const changePassword = async (
  oldPassword: string,
  password: string,
  passwordConfirmation: string,
  userId: number
): Promise<any> => {
  const user = await userDao.findByID(userId);
  if (!user) {
    return Format.notFound("User not found");
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return Format.notFound("Old password is incorrect");
  }
  if (password === passwordConfirmation) {
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);
    await userDao.updatePassword(userId, newHashPassword);
    return Format.success("Password changed successfully");
  } else {
    return Format.badRequest(null, "Passwords do not match");
  }
};

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
    profileImage = existingUser.profile_image;
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
