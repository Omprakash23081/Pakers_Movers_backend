import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { IShipment } from "../models/Shipment";

const { Client, LocalAuth } = pkg;

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    handleSIGINT: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one element is important for some cloud platforms
      '--disable-gpu'
    ],
    // If we're on Render, we might need a specific path, but let Puppeteer try to find the installed one first
    // unless it fails. The build command now installs it.
    executablePath: process.env.CHROME_PATH || undefined,
  }
});

// Flag to track client readiness
let isClientReady = false;

client.on("qr", (qr) => {
  console.log("=========================================");
  console.log("📢 SCAN QR CODE FOR WHATSAPP SESSION:");
  console.log("=========================================");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  isClientReady = true;
  console.log("✅ WhatsApp client is READY and CONNECTED");
});

client.on("auth_failure", (msg) => {
  isClientReady = false;
  console.error("❌ WhatsApp authentication FAILED:", msg);
});

client.on("disconnected", (reason) => {
  isClientReady = false;
  console.error("❌ WhatsApp client DISCONNECTED:", reason);
});

client.initialize().catch(err => {
  console.error("❌ Failed to initialize WhatsApp client:", err);
});

/**
 * Service to handle automated WhatsApp notifications
 */
export const whatsappService = {
  /**
   * Check if the WhatsApp client is ready
   */
  isReady: () => isClientReady,

  /**
   * Send a WhatsApp message with shipment details
   */
  sendShipmentDetails: async (shipment: IShipment) => {
    if (!isClientReady) {
      console.log("⚠️ Cannot send WhatsApp: Client is not ready");
      return false;
    }

    // Format number: should be 919876543210@c.us
    // Removing any non-digit characters
    let cleanPhone = shipment.customerPhone.replace(/\D/g, '');

    // Handle leading zeros often found in copied numbers
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }

    // If it's a 10 digit number, assume it's Indian and prefix with 91
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    // If it starts with 91 and is 12 digits, it's already correct
    // If it's longer than 12, it might have international prefixes, leave as is but ensure it's digits

    const number = cleanPhone + "@c.us";

   const message =
`🚚 *SSD Packers & Movers*

━━━━━━━━━━━━━━━
✅ *Shipment Confirmed*
━━━━━━━━━━━━━━━

Hello *${shipment.customerName}* 👋

Your shipment has been successfully created and is now being processed.

📦 *Tracking Details*
• *Tracking ID:* ${shipment.trackingId}

📍 *Pickup Location*  
${shipment.origin}

🏁 *Delivery Location*  
${shipment.destination}

🚛 *Transport Information*
• *Driver:* ${shipment.driverName || 'To be assigned'}
• *Contact:* ${shipment.driverPhone || 'Will be updated soon'}
• *Vehicle:* ${shipment.vehicleNumber || 'Pending'}

━━━━━━━━━━━━━━━
🔎 *Track Your Shipment*
https://pakers-movers.netlify.app/track?id=${shipment.trackingId}
━━━━━━━━━━━━━━━

Thank you for choosing  
*SSD Packers & Movers* 🙏

We will keep you updated on your shipment status.`;

    try {
      console.log(`📤 Attempting to send WhatsApp message to ${number}...`);
      await client.sendMessage(number, message);
      console.log(`✅ WhatsApp message sent successfully to ${number}`);
      return true;
    } catch (error: any) {
      console.log("❌ WhatsApp send failed:", error.message || error);
      return false;
    }
  }
};

