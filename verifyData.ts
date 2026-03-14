import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QuoteRequest from './src/models/QuoteRequest';

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const all = await QuoteRequest.find({});
        console.log(`Total Quotes: ${all.length}`);
        
        all.forEach(q => {
            console.log(`ID: ${q._id}, Name: ${q.firstName}, Status: '${q.status}'`);
        });
        
        const converted = await QuoteRequest.find({ status: { $regex: /^converted$/i } });
        console.log(`Converted Count (Regex): ${converted.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyData();
