import express from 'express';
import { 
  getAllPricing, 
  getPricingByCategory, 
  updatePricing, 
  seedPricing 
} from '../controllers/pricingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllPricing);
router.get('/:category', getPricingByCategory);

// Protected routes (Admin only)
router.put('/:category', protect, updatePricing);
router.post('/seed', protect, seedPricing);

export default router;
