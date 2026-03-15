"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const qrcode_1 = __importDefault(require("qrcode"));
// Flag to track client readiness and store latest QR
let isClientReady = false;
let latestQRCode = null;
let latestQRCodeDataURL = null;
let sock = null;
async function connectToWhatsApp() {
    const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)('./auth_info_baileys');
    const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);
    sock = (0, baileys_1.default)({
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
            qrcode_terminal_1.default.generate(qr, { small: true });
            try {
                // Generate a DataURL for browser display
                latestQRCodeDataURL = await qrcode_1.default.toDataURL(qr);
                console.log("✅ QR Code DataURL generated for browser access");
            }
            catch (err) {
                console.error("❌ Failed to generate QR DataURL:", err);
            }
        }
        if (connection === 'close') {
            isClientReady = false;
            // reconnect if not logged out
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut;
            console.log('❌ Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
            else {
                console.log("⚠️ You have been logged out. Please delete the auth_info_baileys folder and restart the server to scan QR again.");
            }
        }
        else if (connection === 'open') {
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
exports.whatsappService = {
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
    sendCustomMessage: async (chatId, message) => {
        if (!isClientReady || !sock) {
            console.log("⚠️ Cannot send WhatsApp: Client is not open");
            return false;
        }
        try {
            console.log(`📤 Attempting to send custom WhatsApp message to ${chatId}...`);
            await sock.sendMessage(chatId, { text: message });
            console.log(`✅ Custom WhatsApp message sent successfully to ${chatId}`);
            return true;
        }
        catch (error) {
            console.log("❌ WhatsApp custom send failed:", error.message || error);
            return false;
        }
    },
    /**
     * Send a WhatsApp message with shipment details
     */
    sendShipmentDetails: async (shipment) => {
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
        const message = `🚚 *SSD Packers & Movers*

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
        }
        catch (error) {
            console.log("❌ WhatsApp send failed:", error.message || error);
            return false;
        }
    }
};
