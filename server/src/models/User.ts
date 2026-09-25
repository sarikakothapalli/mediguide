import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age?: number;
  bloodGroup?: string;
  allergies: string[];
  preExistingConditions: string[];
  isPregnant?: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    bloodGroup: { type: String },
    allergies: { type: [String], default: [] },
    preExistingConditions: { type: [String], default: [] },
    isPregnant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
