import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import { IShipment } from "../models/Shipment";
import { IQuoteRequest } from "../models/QuoteRequest";

// Flag to track client readiness and store latest QR
let isClientReady = false;
let latestQRCode: string | null = null;
let latestQRCodeDataURL: string | null = null;
let sock: ReturnType<typeof makeWASocket> | null = null;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // We handle it manually to get DataURL
    syncFullHistory: false, // Don't download entire chat history
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("=========================================");
      console.log("📢 SCAN QR CODE FOR WHATSAPP SESSION:");
      console.log("=========================================");
      latestQRCode = qr;
      qrcode.generate(qr, { small: true });

      try {
        // Generate a DataURL for browser display
        latestQRCodeDataURL = await QRCode.toDataURL(qr);
        console.log("✅ QR Code DataURL generated for browser access");
      } catch (err) {
        console.error("❌ Failed to generate QR DataURL:", err);
      }
    }

    if (connection === 'close') {
      isClientReady = false;
      // reconnect if not logged out
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);

      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        console.log("⚠️ You have been logged out. Please delete the auth_info_baileys folder and restart the server to scan QR again.");
      }
    } else if (connection === 'open') {
      isClientReady = true;
      latestQRCode = null;
      latestQRCodeDataURL = null;
      console.log('✅ WhatsApp client is READY and CONNECTED');
    }
  });

}

// Initialize the connection asynchronously
connectToWhatsApp().catch(err => {
  console.error("❌ Failed to initialize WhatsApp client:", err);
});

/**
 * Service to handle automated WhatsApp notifications
 */
export const whatsappService = {
  /**
   * Get the latest raw QR Code string
   */
  getLatestRawQR: () => latestQRCode,

  /**
   * Get the latest QR Code Data URL
   */
  getLatestQR: () => latestQRCodeDataURL,

  /**
   * Check if the WhatsApp client is ready
   */
  isReady: () => isClientReady,

  /**
   * Send a custom WhatsApp message to any number
   */
  sendCustomMessage: async (chatId: string, message: string) => {
    if (!isClientReady || !sock) {
      console.log("⚠️ Cannot send WhatsApp: Client is not open");
      return false;
    }

    try {
      console.log(`📤 Attempting to send custom WhatsApp message to ${chatId}...`);
      await sock.sendMessage(chatId, { text: message });
      console.log(`✅ Custom WhatsApp message sent successfully to ${chatId}`);
      return true;
    } catch (error: any) {
      console.log("❌ WhatsApp custom send failed:", error.message || error);
      return false;
    }
  },

  /**
   * Send a WhatsApp message with shipment details
   */
  sendShipmentDetails: async (shipment: IShipment) => {
    if (!isClientReady || !sock) {
      console.log("⚠️ Cannot send WhatsApp: Client is not open");
      return false;
    }

    let cleanPhone = shipment.customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const number = cleanPhone + "@s.whatsapp.net";

    const message =
      `📦 *Sunita Cargo Packers & Movers*
      
*Shipment Booked Successfully*
━━━━━━━━━━━━━━━━━━

Hello *${shipment.customerName}*,

Thank you for choosing *Sunita Cargo Packers & Movers*. Your shipment has been recorded and is now in our system.

🆔 *Tracking ID:* ${shipment.trackingId}
📍 *Origin:* ${shipment.origin}
🏁 *Destination:* ${shipment.destination}

🚛 *Vehicle Details:*
• *Driver:* ${shipment.driverName || 'Assigning...'}
• *Vehicle:* ${shipment.vehicleNumber || 'Wait for update'}

🔗 *Track Your Live Shipment:*
https://sunitacargopackersmovers.com/track?id=${shipment.trackingId}

━━━━━━━━━━━━━━━━━━
📞 *Support:* +91 73876 61300
📧 *Email:* info.sunitacargopackersmovers@gmail.com
🏢 *H.O:* Nagpur, Maharashtra
_Reliable. Safe. Fast._`;

    try {
      console.log(`📤 Sending Booking ID ${shipment.trackingId} to ${number}...`);
      await sock.sendMessage(number, { text: message });
      return true;
    } catch (error: any) {
      console.log("❌ WhatsApp send failed:", error.message || error);
      return false;
    }
  },

  /**
   * Send status update notification
   */
  sendShipmentUpdate: async (shipment: IShipment, location: string, statusText: string) => {
    if (!isClientReady || !sock) return false;

    let cleanPhone = shipment.customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const number = cleanPhone + "@s.whatsapp.net";

    const message =
      `🚚 *Transit Update: ${shipment.trackingId}*
━━━━━━━━━━━━━━━━━━

Hello *${shipment.customerName}*,

There is a new update on your shipment:

📍 *Current Location:* ${location}
📝 *Status:* ${statusText}

🔗 *Live Tracking:*
https://sunitacargopackersmovers.com/track?id=${shipment.trackingId}

━━━━━━━━━━━━━━━━━━
*Sunita Cargo Packers & Movers*`;

    try {
      await sock.sendMessage(number, { text: message });
      return true;
    } catch (error: any) {
      console.log("❌ Update notification failed:", error.message);
      return false;
    }
  },

  /**
   * Send a WhatsApp message to admin with new inquiry details
   */
  sendInquiryToAdmin: async (adminPhone: string, inquiry: IQuoteRequest) => {
    if (!isClientReady || !sock) {
      console.log("⚠️ Cannot send WhatsApp to Admin: Client is not open");
      return false;
    }

    // Format admin number
    let cleanPhone = adminPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const number = cleanPhone + "@s.whatsapp.net";

    const message =
      `🔔 *NEW INQUIRY RECEIVED* 🔔
━━━━━━━━━━━━━━━━
👤 *Customer:* ${inquiry.firstName} ${inquiry.lastName || ''}
📞 *Phone:* ${inquiry.phone}
📧 *Email:* ${inquiry.email || 'N/A'}

📍 *From:* ${inquiry.movingFrom || 'N/A'}
🏁 *To:* ${inquiry.movingTo || 'N/A'}
🛠 *Service:* ${inquiry.serviceType || 'Inquiry'}

💬 *Message:*
${inquiry.message || 'No additional message.'}
━━━━━━━━━━━━━━━━
Generated via Website Form`;

    try {
      console.log(`📤 Attempting to notify admin at ${number}...`);
      await sock.sendMessage(number, { text: message });
      console.log(`✅ Admin notified successfully via WhatsApp`);
      return true;
    } catch (error: any) {
      console.log("❌ Admin notification failed:", error.message || error);
      return false;
    }
  }
};

