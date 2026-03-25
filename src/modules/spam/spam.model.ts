import { model, Schema, Types } from "mongoose";

export interface ISpam {
  domain: string;
  source: Types.ObjectId;
  normalized: string;
}

const spamSchema = new Schema<ISpam>(
  {
    domain: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    normalized: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Spam = model<ISpam>("Spam", spamSchema);

export default Spam;
