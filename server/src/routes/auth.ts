import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { localStore, type LocalUser } from '../services/localStore.js';

const router = Router();

function issueToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'mediguide-dev-secret', { expiresIn: '7d' });
}

function publicUser(user: { _id?: unknown; id?: string; email: string; name: string; age?: number; bloodGroup?: string; allergies?: string[]; preExistingConditions?: string[]; isPregnant?: boolean }) {
  return {
    id: user.id ?? String(user._id),
    email: user.email,
    name: user.name,
    age: user.age,
    bloodGroup: user.bloodGroup,
    allergies: user.allergies ?? [],
    preExistingConditions: user.preExistingConditions ?? [],
    isPregnant: user.isPregnant ?? false,
  };
}

router.post('/register', async (req, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ error: 'Enter a valid email address' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }
      const user = await User.create({ email, password: hashed, name });
      res.status(201).json({ token: issueToken(String(user._id)), user: publicUser(user) });
      return;
    }

    if (localStore.findUserByEmail(email)) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const user: LocalUser = localStore.createUser({ email, password: hashed, name });
    res.status(201).json({ token: issueToken(user.id), user: publicUser(user) });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res: Response) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = mongoose.connection.readyState === 1
      ? await User.findOne({ email })
      : localStore.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userId = mongoose.connection.readyState === 1 ? String((user as { _id: unknown })._id) : (user as LocalUser).id;
    res.json({ token: issueToken(userId), user: publicUser(user) });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
