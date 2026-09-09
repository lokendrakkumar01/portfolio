import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'programming' | 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  icon?: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['programming','frontend','backend','database','devops','tools','other'], required: true },
  icon: { type: String },
  proficiency: { type: Number, enum: [1,2,3,4,5], default: 3 },
  displayOrder: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true });

skillSchema.index({ category: 1, displayOrder: 1 });
skillSchema.index({ featured: 1 });

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);
