import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  fullName: string;
  email?: string;
  phone: string;
  rating: number;
  message: string;
  createdAt: Date;
}

const feedbackSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
