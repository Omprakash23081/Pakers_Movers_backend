import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const checkSpecificAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const user = await User.findOne({ username: 'admin' });
        if (user) {
            console.log('Found user with username "admin"');
        } else {
            console.log('No user with username "admin" found.');
        }
        
        const allUsernames = await User.find({}, 'username').lean();
        console.log('All usernames in database:', allUsernames.map(u => u.username));
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkSpecificAdmin();
