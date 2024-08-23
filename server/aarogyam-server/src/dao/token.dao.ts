import { PrismaClient, Token, TokenType } from "@prisma/client";

const tokenClient = new PrismaClient().token;

/**
 * Creates a new token (either verification or reset password) for a user.
 *
 * @param userId - The ID of the user.
 * @param token - The token string.
 * @param type - The type of the token (VERIFICATION or RESET_PASSWORD).
 * @returns A promise that resolves to the created token.
 */
export const createToken = async (
  userId: number,
  token: string,
  type: TokenType
): Promise<Token> => {
  return tokenClient.create({
    data: {
      userId,
      token,
      type,
    },
  });
};

/**
 * Deletes tokens by user ID and token type.
 *
 * @param userId - The ID of the user whose tokens are to be deleted.
 * @param type - The type of the token (VERIFICATION or RESET_PASSWORD).
 * @returns A promise that resolves to the result of the delete operation.
 */
export const deleteTokensByUserId = async (userId: number, type: TokenType) => {
  return tokenClient.deleteMany({
    where: {
      userId,
      type,
    },
  });
};

/**
 * Retrieves a token by its token string and type.
 *
 * @param token - The token string.
 * @param type - The type of the token (VERIFICATION or RESET_PASSWORD).
 * @returns A promise that resolves to the found token, including the associated user.
 */
export const getTokenByTokenString = async (
  token: string,
  type: TokenType
): Promise<Token | null> => {
  return tokenClient.findFirst({
    where: {
      token,
      type,
    },
    include: {
      user: true,
    },
  });
};
