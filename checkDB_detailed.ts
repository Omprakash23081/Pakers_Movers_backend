import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QuoteRequest from './src/models/QuoteRequest';

dotenv.config();

const checkDBDetailed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const quotes = await QuoteRequest.find().lean();
        console.log(`Total Quote Requests: ${quotes.length}`);
        
        quotes.forEach((q, i) => {
            console.log(`Quote ${i + 1}:`, JSON.stringify(q, null, 2));
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDBDetailed();
