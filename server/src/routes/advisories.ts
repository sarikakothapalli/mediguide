import { Router, Response } from 'express';
import mongoose from 'mongoose';
import advisories from '../data/seasonalAdvisories.json' with { type: 'json' };
import { optionalAuth, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import { localStore } from '../services/localStore.js';

const router = Router();

interface Advisory {
  id: string;
  month: number[];
  region: string;
  icon: string;
  title: string;
  summary: string;
  details: string;
  tags: string[];
}

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const month = req.query.month ? Number.parseInt(req.query.month as string, 10) : new Date().getMonth() + 1;
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      res.status(400).json({ error: 'Month must be a number from 1 to 12' });
      return;
    }
    const region = typeof req.query.region === 'string' ? req.query.region.toLowerCase() : 'hyderabad';

    let userTags: string[] = [];
    if (req.userId) {
      const user = mongoose.connection.readyState === 1
        ? await User.findById(req.userId)
        : localStore.findUserById(req.userId);
      if (user) {
        if (user.age && user.age >= 60) userTags.push('elderly');
        if (user.age && user.age < 12) userTags.push('children');
        if (user.isPregnant) userTags.push('pregnancy');
        if (user.preExistingConditions?.length) userTags.push('chronic');
      }
    }

    const filtered = (advisories as Advisory[]).filter((advisory) => {
      if (!advisory.month.includes(month) || (advisory.region !== region && advisory.region !== 'india')) return false;
      if (advisory.tags.length === 0 || userTags.length === 0) return true;
      return advisory.tags.some((tag) => userTags.includes(tag));
    });
    res.json(filtered);
  } catch (err) {
    console.error('Failed to fetch advisories:', err);
    res.status(500).json({ error: 'Failed to fetch advisories' });
  }
});

export default router;
