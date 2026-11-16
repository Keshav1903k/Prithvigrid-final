import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  id: number;
  title: string;
  cat: string;
  date: string;
  image: string;
  desc: string;
  content?: string;
  featured: boolean;
  author?: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    cat: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    author: { type: String, default: 'PrithviGrid Editorial Team' },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

