import mongoose, { Schema, Document } from 'mongoose';

export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

export interface ISymptomCheck extends Document {
  userId: mongoose.Types.ObjectId;
  primarySymptom: string;
  answers: Record<string, string | number | boolean>;
  severity: Severity;
  specialty: string;
  reasoning: string;
  redFlags: string[];
  createdAt: Date;
}

const symptomCheckSchema = new Schema<ISymptomCheck>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    primarySymptom: { type: String, required: true },
    answers: { type: Schema.Types.Mixed, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'critical'], required: true },
    specialty: { type: String, required: true },
    reasoning: { type: String, required: true },
    redFlags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ISymptomCheck>('SymptomCheck', symptomCheckSchema);
