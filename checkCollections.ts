import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');
        collections.forEach(c => console.log(`- ${c.name}`));
        
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCollections();
