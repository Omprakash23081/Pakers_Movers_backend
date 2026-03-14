import axios from 'axios';
import { IShipment } from "../models/Shipment";

/**
 * Service to handle automated WhatsApp notifications
 */
export const whatsappService = {
  /**
   * Send a WhatsApp message with shipment details
   */
  sendShipmentDetails: async (shipment: IShipment) => {
    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiKey = process.env.WHATSAPP_API_KEY;
    const sender = process.env.WHATSAPP_SENDER_PHONE;

    if (!apiUrl || !apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.log('⚠️ WhatsApp API credentials not configured. Skipping message.');     
      return false;
    }

    try {
      const message = `*SSDPackersMovers: New Shipment Created!* 🚚\n\n` +
        `Hello ${shipment.customerName},\n\n` +
        `Your shipment has been successfully booked.\n\n` +
        `*Tracking ID:* ${shipment.trackingId}\n` +
        `*From:* ${shipment.origin}\n` +
        `*To:* ${shipment.destination}\n` +
        `*Driver:* ${shipment.driverName} (${shipment.driverPhone})\n` +
        `*Vehicle:* ${shipment.vehicleNumber}\n\n` +
        `You can track your shipment live at: https://rajpackersmovers.com/track?id=${shipment.trackingId}\n\n` +
        `Thank you for choosing SSD Packers & Movers!`;

      // Generic implementation - adapts to most 3rd party providers
      await axios.post(apiUrl, {
        to: shipment.customerPhone,
        message: message,
        sender: sender
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp notification sent to ${shipment.customerPhone}`);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to send WhatsApp notification:', error.response?.data || error.message);
      return false;
    }
  }
};
