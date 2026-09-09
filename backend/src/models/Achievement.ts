import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  organization: string;
  event?: string;
  date: Date;
  category: 'hackathon' | 'competition' | 'award' | 'leadership' | 'academic' | 'technical' | 'event' | 'other';
  description?: string;
  rank?: string;
  position?: string;
  image?: string;
  imagePublicId?: string;
  certificate?: string;
  certificatePublicId?: string;
  verificationUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  event: { type: String },
  date: { type: Date, required: true },
  category: { type: String, enum: ['hackathon','competition','award','leadership','academic','technical','event','other'], default: 'other' },
  description: { type: String },
  rank: { type: String },
  position: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  certificate: { type: String },
  certificatePublicId: { type: String },
  verificationUrl: { type: String },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

achievementSchema.index({ date: -1, featured: 1 });
achievementSchema.index({ published: 1, displayOrder: 1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
