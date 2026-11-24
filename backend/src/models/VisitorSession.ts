import mongoose, { Schema } from 'mongoose';

export type VisitorDeviceCategory = 'Mobile' | 'Tablet' | 'Desktop';

export interface IVisitorPageView {
  path: string;
  referrer?: string;
  visitedAt: Date;
}

export interface IVisitorSession {
  visitorId: string;
  sessionId: string;
  brand: string;
  model: string;
  modelIdentifier?: string;
  category: VisitorDeviceCategory;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  platform: string;
  approximateLocation: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  language: string;
  pageViews: IVisitorPageView[];
  pageViewCount: number;
  firstVisitedAt: Date;
  lastVisitedAt: Date;
  expiresAt: Date;
}

const pageViewSchema = new Schema<IVisitorPageView>({
  path: { type: String, required: true, maxlength: 512 },
  referrer: { type: String, maxlength: 512 },
  visitedAt: { type: Date, required: true },
}, { _id: false });

const visitorSessionSchema = new Schema<IVisitorSession>({
  visitorId: { type: String, required: true, maxlength: 64 },
  sessionId: { type: String, required: true, maxlength: 64 },
  brand: { type: String, required: true, maxlength: 80 },
  model: { type: String, required: true, maxlength: 120 },
  modelIdentifier: { type: String, maxlength: 120 },
  category: { type: String, enum: ['Mobile', 'Tablet', 'Desktop'], required: true },
  os: { type: String, required: true, maxlength: 80 },
  osVersion: { type: String, default: '', maxlength: 80 },
  browser: { type: String, required: true, maxlength: 80 },
  browserVersion: { type: String, default: '', maxlength: 80 },
  platform: { type: String, required: true, maxlength: 80 },
  approximateLocation: { type: String, default: 'Unavailable', maxlength: 2 },
  screenWidth: { type: Number, min: 0, max: 20000 },
  screenHeight: { type: Number, min: 0, max: 20000 },
  viewportWidth: { type: Number, min: 0, max: 20000 },
  viewportHeight: { type: Number, min: 0, max: 20000 },
  language: { type: String, required: true, maxlength: 32 },
  pageViews: { type: [pageViewSchema], default: [] },
  pageViewCount: { type: Number, default: 0, min: 0 },
  firstVisitedAt: { type: Date, required: true },
  lastVisitedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true, versionKey: false });

visitorSessionSchema.index({ sessionId: 1 }, { unique: true });
visitorSessionSchema.index({ lastVisitedAt: -1 });
visitorSessionSchema.index({ brand: 1, category: 1, os: 1, browser: 1 });
visitorSessionSchema.index({ category: 1 });
visitorSessionSchema.index({ os: 1 });
visitorSessionSchema.index({ browser: 1 });
visitorSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VisitorSession = mongoose.model<IVisitorSession>('VisitorSession', visitorSessionSchema);
