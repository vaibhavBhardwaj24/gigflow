import mongoose, { Document, Schema } from "mongoose";

export interface IBid extends Document {
  gigId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  message: string;
  proposedPrice: number;
  status: "pending" | "hired" | "rejected";
  createdAt: Date;
}

const bidSchema = new Schema<IBid>({
  gigId: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  proposedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model<IBid>("Bid", bidSchema);
