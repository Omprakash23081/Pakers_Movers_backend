"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const whatsappService_1 = require("./whatsappService");
/**
 * Service to handle customer notifications via SMS/Email/WhatsApp
 */
exports.notificationService = {
    /**
     * Send notification when a new shipment is created
     */
    notifyShipmentCreated: async (shipment) => {
        console.log("=========================================");
        console.log("🔔 NOTIFICATION TRIGGERED: Shipment Created");
        console.log(`To: ${shipment.customerName} (${shipment.customerPhone})`);
        console.log(`Tracking ID: ${shipment.trackingId}`);
        console.log("=========================================");
        // Trigger WhatsApp notification
        await whatsappService_1.whatsappService.sendShipmentDetails(shipment);
        return true;
    }
};
