import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  id: number;
  title: string;
  desc: string;
  image: string;
  features?: string[];
  order?: number;
}

const ServiceSchema = new Schema<IService>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);

