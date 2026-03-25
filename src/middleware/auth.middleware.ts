import { Response, NextFunction } from "express";
import { extractToken } from "../utils/extract-token";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/request";
import { logger } from "../lib/winston";

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    //
    const token = extractToken(req.headers.authorization);
    //
    if (!token) {
      //
      return res.status(401).json({
        message: "Please login first",
      });
    }
    //
    const decoded = verifyToken(token);
    //
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };
    //
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export function requireRole(role: string[]) {
  //
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    //
    if (!req.user?.role || !role.includes(req.user?.role)) {
      //
      const userId = req.user?.id || "";
      //
      logger.warn("This user trying to reach to forbidden content", { userId });
      //
      return res.status(403).json({
        //
        message: "Forbidden",
      });
    }
    //
    next();
  };
}
