import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, rating, message } = req.body as {
      fullName: string;
      email?: string;
      phone: string;
      rating: number;
      message: string;
    };

    const newFeedback = new Feedback({
      fullName,
      email,
      phone,
      rating,
      message,
    });

    const savedFeedback = await newFeedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: savedFeedback
    });
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.',
      error: error.message
    });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    // Get newest feedback first, limit to 50
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error: any) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback list.',
      error: error.message
    });
  }
};
