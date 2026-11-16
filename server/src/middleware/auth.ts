import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoDBConnected } from '../config/db.js';
import { getStore } from '../config/store.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'prithvigrid_jwt_secret_dev';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized: No token provided' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'prithvigrid_jwt_secret_dev';
    const decoded: any = jwt.verify(token, secret);

    if (isMongoDBConnected()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const store = getStore();
      const user = store.users.find((u: any) => u._id === decoded.id || u.id === decoded.id);
      if (user) {
        const { password, ...safeUser } = user;
        req.user = safeUser;
      }
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
};

