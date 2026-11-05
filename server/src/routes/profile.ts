import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import SymptomCheck from '../models/SymptomCheck.js';
import { localStore } from '../services/localStore.js';

const router = Router();

function publicUser(user: any) {
  const value = typeof user.toObject === 'function' ? user.toObject() : user;
  const { password: _password, __v: _version, ...safeUser } = value;
  return safeUser;
}

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = mongoose.connection.readyState === 1
      ? await User.findById(req.userId).select('-password')
      : localStore.findUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(publicUser(user));
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, age, bloodGroup, allergies, preExistingConditions, isPregnant } = req.body ?? {};
    if (age !== undefined && (!Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 130)) {
      res.status(400).json({ error: 'Age must be a whole number from 0 to 130' });
      return;
    }
    if (allergies !== undefined && (!Array.isArray(allergies) || !allergies.every((item) => typeof item === 'string'))) {
      res.status(400).json({ error: 'Allergies must be a list of strings' });
      return;
    }
    if (preExistingConditions !== undefined && (!Array.isArray(preExistingConditions) || !preExistingConditions.every((item) => typeof item === 'string'))) {
      res.status(400).json({ error: 'Pre-existing conditions must be a list of strings' });
      return;
    }

    const updates = {
      ...(name !== undefined && { name: String(name).trim() }),
      ...(age !== undefined && { age: Number(age) }),
      ...(bloodGroup !== undefined && { bloodGroup: String(bloodGroup) }),
      ...(allergies !== undefined && { allergies }),
      ...(preExistingConditions !== undefined && { preExistingConditions }),
      ...(isPregnant !== undefined && { isPregnant: Boolean(isPregnant) }),
    };

    const user = mongoose.connection.readyState === 1
      ? await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true }).select('-password')
      : localStore.updateUser(req.userId!, updates);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(publicUser(user));
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const history = mongoose.connection.readyState === 1
      ? await SymptomCheck.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50).lean()
      : localStore.symptomHistory(req.userId!);
    res.json(history);
  } catch (err) {
    console.error('Failed to fetch history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
