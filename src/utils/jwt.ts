import jwt from "jsonwebtoken";
import config from "../config";

export interface JWTPayload {
  sub: string;
  role: string;
}

export function generateToken(userId: string, role: string) {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_SECRET_EXPIRY,
    }
  );
}

export function verifyToken(token: string): JWTPayload {
  //
  const payload = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
  //
  return payload;
}
