import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import { IShipment } from "../models/Shipment";

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

    // Format number: should be 919876543210@s.whatsapp.net for baileys
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

    const number = cleanPhone + "@s.whatsapp.net"; // Format requirement for baileys

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
      await sock.sendMessage(number, { text: message });
      console.log(`✅ WhatsApp message sent successfully to ${number}`);
      return true;
    } catch (error: any) {
      console.log("❌ WhatsApp send failed:", error.message || error);
      return false;
    }
  }
};

