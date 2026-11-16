import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest, generateToken } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Inquiry } from '../models/Inquiry.js';
import { Project } from '../models/Project.js';
import { Blog } from '../models/Blog.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore, persistStore } from '../config/store.js';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    if (isMongoDBConnected()) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user._id.toString(), user.role);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      const store = getStore();
      const user = store.users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user._id || user.id, user.role);
      res.json({
        success: true,
        token,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
      return;
    }

    const emailClean = email.toLowerCase().trim();

    if (isMongoDBConnected()) {
      const existing = await User.findOne({ email: emailClean });
      if (existing) {
        res.status(400).json({ success: false, message: 'User already exists with this email' });
        return;
      }

      const user = await User.create({
        name,
        email: emailClean,
        password,
        role: role || 'admin',
      });

      const token = generateToken(user._id.toString(), user.role);
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      const store = getStore();
      if (store.users.some((u: any) => u.email.toLowerCase() === emailClean)) {
        res.status(400).json({ success: false, message: 'User already exists with this email' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: emailClean,
        password: hashedPassword,
        role: role || 'admin',
        createdAt: new Date().toISOString(),
      };

      store.users.push(newUser);
      await persistStore();

      const token = generateToken(newUser._id, newUser.role);
      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user });
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected()) {
      const totalInquiries = await Inquiry.countDocuments();
      const newInquiries = await Inquiry.countDocuments({ status: 'new' });
      const totalProjects = await Project.countDocuments();
      const totalBlogs = await Blog.countDocuments();

      res.json({
        success: true,
        stats: {
          totalInquiries,
          newInquiries,
          totalProjects,
          totalBlogs,
        },
      });
    } else {
      const store = getStore();
      const totalInquiries = store.inquiries.length;
      const newInquiries = store.inquiries.filter((i: any) => i.status === 'new').length;
      const totalProjects = store.projects.length;
      const totalBlogs = store.blogs.length;

      res.json({
        success: true,
        stats: {
          totalInquiries,
          newInquiries,
          totalProjects,
          totalBlogs,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

