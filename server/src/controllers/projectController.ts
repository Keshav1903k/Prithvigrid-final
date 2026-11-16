import { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    if (isMongoDBConnected()) {
      const query: any = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { materials: { $regex: search, $options: 'i' } },
        ];
      }

      const projects = await Project.find(query).sort({ id: 1 });
      res.json({ success: true, count: projects.length, data: projects });
    } else {
      const store = getStore();
      let projects = [...store.projects];

      if (category && category !== 'All') {
        projects = projects.filter((p: any) => p.category === category);
      }
      if (search) {
        const s = (search as string).toLowerCase();
        projects = projects.filter(
          (p: any) =>
            p.title.toLowerCase().includes(s) ||
            p.location.toLowerCase().includes(s) ||
            (p.materials && p.materials.toLowerCase().includes(s))
        );
      }

      projects.sort((a: any, b: any) => a.id - b.id);
      res.json({ success: true, count: projects.length, data: projects });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let project: any;
      if (!isNaN(numId)) {
        project = await Project.findOne({ id: numId });
      }
      if (!project && id.match(/^[0-9a-fA-F]{24}$/)) {
        project = await Project.findById(id);
      }

      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      res.json({ success: true, data: project });
    } else {
      const store = getStore();
      const project = store.projects.find((p: any) => p.id === numId || p._id === id);

      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      res.json({ success: true, data: project });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectData = req.body;

    if (isMongoDBConnected()) {
      if (!projectData.id) {
        const maxIdDoc = await Project.findOne().sort({ id: -1 });
        projectData.id = (maxIdDoc?.id || 0) + 1;
      }

      const project = await Project.create(projectData);
      res.status(201).json({ success: true, data: project });
    } else {
      const store = getStore();
      if (!projectData.id) {
        const maxId = store.projects.reduce((max: number, p: any) => Math.max(max, p.id || 0), 0);
        projectData.id = maxId + 1;
      }

      const newProj = {
        _id: 'proj_' + Date.now(),
        ...projectData,
        createdAt: new Date().toISOString(),
      };

      store.projects.push(newProj);
      await persistStore();
      res.status(201).json({ success: true, data: newProj });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let project: any;
      if (!isNaN(numId)) {
        project = await Project.findOneAndUpdate({ id: numId }, req.body, { new: true });
      } else {
        project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      }

      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      res.json({ success: true, data: project });
    } else {
      const store = getStore();
      const idx = store.projects.findIndex((p: any) => p.id === numId || p._id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      store.projects[idx] = { ...store.projects[idx], ...req.body, updatedAt: new Date().toISOString() };
      await persistStore();
      res.json({ success: true, data: store.projects[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let project: any;
      if (!isNaN(numId)) {
        project = await Project.findOneAndDelete({ id: numId });
      } else {
        project = await Project.findByIdAndDelete(id);
      }

      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      res.json({ success: true, message: 'Project deleted successfully' });
    } else {
      const store = getStore();
      const initialLen = store.projects.length;
      store.projects = store.projects.filter((p: any) => p.id !== numId && p._id !== id);

      if (store.projects.length === initialLen) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      await persistStore();
      res.json({ success: true, message: 'Project deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

