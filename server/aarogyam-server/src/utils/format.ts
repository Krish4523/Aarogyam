const Format = {
  /**
   * Generates an error response object.
   *
   * @param {number} code - The HTTP status code.
   * @param {string} [message] - The error message.
   * @param {any} [data] - Additional data to include in the response.
   * @returns {Object} The error response object.
   */
  error: (code: number, message?: string, data?: any): object => ({
    code,
    message: message || "Something went wrong",
    data: data || null,
  }),

  /**
   * Generates a success response object.
   *
   * @param {any} data - The data to include in the response.
   * @param {string} [message] - The success message.
   * @returns {Object} The success response object.
   */
  success: (data: any, message?: string): object => ({
    code: 200,
    message: message || "OK",
    data: data || null,
  }),

  /**
   * Generates a no content response object.
   *
   * @param {string} [message] - The message to include in the response.
   * @returns {Object} The no content response object.
   */
  noContent: (message?: string): object => ({
    code: 204,
    message: message || "No Content Found",
    data: null,
  }),

  /**
   * Generates a bad request response object.
   *
   * @param {any} [data] - The data to include in the response.
   * @param {string} [message] - The error message.
   * @returns {Object} The bad request response object.
   */
  badRequest: (data?: any, message?: string): object => ({
    code: 400,
    message: message || "Bad Request",
    data: data || null,
  }),

  /**
   * Generates an unauthorized response object.
   *
   * @param {string} [message] - The error message.
   * @returns {Object} The unauthorized response object.
   */
  unAuthorized: (message?: string): object => ({
    code: 401,
    message: message || "Unauthorized",
    data: null,
  }),

  /**
   * Generates a not found response object.
   *
   * @param {string} [message] - The error message.
   * @returns {Object} The not found response object.
   */
  notFound: (message?: string): object => ({
    code: 404,
    message: message || "Not found",
    data: null,
  }),

  /**
   * Generates a conflict response object.
   *
   * @param {any} [data] - The data to include in the response.
   * @param {string} [message] - The error message.
   * @returns {Object} The conflict response object.
   */
  conflict: (data?: any, message?: string): object => ({
    code: 409,
    message: message || "Conflict",
    data: data || null,
  }),

  /**
   * Generates an internal server error response object.
   *
   * @param {any} error - The error object.
   * @param {string} [message] - The error message.
   * @returns {Object} The internal server error response object.
   */
  internalError: (error: any, message?: string): object => ({
    code: 500,
    message: message || "Internal Server Error",
    error: `${error}`, // Explicitly cast error to string
    data: null,
  }),
};

export default Format;
