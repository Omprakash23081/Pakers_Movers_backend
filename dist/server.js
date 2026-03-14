"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const quoteRoutes_1 = __importDefault(require("./routes/quoteRoutes"));
const shipmentRoutes_1 = __importDefault(require("./routes/shipmentRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const pricingRoutes_1 = __importDefault(require("./routes/pricingRoutes"));
dotenv_1.default.config();
console.log("server is running");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/quotes', quoteRoutes_1.default);
app.use('/api/shipments', shipmentRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/pricing', pricingRoutes_1.default);
// Root route
app.get('/', (req, res) => {
    res.send('SSD Packers & Movers API is running...');
});
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
const whatsappService_1 = require("./services/whatsappService");
// QR Code for browser scanning
app.get('/qr', (req, res) => {
    const isReady = whatsappService_1.whatsappService.isReady();
    const qrDataURL = whatsappService_1.whatsappService.getLatestQR();
    if (isReady) {
        return res.status(200).send(`
            <html>
                <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; background:#f0f2f5;">
                    <div style="background:white; padding:40px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center;">
                        <h1 style="color:#25d366;">✅ WhatsApp Connected</h1>
                        <p>Your session is active and ready to send messages.</p>
                        <button onclick="location.href='/'" style="margin-top:20px; padding:10px 20px; background:#25d366; color:white; border:none; border-radius:5px; cursor:pointer;">Go to Dashboard</button>
                    </div>
                </body>
            </html>
        `);
    }
    if (!qrDataURL) {
        return res.status(200).send(`
            <html>
                <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; background:#f0f2f5;">
                    <div style="background:white; padding:40px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center;">
                        <h1 style="color:#54656f;">⏳ Initializing WhatsApp...</h1>
                        <p>Generating a new QR code. Please wait.</p>
                        <p style="font-size:12px; color:#8696a0;">The QR code will appear here automatically.</p>
                        <script>setTimeout(() => location.reload(), 3000);</script>
                    </div>
                </body>
            </html>
        `);
    }
    res.status(200).send(`
        <html>
            <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; background:#f0f2f5; margin:0;">
                <div style="background:white; padding:40px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center; max-width:400px;">
                    <h1 style="color:#25d366; margin-bottom:10px;">SSD Packers & Movers</h1>
                    <h2 style="margin-top:0; color:#54656f;">WhatsApp Session Scan</h2>
                    <p style="color:#54656f;">Open WhatsApp on your phone and scan this code:</p>
                    <div style="margin:30px 0; padding:15px; border:1px solid #e1e9eb; display:inline-block; background:white; border-radius:8px;">
                        <img src="${qrDataURL}" width="300" height="300" alt="WhatsApp QR Code" style="display:block;" />
                    </div>
                    <p style="font-size:14px; color:#8696a0;">This QR code will update automatically when a new session is requested.</p>
                    <script>
                        // Auto refresh every 45 seconds to catch new QR codes
                        setTimeout(() => location.reload(), 45000);
                    </script>
                </div>
            </body>
        </html>
    `);
});
// Error protection
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
// Start server
const startServer = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI, {
            autoIndex: false
        });
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};
startServer();
