import { SafeUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      /**
       * Optional user object appended in the middleware.
       *
       * @type {SafeUser | undefined}
       */
      user?: SafeUser; // User object is appended in the middleware
    }
  }
}
