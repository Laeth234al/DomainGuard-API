import User from "./user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { logger } from "../../lib/winston";

export default class AuthService {
  async register(email: string, password: string) {
    //
    const exists = await User.findOne({ email });
    //
    if (exists) {
      //
      throw new Error("User Exists");
    }
    //
    const user = await User.create({
      email,
      password,
    });
    //
    const token = generateToken(user._id.toString(), user.role);
    //
    logger.info("User registered", { email });
    //
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string) {
    //
    const user = await User.findOne({ email }).select("+password");
    //
    if (!user) {
      logger.warn("Failed login attempt", { email });
      throw new Error("Invalid credentials");
    }
    //
    const match = await bcrypt.compare(password, user.password);
    //
    if (!match) {
      logger.warn("Failed login attempt", { email });
      throw new Error("Invalid credentials");
    }
    //
    const token = generateToken(user._id.toString(), user.role);
    //
    //
    logger.info("User logged in", { userId: user._id.toString() });
    //
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async me(id: string) {
    //
    const user = await User.findById(id);
    //
    if (!user) {
      throw new Error("User Not Found");
    }
    //
    return {
      id,
      email: user.email,
      role: user.role,
    };
  }
}
