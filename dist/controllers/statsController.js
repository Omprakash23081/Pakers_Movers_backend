"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
const Shipment_1 = __importDefault(require("../models/Shipment"));
const getDashboardStats = async (req, res) => {
    try {
        const totalQuotes = await QuoteRequest_1.default.countDocuments();
        const activeShipments = await Shipment_1.default.countDocuments({ currentStatus: { $ne: 'delivered' } });
        const deliveredShipments = await Shipment_1.default.countDocuments({ currentStatus: 'delivered' });
        // Aggregations for charts
        const serviceDistribution = await QuoteRequest_1.default.aggregate([
            { $group: { _id: "$serviceType", count: { $sum: 1 } } }
        ]);
        const statusBreakdown = await QuoteRequest_1.default.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const recentQuotes = await QuoteRequest_1.default.find().sort({ createdAt: -1 }).limit(5);
        const recentShipments = await Shipment_1.default.find().sort({ updatedAt: -1 }).limit(5);
        res.json({
            success: true,
            stats: {
                totalQuotes,
                activeShipments,
                deliveredShipments,
                serviceDistribution,
                statusBreakdown
            },
            recentQuotes,
            recentShipments
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
