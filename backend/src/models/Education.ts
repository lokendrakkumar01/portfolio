import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  grade?: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
  location?: string;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<IEducation>({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  grade: { type: String },
  description: { type: String },
  logo: { type: String },
  logoPublicId: { type: String },
  location: { type: String },
  displayOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

educationSchema.index({ displayOrder: 1, startDate: -1 });

export const Education = mongoose.model<IEducation>('Education', educationSchema);
