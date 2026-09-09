import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialLink extends Document {
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema<ISocialLink>({
  platform: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  username: { type: String },
  icon: { type: String },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

socialLinkSchema.index({ active: 1, displayOrder: 1 });

export const SocialLink = mongoose.model<ISocialLink>('SocialLink', socialLinkSchema);
