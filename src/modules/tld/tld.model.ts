import { model, Schema, Types } from "mongoose";

export interface ITLD {
  tld: string;
  source: Types.ObjectId;
}

const TLDSchema = new Schema<ITLD>(
  {
    tld: {
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
  },
  {
    timestamps: true,
  }
);

const TLD = model<ITLD>("TLD", TLDSchema);

export default TLD;
