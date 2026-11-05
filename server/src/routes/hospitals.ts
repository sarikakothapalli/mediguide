import { Router, Response } from 'express';
import mongoose from 'mongoose';
import fallbackHospitals from '../data/hospitalsFallback.json' with { type: 'json' };

const router = Router();

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface HospitalRecord {
  _id?: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  specialties: string[];
  tier: string;
  rating: number;
  phone: string;
  address: string;
  openNow: boolean;
  distance?: number;
}

async function fetchHospitals(): Promise<HospitalRecord[]> {
  if (mongoose.connection.readyState !== 1) {
    return fallbackHospitals.map((h, i) => ({ ...h, _id: `fallback-${i}` }));
  }
  try {
    const Hospital = (await import('../models/Hospital.js')).default;
    const count = await Hospital.countDocuments();
    if (count > 0) {
      return await Hospital.find().lean() as unknown as HospitalRecord[];
    }
  } catch {
    // MongoDB unavailable
  }
  return fallbackHospitals.map((h, i) => ({ ...h, _id: `fallback-${i}` }));
}

router.get('/', async (req, res: Response) => {
  try {
    const { type, specialty, lat, lng, radius = '25', openNow, limit = '20' } = req.query;

    let hospitals = await fetchHospitals();

    if (type) hospitals = hospitals.filter((h) => h.type === type);
    if (specialty) hospitals = hospitals.filter((h) => h.specialties.includes(specialty as string));
    if (openNow === 'true') hospitals = hospitals.filter((h) => h.openNow);

    const userLat = lat ? parseFloat(lat as string) : null;
    const userLng = lng ? parseFloat(lng as string) : null;
    const maxRadius = parseFloat(radius as string);
    const maxResults = parseInt(limit as string, 10);

    let results = hospitals.map((h) => {
      let distance: number | null = null;
      if (userLat !== null && userLng !== null) {
        distance = haversineDistance(userLat, userLng, h.lat, h.lng);
      }
      return { ...h, distance };
    });

    if (userLat !== null && userLng !== null) {
      results = results.filter((h) => h.distance !== null && h.distance <= maxRadius);
      results.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    }

    if (specialty) {
      results.sort((a, b) => {
        const aMatch = a.specialties.includes(specialty as string) ? 0 : 1;
        const bMatch = b.specialties.includes(specialty as string) ? 0 : 1;
        if (aMatch !== bMatch) return aMatch - bMatch;
        return (a.distance ?? 999) - (b.distance ?? 999);
      });
    }

    res.json(results.slice(0, maxResults));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

router.get('/recommend', async (req, res: Response) => {
  try {
    const { specialty, lat, lng } = req.query;

    if (!specialty || !lat || !lng) {
      res.status(400).json({ error: 'specialty, lat, and lng are required' });
      return;
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);

    const hospitals = (await fetchHospitals()).filter((h) => h.type === 'hospital');

    const results = hospitals
      .map((h) => ({
        ...h,
        distance: haversineDistance(userLat, userLng, h.lat, h.lng),
        specialtyMatch: h.specialties.includes(specialty as string),
      }))
      .filter((h) => h.specialtyMatch || h.tier === 'multi-specialty')
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
