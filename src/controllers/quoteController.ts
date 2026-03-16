import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';
import { notificationService } from '../services/notificationService';

// @desc    Create a new quote request
// @route   POST /api/quotes
// @access  Public
export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    console.log('Incoming Quote Request:', req.body);
    const { firstName, lastName, email, phone, movingFrom, movingTo, serviceType, message } = req.body;

    const newQuote = await QuoteRequest.create({
      firstName,
      lastName,
      email,
      phone,
      movingFrom,
      movingTo,
      serviceType,
      message,
    });

    // Trigger notification to admin
    await notificationService.notifyInquiryCreated(newQuote);

    res.status(201).json({
      success: true,
      data: newQuote
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all quote requests
// @route   GET /api/quotes
// @access  Private/Admin (Placeholder)
export const getQuoteRequests = async (req: Request, res: Response) => {
  try {
    const quotes = await QuoteRequest.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update quote request status
export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const quote = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.status(200).json({ success: true, data: quote });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a quote request
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
export const deleteQuoteRequest = async (req: Request, res: Response) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all converted quote requests
// @route   GET /api/quotes/converted
// @access  Private/Admin
export const getConvertedQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await QuoteRequest.find({
      status: { $in: ['converted', 'shipped', 'Converted', 'Shipped'] }
    }).sort({ updatedAt: -1 });
    console.log(`Fetched ${quotes.length} converted/shipped quotes. Statuses: ${quotes.map(q => q.status).join(', ')}`);
    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
