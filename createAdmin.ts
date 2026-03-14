import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const createDefaultAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const username = 'admin';
        const password = 'adminpassword123';
        
        // Remove anyway if it existed as undefined or similar
        await User.deleteOne({ username });
        
        const admin = await User.create({
            username,
            password
        });
        
        console.log(`Default admin created:`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createDefaultAdmin();
