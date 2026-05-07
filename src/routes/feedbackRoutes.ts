import express from 'express';
import { createFeedback, getFeedbacks, deleteFeedback } from '../controllers/feedbackController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
console.log('Feedback Router Initialized');

router.post('/', createFeedback);
router.get('/', protect, getFeedbacks);
router.delete('/:id', protect, deleteFeedback);


export default router;
