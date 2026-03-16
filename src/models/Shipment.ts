import mongoose, { Schema, Document } from 'mongoose';

export interface IShipmentUpdate {
  location: string;
  status: string;
  timestamp: Date;
}

export interface IShipment extends Document {
  trackingId: string;
  customerName: string;
  customerPhone: string;
  origin: string;
  destination: string;
  currentStatus: 'booked' | 'packing' | 'in_transit' | 'out_for_delivery' | 'delivered';
  updates: IShipmentUpdate[];
  estimatedDelivery: Date;
  isDeleted: boolean;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  locationLink?: string;
  createdAt: Date;
}

const ShipmentSchema: Schema = new Schema({
  trackingId: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  currentStatus: { 
    type: String, 
    enum: ['booked', 'packing', 'in_transit', 'out_for_delivery', 'delivered'],
    default: 'booked'
  },
  updates: [{
    location: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  estimatedDelivery: { type: Date },
  isDeleted: { type: Boolean, default: false },
  driverName: { type: String },
  driverPhone: { type: String },
  vehicleNumber: { type: String },
  locationLink: { type: String }
}, { timestamps: true });

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', ShipmentSchema);
