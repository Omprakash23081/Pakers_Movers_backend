import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const findUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const users = await User.find().lean();
        console.log(`Total Users: ${users.length}`);
        
        users.forEach((u, i) => {
            console.log(`User ${i + 1}: username="${u.username}"`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findUsers();
