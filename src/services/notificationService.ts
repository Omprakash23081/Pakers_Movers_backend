import { IShipment } from "../models/Shipment";
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
  }
};
