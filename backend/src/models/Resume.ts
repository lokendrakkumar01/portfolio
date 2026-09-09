import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  fileUrl: string;
  filePublicId: string;
  fileName: string;
  fileSize: number;
  version: number;
  isCurrent: boolean;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  version: { type: Number, default: 1 },
  isCurrent: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

resumeSchema.index({ isCurrent: 1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
