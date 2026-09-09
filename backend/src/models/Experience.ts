import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'volunteer' | 'leadership';
  location?: string;
  remote: boolean;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  responsibilities: string[];
  technologies: string[];
  companyLogo?: string;
  companyLogoPublicId?: string;
  companyUrl?: string;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  employmentType: { type: String, enum: ['full-time','part-time','internship','freelance','volunteer','leadership'], default: 'full-time' },
  location: { type: String },
  remote: { type: Boolean, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  responsibilities: [{ type: String }],
  technologies: [{ type: String }],
  companyLogo: { type: String },
  companyLogoPublicId: { type: String },
  companyUrl: { type: String },
  displayOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

experienceSchema.index({ displayOrder: 1, startDate: -1 });

export const Experience = mongoose.model<IExperience>('Experience', experienceSchema);
