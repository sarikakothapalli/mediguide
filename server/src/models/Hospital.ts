import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  lat: number;
  lng: number;
  specialties: string[];
  tier: 'multi-specialty' | 'specialty' | 'clinic' | 'pharmacy';
  rating: number;
  phone: string;
  address: string;
  openNow: boolean;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  type: { type: String, enum: ['hospital', 'clinic', 'pharmacy'], required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  specialties: { type: [String], default: [] },
  tier: { type: String, enum: ['multi-specialty', 'specialty', 'clinic', 'pharmacy'], required: true },
  rating: { type: Number, default: 4.0 },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  openNow: { type: Boolean, default: true },
});

export default mongoose.model<IHospital>('Hospital', hospitalSchema);
