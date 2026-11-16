import { Router } from 'express';
import { calculateEstimate } from '../controllers/estimateController.js';

const router = Router();

router.post('/calculate', calculateEstimate);

export default router;

