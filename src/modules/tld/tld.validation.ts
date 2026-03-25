import { z } from "zod";
import mongoose from "mongoose";

export const addTLDSchema = z.object({
  //
  tld: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "TLD too short")
    .max(24, "TLD too long")
    .regex(/^[a-z]+$/, "TLD must contain only letters"),
  //
});

export const deleteTLDSchema = z.object({
  //
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invaild Spam Id",
  }),
  //
});

export const checkTLDSchema = z.object({
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
