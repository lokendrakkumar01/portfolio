import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  originalName: string;
  storageName: string;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  category: 'image' | 'pdf' | 'other';
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  category: { type: String, enum: ['image','pdf','other'], default: 'other' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const File = mongoose.model<IFile>('File', fileSchema);
