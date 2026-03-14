import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { IShipment } from "../models/Shipment";

const { Client, LocalAuth } = pkg;

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    handleSIGINT: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp client ready");
});

client.on("auth_failure", (msg) => {
  console.error("❌ WhatsApp authentication failed", msg);
});

client.initialize();

/**
 * Service to handle automated WhatsApp notifications
 */
export const whatsappService = {
  /**
   * Send a WhatsApp message with shipment details
   */
  sendShipmentDetails: async (shipment: IShipment) => {
    // Format number: should be 919876543210@c.us
    // Removing any non-digit characters and ensuring it ends with @c.us
    let cleanPhone = shipment.customerPhone.replace(/\D/g, '');
    
    // If it doesn't start with 91 (India) and is 10 digits, prepend 91
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    
    const number = cleanPhone + "@c.us";

    const message =
      `🚚 *Shipment Created Successfully*\n\n` +
      `Hello ${shipment.customerName}\n\n` +
      `Tracking ID: ${shipment.trackingId}\n` +
      `From: ${shipment.origin}\n` +
      `To: ${shipment.destination}\n` +
      `Driver: ${shipment.driverName} (${shipment.driverPhone})\n` +
      `Vehicle: ${shipment.vehicleNumber}\n\n` +
      `Track here:\nhttps://rajpackersmovers.com/track?id=${shipment.trackingId}\n\n` +
      `Thank you for choosing SSD Packers & Movers!`;

    try {
      await client.sendMessage(number, message);
      console.log(`✅ WhatsApp message sent to ${number}`);
      return true;
    } catch (error) {
      console.log("❌ WhatsApp send failed", error);
      return false;
    }
  }
};

