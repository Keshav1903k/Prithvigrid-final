import { Router } from 'express';
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', createInquiry);
router.get('/', protect, adminOnly, getAllInquiries);
router.get('/:id', protect, adminOnly, getInquiryById);
router.patch('/:id', protect, adminOnly, updateInquiryStatus);
router.delete('/:id', protect, adminOnly, deleteInquiry);

export default router;

