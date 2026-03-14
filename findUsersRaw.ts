import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const findUsersRaw = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const users = await User.find().lean();
        console.log(`Total Users: ${users.length}`);
        
        if (users.length > 0) {
            console.log('User 1 Data:', JSON.stringify(users[0], null, 2));
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

findUsersRaw();
