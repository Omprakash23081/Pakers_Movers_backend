import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const inspectUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected');
        
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        const users = await db.collection('users').find().toArray();
        console.log(`Total Users in 'users' collection: ${users.length}`);
        
        if (users.length > 0) {
            console.log('Sample User Data (first user):');
            console.log(JSON.stringify(users[0], null, 2));
            
            console.log('\nAll Usernames:');
            users.forEach((u, i) => {
                console.log(`${i+1}: _id=${u._id}, username=${u.username}, email=${u.email}, name=${u.name}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inspectUsers();
