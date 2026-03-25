import { z } from "zod";
import mongoose from "mongoose";

export const addSpamSchema = z.object({
  //
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(255)
    .regex(/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/, "Invalid domain format"),
  //
});

export const deleteSpamSchema = z.object({
  //
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invaild Spam Id",
  }),
  //
});

export const checkSpamSchema = z.object({
  //
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(255)
    .regex(/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/, "Invalid domain format"),
  //
});
