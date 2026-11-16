import { Request, Response } from 'express';
import { Service } from '../models/Service.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected()) {
      const services = await Service.find().sort({ order: 1, id: 1 });
      res.json({ success: true, count: services.length, data: services });
    } else {
      const store = getStore();
      const services = [...store.services].sort((a: any, b: any) => (a.order || a.id) - (b.order || b.id));
      res.json({ success: true, count: services.length, data: services });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let service: any;
      if (!isNaN(numId)) {
        service = await Service.findOne({ id: numId });
      } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
        service = await Service.findById(id);
      }

      if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }
      res.json({ success: true, data: service });
    } else {
      const store = getStore();
      const service = store.services.find((s: any) => s.id === numId || s._id === id);

      if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }
      res.json({ success: true, data: service });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    if (isMongoDBConnected()) {
      if (!data.id) {
        const maxDoc = await Service.findOne().sort({ id: -1 });
        data.id = (maxDoc?.id || 0) + 1;
      }
      const service = await Service.create(data);
      res.status(201).json({ success: true, data: service });
    } else {
      const store = getStore();
      if (!data.id) {
        const maxId = store.services.reduce((max: number, s: any) => Math.max(max, s.id || 0), 0);
        data.id = maxId + 1;
      }

      const newService = {
        _id: 'srv_' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      store.services.push(newService);
      await persistStore();
      res.status(201).json({ success: true, data: newService });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let service: any;
      if (!isNaN(numId)) {
        service = await Service.findOneAndUpdate({ id: numId }, req.body, { new: true });
      } else {
        service = await Service.findByIdAndUpdate(id, req.body, { new: true });
      }

      if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }
      res.json({ success: true, data: service });
    } else {
      const store = getStore();
      const idx = store.services.findIndex((s: any) => s.id === numId || s._id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }

      store.services[idx] = { ...store.services[idx], ...req.body };
      await persistStore();
      res.json({ success: true, data: store.services[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let service: any;
      if (!isNaN(numId)) {
        service = await Service.findOneAndDelete({ id: numId });
      } else {
        service = await Service.findByIdAndDelete(id);
      }

      if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }
      res.json({ success: true, message: 'Service deleted' });
    } else {
      const store = getStore();
      const initialLen = store.services.length;
      store.services = store.services.filter((s: any) => s.id !== numId && s._id !== id);

      if (store.services.length === initialLen) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
      }

      await persistStore();
      res.json({ success: true, message: 'Service deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

