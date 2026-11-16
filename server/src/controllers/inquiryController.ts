import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from_name, from_email, project_type, message, phone, location, budget } = req.body;

    if (!from_name || !from_email || !project_type || !message) {
      res.status(400).json({
        success: false,
        message: 'Please fill in name, email, project type, and message.',
      });
      return;
    }

    if (isMongoDBConnected()) {
      const inquiry = await Inquiry.create({
        from_name,
        from_email,
        project_type,
        message,
        phone: phone || '',
        location: location || '',
        budget: budget || '',
        status: 'new',
      });

      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! A PrithviGrid engineering advisor will reach out shortly.',
        data: inquiry,
      });
    } else {
      const store = getStore();
      const newInquiry = {
        _id: 'inq_' + Date.now(),
        from_name,
        from_email,
        project_type,
        message,
        phone: phone || '',
        location: location || '',
        budget: budget || '',
        status: 'new',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      store.inquiries.unshift(newInquiry);
      await persistStore();

      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! A PrithviGrid engineering advisor will reach out shortly.',
        data: newInquiry,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    if (isMongoDBConnected()) {
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { from_name: { $regex: search, $options: 'i' } },
          { from_email: { $regex: search, $options: 'i' } },
          { project_type: { $regex: search, $options: 'i' } },
        ];
      }

      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      res.json({ success: true, count: inquiries.length, data: inquiries });
    } else {
      const store = getStore();
      let inquiries = [...store.inquiries];

      if (status && status !== 'all') {
        inquiries = inquiries.filter((i: any) => i.status === status);
      }
      if (search) {
        const s = (search as string).toLowerCase();
        inquiries = inquiries.filter(
          (i: any) =>
            i.from_name.toLowerCase().includes(s) ||
            i.from_email.toLowerCase().includes(s) ||
            i.project_type.toLowerCase().includes(s)
        );
      }

      inquiries.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json({ success: true, count: inquiries.length, data: inquiries });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const inquiry = await Inquiry.findById(id);
      if (!inquiry) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }
      res.json({ success: true, data: inquiry });
    } else {
      const store = getStore();
      const inquiry = store.inquiries.find((i: any) => i._id === id || i.id === id);
      if (!inquiry) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }
      res.json({ success: true, data: inquiry });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (isMongoDBConnected()) {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      const inquiry = await Inquiry.findByIdAndUpdate(id, updateData, { new: true });
      if (!inquiry) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }

      res.json({ success: true, data: inquiry });
    } else {
      const store = getStore();
      const idx = store.inquiries.findIndex((i: any) => i._id === id || i.id === id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }

      if (status) store.inquiries[idx].status = status;
      if (notes !== undefined) store.inquiries[idx].notes = notes;
      store.inquiries[idx].updatedAt = new Date().toISOString();

      await persistStore();
      res.json({ success: true, data: store.inquiries[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const inquiry = await Inquiry.findByIdAndDelete(id);
      if (!inquiry) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }
      res.json({ success: true, message: 'Inquiry deleted' });
    } else {
      const store = getStore();
      const initialLen = store.inquiries.length;
      store.inquiries = store.inquiries.filter((i: any) => i._id !== id && i.id !== id);

      if (store.inquiries.length === initialLen) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }

      await persistStore();
      res.json({ success: true, message: 'Inquiry deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

