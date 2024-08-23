import { PrismaClient, ResetPasswordToken } from "@prisma/client";

const resetPasswordTokenClient = new PrismaClient().resetPasswordToken;

export const create = async (
  userId: number,
  token: string
): Promise<ResetPasswordToken> => {
  return resetPasswordTokenClient.create({
    data: {
      userId,
      token,
    },
  });
};

export const deleteByUserId = async (userId: number) => {
  return resetPasswordTokenClient.deleteMany({
    where: {
      userId: {
        equals: userId,
      },
    },
  });
};

export const getByToken = async (
  token: string
): Promise<ResetPasswordToken | null> => {
  return resetPasswordTokenClient.findFirst({
    where: {
      token: {
        equals: token,
      },
    },
    include: {
      user: true,
    },
  });
};
