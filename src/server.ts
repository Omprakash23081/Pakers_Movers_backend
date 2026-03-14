import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Route Imports
import authRoutes from './routes/authRoutes';
import quoteRoutes from './routes/quoteRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';
import pricingRoutes from './routes/pricingRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pricing', pricingRoutes);

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('SSD Packers & Movers API is running...');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
