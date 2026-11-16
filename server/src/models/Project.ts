import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: number;
  title: string;
  titleItalic: string;
  category: string;
  heroImage: string;
  gallery1: string;
  gallery2: string;
  location: string;
  year: string;
  materials: string;
  overviewTitle: string;
  overviewP1: string;
  overviewP2: string;
  span?: string;
  nextId?: number;
  nextTitle?: string;
  nextTitleItalic?: string;
  featured?: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    titleItalic: { type: String, default: '' },
    category: { type: String, required: true },
    heroImage: { type: String, required: true },
    gallery1: { type: String, required: true },
    gallery2: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: String, required: true },
    materials: { type: String, required: true },
    overviewTitle: { type: String, required: true },
    overviewP1: { type: String, required: true },
    overviewP2: { type: String, required: true },
    span: { type: String, default: 'col-span-1' },
    nextId: { type: Number },
    nextTitle: { type: String },
    nextTitleItalic: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

