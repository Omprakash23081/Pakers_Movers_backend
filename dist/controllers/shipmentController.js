"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = exports.getWhatsAppStatus = exports.updateShipmentStatus = exports.trackShipment = exports.createShipment = exports.deleteShipment = exports.getShipments = void 0;
const Shipment_1 = __importDefault(require("../models/Shipment"));
const QuoteRequest_1 = __importDefault(require("../models/QuoteRequest"));
// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private/Admin
const getShipments = async (req, res) => {
    try {
        const { includeDeleted } = req.query;
        const filter = includeDeleted === 'true' ? {} : { isDeleted: { $ne: true } };
        const shipments = await Shipment_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: shipments.length, data: shipments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.getShipments = getShipments;
// @desc    Soft Delete or Permanent Delete Shipment
// @route   DELETE /api/shipments/:id
// @access  Private/Admin
const deleteShipment = async (req, res) => {
    try {
        const { permanent } = req.query;
        const shipment = await Shipment_1.default.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }
        if (permanent === 'true') {
            await Shipment_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: 'Shipment permanently deleted' });
        }
        const updatedShipment = await Shipment_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!updatedShipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }
        res.status(200).json({ success: true, message: 'Shipment moved to history', data: updatedShipment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.deleteShipment = deleteShipment;
const notificationService_1 = require("../services/notificationService");
// @desc    Create a new shipment profile
// @route   POST /api/shipments
// @access  Private/Admin
const createShipment = async (req, res) => {
    try {
        const { trackingId, customerName, customerPhone, origin, destination, estimatedDelivery, quoteId, driverName, driverPhone, vehicleNumber } = req.body;
        const newShipment = await Shipment_1.default.create({
            trackingId,
            customerName,
            customerPhone,
            origin,
            destination,
            estimatedDelivery,
            driverName,
            driverPhone,
            vehicleNumber,
            updates: [{
                    location: origin,
                    status: 'Shipment booked and verified',
                    timestamp: new Date()
                }]
        });
        // If initiated from a converted quote, mark that quote as shipped
        if (quoteId) {
            await QuoteRequest_1.default.findByIdAndUpdate(quoteId, { status: 'shipped' });
        }
        // Trigger notification
        await notificationService_1.notificationService.notifyShipmentCreated(newShipment);
        res.status(201).json({ success: true, data: newShipment });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Tracking ID already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.createShipment = createShipment;
// @desc    Get tracking details by Tracking ID
// @route   GET /api/shipments/track/:id
// @access  Public
const trackShipment = async (req, res) => {
    try {
        // Allows searching by Tracking ID or Customer Phone for ease of access
        const searchId = String(req.params.id);
        const shipment = await Shipment_1.default.findOne({
            $or: [
                { trackingId: searchId.toUpperCase() },
                { customerPhone: searchId }
            ]
        });
        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found. Please verify your Tracking ID or Mobile Number.' });
        }
        res.status(200).json({ success: true, data: shipment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.trackShipment = trackShipment;
// @desc    Update Shipment Status
// @route   PUT /api/shipments/:id
// @access  Private/Admin
const updateShipmentStatus = async (req, res) => {
    try {
        const { location, status, currentStatus } = req.body;
        const shipment = await Shipment_1.default.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }
        if (currentStatus)
            shipment.currentStatus = currentStatus;
        // Add new update to tracking history
        if (location && status) {
            shipment.updates.push({
                location,
                status,
                timestamp: new Date()
            });
        }
        await shipment.save();
        res.status(200).json({ success: true, data: shipment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.updateShipmentStatus = updateShipmentStatus;
const whatsappService_1 = require("../services/whatsappService");
// @desc    Get WhatsApp client status
// @route   GET /api/shipments/whatsapp/status
// @access  Private/Admin
const getWhatsAppStatus = async (req, res) => {
    try {
        const isReady = whatsappService_1.whatsappService.isReady();
        res.status(200).json({
            success: true,
            isReady,
            message: isReady ? 'WhatsApp client is connected' : 'WhatsApp client is not connected'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.getWhatsAppStatus = getWhatsAppStatus;
// @desc    Send custom WhatsApp message
// @route   POST /api/shipments/send-whatsapp
// @access  Private/Admin
const sendWhatsAppMessage = async (req, res) => {
    try {
        const { number, message } = req.body;
        if (!number || !message) {
            return res.status(400).json({ success: false, message: 'Please provide number and message' });
        }
        if (!whatsappService_1.whatsappService.isReady()) {
            return res.status(503).json({ success: false, message: 'WhatsApp client is not ready' });
        }
        // Format number: should be 919876543210@c.us
        let cleanPhone = number.replace(/\D/g, '');
        if (cleanPhone.startsWith('0'))
            cleanPhone = cleanPhone.substring(1);
        if (cleanPhone.length === 10)
            cleanPhone = '91' + cleanPhone;
        const chatId = cleanPhone + "@c.us";
        // Since we don't export 'client' directly, we can add a method to whatsappService
        // or use a temporary hack if we can't modify the service easily.
        // I'll add 'sendMessage' to whatsappService.
        const sent = await whatsappService_1.whatsappService.sendCustomMessage(chatId, message);
        if (sent) {
            res.status(200).json({ success: true, message: 'WhatsApp message sent' });
        }
        else {
            res.status(500).json({ success: false, message: 'Failed to send message' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
