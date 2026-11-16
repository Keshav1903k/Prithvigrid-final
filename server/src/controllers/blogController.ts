import { Request, Response } from 'express';
import { Blog } from '../models/Blog.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;

    if (isMongoDBConnected()) {
      const query: any = {};
      if (category && category !== 'All') query.cat = category;
      if (featured !== undefined) query.featured = featured === 'true';

      const blogs = await Blog.find(query).sort({ id: 1 });
      res.json({ success: true, count: blogs.length, data: blogs });
    } else {
      const store = getStore();
      let blogs = [...store.blogs];

      if (category && category !== 'All') {
        blogs = blogs.filter((b: any) => b.cat === category);
      }
      if (featured !== undefined) {
        blogs = blogs.filter((b: any) => b.featured === (featured === 'true'));
      }

      blogs.sort((a: any, b: any) => a.id - b.id);
      res.json({ success: true, count: blogs.length, data: blogs });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let blog: any;
      if (!isNaN(numId)) {
        blog = await Blog.findOne({ id: numId });
      } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findById(id);
      }

      if (!blog) {
        res.status(404).json({ success: false, message: 'Blog article not found' });
        return;
      }

      res.json({ success: true, data: blog });
    } else {
      const store = getStore();
      const blog = store.blogs.find((b: any) => b.id === numId || b._id === id);

      if (!blog) {
        res.status(404).json({ success: false, message: 'Blog article not found' });
        return;
      }

      res.json({ success: true, data: blog });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogData = req.body;

    if (isMongoDBConnected()) {
      if (!blogData.id) {
        const maxDoc = await Blog.findOne().sort({ id: -1 });
        blogData.id = (maxDoc?.id || 0) + 1;
      }
      const blog = await Blog.create(blogData);
      res.status(201).json({ success: true, data: blog });
    } else {
      const store = getStore();
      if (!blogData.id) {
        const maxId = store.blogs.reduce((max: number, b: any) => Math.max(max, b.id || 0), 0);
        blogData.id = maxId + 1;
      }

      const newBlog = {
        _id: 'blog_' + Date.now(),
        ...blogData,
        createdAt: new Date().toISOString(),
      };

      store.blogs.push(newBlog);
      await persistStore();
      res.status(201).json({ success: true, data: newBlog });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let blog: any;
      if (!isNaN(numId)) {
        blog = await Blog.findOneAndUpdate({ id: numId }, req.body, { new: true });
      } else {
        blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
      }

      if (!blog) {
        res.status(404).json({ success: false, message: 'Blog not found' });
        return;
      }

      res.json({ success: true, data: blog });
    } else {
      const store = getStore();
      const idx = store.blogs.findIndex((b: any) => b.id === numId || b._id === id);

      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Blog not found' });
        return;
      }

      store.blogs[idx] = { ...store.blogs[idx], ...req.body, updatedAt: new Date().toISOString() };
      await persistStore();
      res.json({ success: true, data: store.blogs[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const numId = Number(id);

    if (isMongoDBConnected()) {
      let blog: any;
      if (!isNaN(numId)) {
        blog = await Blog.findOneAndDelete({ id: numId });
      } else {
        blog = await Blog.findByIdAndDelete(id);
      }

      if (!blog) {
        res.status(404).json({ success: false, message: 'Blog not found' });
        return;
      }

      res.json({ success: true, message: 'Blog article deleted' });
    } else {
      const store = getStore();
      const initialLen = store.blogs.length;
      store.blogs = store.blogs.filter((b: any) => b.id !== numId && b._id !== id);

      if (store.blogs.length === initialLen) {
        res.status(404).json({ success: false, message: 'Blog not found' });
        return;
      }

      await persistStore();
      res.json({ success: true, message: 'Blog article deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

