import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: number;
  quote: string;
  name: string;
  location: string;
  image: string;
  projectNumber: number;
  totalProjects: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: Number, required: true, unique: true },
    quote: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    projectNumber: { type: Number, default: 1 },
    totalProjects: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

