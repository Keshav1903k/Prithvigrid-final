import { Router } from 'express';
import {
  getAllTestimonials,
  createTestimonial,
} from '../controllers/testimonialController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllTestimonials);
router.post('/', protect, adminOnly, createTestimonial);

export default router;

