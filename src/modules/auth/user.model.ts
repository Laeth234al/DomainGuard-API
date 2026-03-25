import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    //
    return;
  }
  //
  const salt = await bcrypt.genSalt(10);
  //
  this.password = await bcrypt.hash(this.password, salt);
  //
});

userSchema.methods.comparePassword = async function (password: string) {
  //
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
