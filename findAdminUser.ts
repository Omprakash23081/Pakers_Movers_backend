import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const findAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const db = mongoose.connection.db;
        if (!db) throw new Error('DB undefined');
        
        const users = await db.collection('users').find({}).toArray();
        console.log(`Searching through ${users.length} users...`);
        
        for (const u of users) {
             if (u.username) {
                 console.log(`Found candidate user with username: ${u.username}`);
             }
             if (u.email && u.email.includes('admin')) {
                 console.log(`Found candidate user with email: ${u.email}`);
             }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findAdminUser();
