import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';
import Shipment from '../models/Shipment';
import Feedback from '../models/Feedback';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalQuotes = await QuoteRequest.countDocuments();
    const activeShipments = await Shipment.countDocuments({ currentStatus: { $ne: 'delivered' } });
    const deliveredShipments = await Shipment.countDocuments({ currentStatus: 'delivered' });
    const totalFeedback = await Feedback.countDocuments();
    
    // Aggregations for charts
    const serviceDistribution = await QuoteRequest.aggregate([
      { $group: { _id: "$serviceType", count: { $sum: 1 } } }
    ]);
    
    const statusBreakdown = await QuoteRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const recentQuotes = await QuoteRequest.find().sort({ createdAt: -1 }).limit(5);
    const recentShipments = await Shipment.find().sort({ updatedAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalQuotes,
        activeShipments,
        deliveredShipments,
        totalFeedback,
        serviceDistribution,
        statusBreakdown
      },
      recentQuotes,
      recentShipments
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
