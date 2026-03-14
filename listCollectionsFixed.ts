import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const listAllCollectionsFixed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established properly');
        }
        
        const collections = await db.listCollections().toArray();
        console.log('Collections:');
        collections.forEach(c => console.log(`- ${c.name}`));
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listAllCollectionsFixed();
