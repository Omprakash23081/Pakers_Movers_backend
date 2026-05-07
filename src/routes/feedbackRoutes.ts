import express from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedbackController';

const router = express.Router();
console.log('Feedback Router Initialized');

router.post('/', createFeedback);
router.get('/', getFeedbacks);

export default router;
