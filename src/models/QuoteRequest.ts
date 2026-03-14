import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  serviceType: string;
  message: string;
  status: 'pending' | 'contacted' | 'converted' | 'cancelled' | 'shipped';
  createdAt: Date;
}

const QuoteRequestSchema: Schema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  movingFrom: { type: String },
  movingTo: { type: String },
  serviceType: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'converted', 'cancelled', 'shipped'], default: 'pending' },
}, { timestamps: true });

// Export the model
if (mongoose.models.QuoteRequest) {
  delete mongoose.models.QuoteRequest;
}

export default mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
