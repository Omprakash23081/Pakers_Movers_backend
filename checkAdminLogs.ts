import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkAdminLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');

        const db = mongoose.connection.db;
        if (!db) throw new Error('DB undefined');

        const logs = await db.collection('adminlogs').find({}).limit(10).toArray();
        console.log(`Checking 'adminlogs' collection... Found ${logs.length} logs.`);

        logs.forEach((log, i) => {
            console.log(`Log ${i + 1}:`, JSON.stringify(log, null, 2));
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdminLogs();
