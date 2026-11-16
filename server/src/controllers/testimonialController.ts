import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected()) {
      const testimonials = await Testimonial.find().sort({ id: 1 });
      res.json({ success: true, count: testimonials.length, data: testimonials });
    } else {
      const store = getStore();
      const testimonials = [...store.testimonials].sort((a: any, b: any) => a.id - b.id);
      res.json({ success: true, count: testimonials.length, data: testimonials });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    if (isMongoDBConnected()) {
      if (!data.id) {
        const maxDoc = await Testimonial.findOne().sort({ id: -1 });
        data.id = (maxDoc?.id || 0) + 1;
      }
      const testimonial = await Testimonial.create(data);
      res.status(201).json({ success: true, data: testimonial });
    } else {
      const store = getStore();
      if (!data.id) {
        const maxId = store.testimonials.reduce((max: number, t: any) => Math.max(max, t.id || 0), 0);
        data.id = maxId + 1;
      }

      const newT = {
        _id: 't_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      store.testimonials.push(newT);
      await persistStore();
      res.status(201).json({ success: true, data: newT });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

