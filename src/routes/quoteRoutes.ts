import express from 'express';
import { createQuoteRequest, getQuoteRequests, updateQuoteStatus, deleteQuoteRequest, getConvertedQuotes } from '../controllers/quoteController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createQuoteRequest)
  .get(protect, getQuoteRequests);

router.get('/converted', protect, getConvertedQuotes);

router.route('/:id')
  .put(protect, updateQuoteStatus)
  .delete(protect, deleteQuoteRequest);

export default router;
