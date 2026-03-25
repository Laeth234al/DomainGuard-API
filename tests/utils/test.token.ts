import mongoose from "mongoose";
import { generateToken } from "../../src/utils/jwt";

export function generateTestToken(role: string = "user") {
  return generateToken(new mongoose.Types.ObjectId().toString(), role);
}
