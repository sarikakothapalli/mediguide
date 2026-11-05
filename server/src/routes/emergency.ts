import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import SymptomCheck from '../models/SymptomCheck.js';
import { localStore } from '../services/localStore.js';

const router = Router();

function validLocation(body: any): body is { lat: number; lng: number } {
  return Number.isFinite(body?.lat) && Number.isFinite(body?.lng)
    && body.lat >= -90 && body.lat <= 90 && body.lng >= -180 && body.lng <= 180;
}

function buildDispatch(lat: number, lng: number, user: any, latestCheck: any, symptomSeverity?: string, name?: string) {
  return {
    dispatchId: `AMB-${Date.now()}`,
    status: 'dispatched',
    etaMinutes: Math.floor(Math.random() * 5) + 8,
    userLocation: { lat, lng },
    ambulanceStart: { lat: lat + 0.02 + Math.random() * 0.01, lng: lng + 0.02 + Math.random() * 0.01 },
    emergencySummary: {
      name: user?.name || name || 'Guest User',
      bloodGroup: user?.bloodGroup || 'Not set',
      allergies: user?.allergies?.length ? user.allergies.join(', ') : 'None reported',
      preExistingConditions: user?.preExistingConditions?.length ? user.preExistingConditions.join(', ') : 'None reported',
      currentSeverity: symptomSeverity || latestCheck?.severity || 'unknown',
      primarySymptom: latestCheck?.primarySymptom || 'Not assessed',
      timestamp: new Date().toISOString(),
    },
    message: 'Mock ambulance dispatched. In a real emergency, call 108 immediately.',
  };
}

router.post('/dispatch', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, symptomSeverity } = req.body ?? {};
    if (!validLocation(req.body)) {
      res.status(400).json({ error: 'Valid latitude and longitude are required' });
      return;
    }

    let user: any;
    let latestCheck: any;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.userId);
      latestCheck = await SymptomCheck.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    } else {
      user = localStore.findUserById(req.userId!);
      latestCheck = localStore.latestSymptomCheck(req.userId!);
    }
    res.json(buildDispatch(lat, lng, user, latestCheck, symptomSeverity));
  } catch (err) {
    console.error('Dispatch failed:', err);
    res.status(500).json({ error: 'Dispatch failed' });
  }
});

router.post('/dispatch/guest', (req, res: Response) => {
  const { lat, lng, symptomSeverity, name } = req.body ?? {};
  if (!validLocation(req.body)) {
    res.status(400).json({ error: 'Valid latitude and longitude are required' });
    return;
  }
  res.json(buildDispatch(lat, lng, null, null, symptomSeverity, name));
});

export default router;
