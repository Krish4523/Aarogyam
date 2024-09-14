import { Role } from "@prisma/client";

export const verifyRole = (roles: Role[]) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      return res.status(401).json("You don't have permission");
    }
  };
};
