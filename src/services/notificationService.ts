import { IShipment } from "../models/Shipment";
import { IQuoteRequest } from "../models/QuoteRequest";
import { whatsappService } from "./whatsappService";

/**
 * Service to handle customer notifications via SMS/Email/WhatsApp
 */
export const notificationService = {
  /**
   * Send notification when a new shipment is created
   */
  notifyShipmentCreated: async (shipment: IShipment) => {
    console.log("=========================================");
    console.log("🔔 NOTIFICATION TRIGGERED: Shipment Created");
    console.log(`To: ${shipment.customerName} (${shipment.customerPhone})`);
    console.log(`Tracking ID: ${shipment.trackingId}`);
    console.log("=========================================");
    
    // Trigger WhatsApp notification
    await whatsappService.sendShipmentDetails(shipment);
    
    return true;
  },

  /**
   * Send notification to admin when a new inquiry is created
   */
  notifyInquiryCreated: async (inquiry: IQuoteRequest) => {
    const adminPhone = process.env.ADMIN_PHONE || '9798822495';
    
    console.log("=========================================");
    console.log("🔔 NOTIFICATION TRIGGERED: Inquiry Received");
    console.log(`From: ${inquiry.firstName} (${inquiry.phone})`);
    console.log(`Targeting Admin: ${adminPhone}`);
    console.log("=========================================");

    // Trigger WhatsApp notification to admin
    await whatsappService.sendInquiryToAdmin(adminPhone, inquiry);

    return true;
  },

  /**
   * Update notification for existing shipment
   */
  notifyShipmentUpdated: async (shipment: IShipment, location: string, status: string) => {
    console.log(`🔔 NOTIFICATION TRIGGERED: Shipment Update (${shipment.trackingId})`);
    await whatsappService.sendShipmentUpdate(shipment, location, status);
    return true;
  }
};
