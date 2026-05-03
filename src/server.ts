import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import quoteRoutes from './routes/quoteRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';
import pricingRoutes from './routes/pricingRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

dotenv.config();

console.log("server is running");


const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('SSD Packers & Movers API is running...');
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

import { whatsappService } from './services/whatsappService';

// QR Code for browser scanning
app.get('/qr', (req: Request, res: Response) => {
    const isReady = whatsappService.isReady();
    const qrDataURL = whatsappService.getLatestQR();
    
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

        await mongoose.connect(process.env.MONGODB_URI as string, {
            autoIndex: false
        });

        console.log('MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error: any) {

        console.error('Database connection failed:', error.message);
        process.exit(1);

    }
};

startServer();