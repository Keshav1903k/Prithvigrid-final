import { Router } from 'express';
import { login, register, getMe, getDashboardStats } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;

