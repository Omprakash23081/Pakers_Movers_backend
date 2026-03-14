import mongoose from 'mongoose';
import dotenv from 'dotenv';
import QuoteRequest from './src/models/QuoteRequest';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const count = await QuoteRequest.countDocuments();
        console.log(`Total Quote Requests: ${count}`);
        
        if (count > 0) {
            const latest = await QuoteRequest.find().sort({ createdAt: -1 }).limit(5);
            console.log('Latest 5 Quote Requests:');
            latest.forEach(q => {
                console.log(`- ${q.firstName} ${q.lastName} (${q.phone}) - ${q.status}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
