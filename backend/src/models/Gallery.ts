import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
  category: 'events' | 'hackathons' | 'college' | 'projects' | 'achievements' | 'certificates' | 'personal' | 'other';
  date?: Date;
  location?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  category: { type: String, enum: ['events','hackathons','college','projects','achievements','certificates','personal','other'], default: 'other' },
  date: { type: Date },
  location: { type: String },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

gallerySchema.index({ category: 1, featured: 1 });
gallerySchema.index({ published: 1, displayOrder: 1 });

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
