import { SafeUser } from "./user.dto";

declare global {
  namespace Express {
    interface Request {
      /**
       * Optional user object appended in the middleware.
       *
       * @type {SafeUser | undefined}
       */
      user?: SafeUser;
    }
  }
}
