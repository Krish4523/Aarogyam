import { PrismaClient, VerificationToken } from "@prisma/client";

const verificationTokenClient = new PrismaClient().verificationToken;

/**
 * Creates a new verification token for a user.
 *
 * @param userId - The ID of the user.
 * @param token - The verification token.
 * @returns A promise that resolves to the created verification token.
 */
export const create = async (
  userId: number,
  token: string
): Promise<VerificationToken> => {
  return verificationTokenClient.create({
    data: {
      userId,
      token,
    },
  });
};

/**
 * Deletes verification tokens by user ID.
 *
 * @param userId - The ID of the user whose tokens are to be deleted.
 * @returns A promise that resolves to the result of the delete operation.
 */
export const deleteByUserId = async (userId: number) => {
  return verificationTokenClient.deleteMany({
    where: {
      userId: {
        equals: userId,
      },
    },
  });
};

/**
 * Retrieves a verification token by its token string.
 *
 * @param token - The verification token string.
 * @returns A promise that resolves to the found verification token, including the associated user.
 */
export const getByToken = async (
  token: string
): Promise<VerificationToken | null> => {
  return verificationTokenClient.findFirst({
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
