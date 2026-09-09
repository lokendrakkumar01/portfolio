import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  certificateImage?: string;
  certificateImagePublicId?: string;
  certificatePdf?: string;
  certificatePdfPublicId?: string;
  description?: string;
  skills: string[];
  category: 'programming' | 'web-development' | 'cloud' | 'database' | 'ai-ml' | 'cybersecurity' | 'other';
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
  verificationUrl: { type: String },
  certificateImage: { type: String },
  certificateImagePublicId: { type: String },
  certificatePdf: { type: String },
  certificatePdfPublicId: { type: String },
  description: { type: String },
  skills: [{ type: String }],
  category: { type: String, enum: ['programming','web-development','cloud','database','ai-ml','cybersecurity','other'], default: 'other' },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

certificateSchema.index({ category: 1, featured: 1 });
certificateSchema.index({ published: 1, issueDate: -1 });

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
