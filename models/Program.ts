import { Schema, model, models, type Document, type Model } from "mongoose";
import { DEGREE_TYPES, type DegreeType } from "@/types";

export interface ProgramDocument extends Document {
  name: string;
  provider: string;
  degreeType: DegreeType;
  specialization: string;
  durationMonths: number;
  feeMin: number;
  feeMax: number;
  description: string;
  eligibility: string;
  mode: "online" | "hybrid";
  tags: string[];
}

const ProgramSchema = new Schema<ProgramDocument>(
  {
    name: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    degreeType: {
      type: String,
      required: true,
      enum: DEGREE_TYPES,
    },
    specialization: { type: String, required: true, trim: true },
    durationMonths: { type: Number, required: true, min: 1 },
    feeMin: { type: Number, required: true, min: 0 },
    feeMax: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    eligibility: { type: String, required: true, trim: true },
    mode: { type: String, required: true, enum: ["online", "hybrid"] },
    tags: { type: [String], required: true, default: [] },
  },
  {
    timestamps: true,
    // Lean queries return plain objects; keep _id as string in API responses
    toJSON: {
      transform(
        _doc: unknown,
        ret: Record<string, unknown>
      ): Record<string, unknown> {
        ret._id = String(ret._id);
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent model recompilation during Next.js hot reload
export const ProgramModel: Model<ProgramDocument> =
  models.Program ?? model<ProgramDocument>("Program", ProgramSchema);
