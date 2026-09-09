import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  features: string[];
  technologies: string[];
  category: 'web' | 'mobile' | 'ai-ml' | 'backend' | 'open-source' | 'academic' | 'hackathon' | 'other';
  coverImage?: string;
  coverImagePublicId?: string;
  screenshots: Array<{ _id?: mongoose.Types.ObjectId; url: string; publicId: string; caption?: string; order: number }>;
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  documentationUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'archived';
  published: boolean;
  startDate?: Date;
  endDate?: Date;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  problem: { type: String },
  solution: { type: String },
  features: [{ type: String }],
  technologies: [{ type: String }],
  category: { type: String, enum: ['web','mobile','ai-ml','backend','open-source','academic','hackathon','other'], default: 'web' },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  screenshots: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String },
    order: { type: Number, default: 0 },
  }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  videoUrl: { type: String },
  documentationUrl: { type: String },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['completed','in-progress','archived'], default: 'completed' },
  published: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ category: 1, featured: 1 });
projectSchema.index({ published: 1, displayOrder: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
