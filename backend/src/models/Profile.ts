import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  username: string;
  title: string;
  tagline: string;
  shortBio: string;
  longBio: string;
  profileImage?: string;
  profileImagePublicId?: string;
  location: string;
  email: string;
  phone?: string;
  resumeId?: mongoose.Types.ObjectId;
  availability: 'available' | 'busy' | 'not-looking';
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true, default: '' },
  shortBio: { type: String, default: '' },
  longBio: { type: String, default: '' },
  profileImage: { type: String },
  profileImagePublicId: { type: String },
  location: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  availability: { type: String, enum: ['available', 'busy', 'not-looking'], default: 'available' },
}, { timestamps: true });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
