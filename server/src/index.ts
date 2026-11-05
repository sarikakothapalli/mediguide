import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import symptomRoutes from './routes/symptoms.js';
import hospitalRoutes from './routes/hospitals.js';
import emergencyRoutes from './routes/emergency.js';
import advisoryRoutes from './routes/advisories.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediguide';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const clientBuildPath = path.join(projectRoot, 'client', 'dist');

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'MediGuide API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'json-fallback',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/profile', profileRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'), (error) => error && next(error));
  });
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB');
  } catch {
    console.warn('MongoDB unavailable — using bundled JSON facility data and local JSON account/history storage.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediGuide server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Unable to start MediGuide server:', error);
  process.exitCode = 1;
});
