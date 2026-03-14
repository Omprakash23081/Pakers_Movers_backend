"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = void 0;
const whatsapp_web_js_1 = __importDefault(require("whatsapp-web.js"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const { Client, LocalAuth } = whatsapp_web_js_1.default;
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
    qrcode_terminal_1.default.generate(qr, { small: true });
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
exports.whatsappService = {
    /**
     * Send a WhatsApp message with shipment details
     */
    sendShipmentDetails: async (shipment) => {
        // Format number: should be 919876543210@c.us
        // Removing any non-digit characters and ensuring it ends with @c.us
        let cleanPhone = shipment.customerPhone.replace(/\D/g, '');
        // If it doesn't start with 91 (India) and is 10 digits, prepend 91
        if (cleanPhone.length === 10) {
            cleanPhone = '91' + cleanPhone;
        }
        const number = cleanPhone + "@c.us";
        const message = `🚚 *Shipment Created Successfully*\n\n` +
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
        }
        catch (error) {
            console.log("❌ WhatsApp send failed", error);
            return false;
        }
    }
};
