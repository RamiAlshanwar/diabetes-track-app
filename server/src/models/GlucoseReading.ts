import mongoose, { Schema, Document } from "mongoose";

export interface IGlucoseReading extends Document {
  value: number;
  readingTime: Date;
  note?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const glucoseReadingSchema = new Schema<IGlucoseReading>(
  {
    value: {
      type: Number,
      required: true,
    },
    readingTime: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GlucoseReading = mongoose.model<IGlucoseReading>(
  "GlucoseReading",
  glucoseReadingSchema
);

export default GlucoseReading;