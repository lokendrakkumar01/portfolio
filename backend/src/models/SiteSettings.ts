import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  favicon?: string;
  logo?: string;
  primaryEmail: string;
  contactEnabled: boolean;
  maintenanceMode: boolean;
  socialPreviewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>({
  siteName: { type: String, required: true, default: 'My Portfolio' },
  siteTitle: { type: String, required: true, default: 'My Portfolio - Developer' },
  siteDescription: { type: String, default: '' },
  favicon: { type: String },
  logo: { type: String },
  primaryEmail: { type: String, required: true, default: 'admin@portfolio.dev' },
  contactEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  socialPreviewImage: { type: String },
}, { timestamps: true });

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
