"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertedQuotes = exports.deleteQuoteRequest = exports.updateQuoteStatus = exports.getQuoteRequests = exports.createQuoteRequest = void 0;
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
// @desc    Create a new quote request
// @route   POST /api/quotes
// @access  Public
const createQuoteRequest = async (req, res) => {
    try {
        console.log('Incoming Quote Request:', req.body);
        const { firstName, lastName, email, phone, movingFrom, movingTo, serviceType, message } = req.body;
        const newQuote = await QuoteRequest_1.default.create({
            firstName,
            lastName,
            email,
            phone,
            movingFrom,
            movingTo,
            serviceType,
            message,
        });
        res.status(201).json({
            success: true,
            data: newQuote
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.createQuoteRequest = createQuoteRequest;
// @desc    Get all quote requests
// @route   GET /api/quotes
// @access  Private/Admin (Placeholder)
const getQuoteRequests = async (req, res) => {
    try {
        const quotes = await QuoteRequest_1.default.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: quotes.length, data: quotes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.getQuoteRequests = getQuoteRequests;
// @desc    Update quote request status
const updateQuoteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const quote = await QuoteRequest_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, data: quote });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.updateQuoteStatus = updateQuoteStatus;
// @desc    Delete a quote request
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
const deleteQuoteRequest = async (req, res) => {
    try {
        const quote = await QuoteRequest_1.default.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).json({ success: false, message: 'Quote not found' });
        }
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.deleteQuoteRequest = deleteQuoteRequest;
// @desc    Get all converted quote requests
// @route   GET /api/quotes/converted
// @access  Private/Admin
const getConvertedQuotes = async (req, res) => {
    try {
        const quotes = await QuoteRequest_1.default.find({
            status: { $in: ['converted', 'shipped', 'Converted', 'Shipped'] }
        }).sort({ updatedAt: -1 });
        console.log(`Fetched ${quotes.length} converted/shipped quotes. Statuses: ${quotes.map(q => q.status).join(', ')}`);
        res.status(200).json({ success: true, count: quotes.length, data: quotes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.getConvertedQuotes = getConvertedQuotes;
