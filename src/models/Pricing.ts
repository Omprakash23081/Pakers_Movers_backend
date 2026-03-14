import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingTier {
  type: string;
  costs: {
    upTo50km: string;
    upTo500km: string;
    upTo1000km: string;
    upTo1500km: string;
    upTo2500km: string;
  };
}

export interface IPricing extends Document {
  category: string; // 'house', 'office', 'vehicle'
  tiers: IPricingTier[];
}

const PricingSchema: Schema = new Schema({
  category: { type: String, required: true, unique: true },
  tiers: [{
    type: { type: String, required: true },
    costs: {
      upTo50km: { type: String, required: true },
      upTo500km: { type: String, required: true },
      upTo1000km: { type: String, required: true },
      upTo1500km: { type: String, required: true },
      upTo2500km: { type: String, required: true }
    }
  }]
}, {
  timestamps: true,
});

export default mongoose.model<IPricing>('Pricing', PricingSchema);
