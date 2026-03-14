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
