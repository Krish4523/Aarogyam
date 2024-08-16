/**
 * An object representing various HTTP status codes.
 *
 * @constant
 * @type {Object}
 * @property {number} ACCEPTED - The request has been accepted for processing, but the processing has not been completed.
 * @property {number} BAD_GATEWAY - The server was acting as a gateway or proxy and received an invalid response from the upstream server.
 * @property {number} BAD_REQUEST - The server could not understand the request due to invalid syntax.
 * @property {number} CONFLICT - The request could not be completed due to a conflict with the current state of the target resource.
 * @property {number} CREATED - The request has been fulfilled and has resulted in one or more new resources being created.
 * @property {number} FORBIDDEN - The server understood the request but refuses to authorize it.
 * @property {number} GATEWAY_TIMEOUT - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
 * @property {number} INTERNAL_SERVER_ERROR - The server encountered an unexpected condition that prevented it from fulfilling the request.
 * @property {number} NOT_FOUND - The server can't find the requested resource.
 * @property {number} NOT_IMPLEMENTED - The server does not support the functionality required to fulfill the request.
 * @property {number} OK - The request has succeeded.
 * @property {number} PAYMENT_REQUIRED - Reserved for future use.
 * @property {number} PRECONDITION_FAILED - The server does not meet one of the preconditions that the requester put on the request.
 * @property {number} PROXY_AUTHENTICATION_REQUIRED - The client must first authenticate itself with the proxy.
 * @property {number} REQUEST_TOO_LONG - The server is refusing to process a request because the request payload is too large.
 * @property {number} REQUEST_URI_TOO_LONG - The server is refusing to service the request because the request-target is longer than the server is willing to interpret.
 * @property {number} SERVICE_UNAVAILABLE - The server is not ready to handle the request.
 * @property {number} TOO_MANY_REQUESTS - The user has sent too many requests in a given amount of time ("rate limiting").
 * @property {number} UNAUTHORIZED - The request has not been applied because it lacks valid authentication credentials for the target resource.
 * @property {number} UNPROCESSABLE_ENTITY - The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
 */
const httpStatus = {
  ACCEPTED: 202,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CREATED: 201,
  FORBIDDEN: 403,
  GATEWAY_TIMEOUT: 504,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  NOT_IMPLEMENTED: 501,
  OK: 200,
  PAYMENT_REQUIRED: 402,
  PRECONDITION_FAILED: 412,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TOO_LONG: 413,
  REQUEST_URI_TOO_LONG: 414,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
};

export default httpStatus;
