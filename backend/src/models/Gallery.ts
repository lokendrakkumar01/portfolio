import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
  mediaType: 'image' | 'video';
  category: 'events' | 'hackathons' | 'college' | 'projects' | 'achievements' | 'certificates' | 'personal' | 'other';
  date?: Date;
  location?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    category: {
      type: String,
      enum: ['events', 'hackathons', 'college', 'projects', 'achievements', 'certificates', 'personal', 'other'],
      default: 'events',
    },
    date: { type: Date },
    location: { type: String },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, featured: 1, published: 1 });
gallerySchema.index({ published: 1, displayOrder: 1 });

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
