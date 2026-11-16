import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  from_name: string;
  from_email: string;
  project_type: string;
  message: string;
  phone?: string;
  location?: string;
  budget?: string;
  status: 'new' | 'contacted' | 'in_review' | 'quoted' | 'closed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    from_name: { type: String, required: true, trim: true },
    from_email: { type: String, required: true, trim: true, lowercase: true },
    project_type: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    budget: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_review', 'quoted', 'closed'],
      default: 'new',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);

