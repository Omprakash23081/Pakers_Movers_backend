import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const QuoteRequestSchema = new mongoose.Schema({
  status: String,
});

const QuoteRequest = mongoose.models.QuoteRequest || mongoose.model('QuoteRequest', QuoteRequestSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
    
    const stats = await QuoteRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    console.log('Status Counts:', JSON.stringify(stats, null, 2));
    
    const allQuotes = await QuoteRequest.find({}).limit(5);
    console.log('Sample Quotes:', JSON.stringify(allQuotes, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
