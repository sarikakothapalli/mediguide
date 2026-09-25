import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import hospitalsData from '../data/hospitals.json';

export interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  rating: number;
  website: string;
  distance?: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const hospitalsRouter = router({
  /**
   * Get all hospitals, optionally filtered by specialty and sorted by distance
   * Public endpoint - no login required
   */
  list: publicProcedure
    .input(
      z.object({
        specialty: z.string().optional(),
        userLatitude: z.number().optional(),
        userLongitude: z.number().optional(),
      })
    )
    .query(({ input }) => {
      let hospitals: Hospital[] = [...hospitalsData.hospitals];

      // Filter by specialty if provided
      if (input.specialty) {
        hospitals = hospitals.filter((h) =>
          h.specialties.some((s) => s.toLowerCase().includes(input.specialty!.toLowerCase()))
        );
      }

      // Calculate distance if user location is provided
      if (input.userLatitude !== undefined && input.userLongitude !== undefined) {
        hospitals = hospitals.map((h) => ({
          ...h,
          distance: calculateDistance(input.userLatitude!, input.userLongitude!, h.latitude, h.longitude),
        }));

        // Sort by distance
        hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      return hospitals;
    }),

  /**
   * Get a single hospital by ID
   * Public endpoint - no login required
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const hospital = hospitalsData.hospitals.find((h) => h.id === input.id);
      return hospital || null;
    }),

  /**
   * Get all unique specialties available in the hospital database
   * Public endpoint - no login required
   */
  getSpecialties: publicProcedure.query(() => {
    const specialties = new Set<string>();
    hospitalsData.hospitals.forEach((h) => {
      h.specialties.forEach((s) => specialties.add(s));
    });
    return Array.from(specialties).sort();
  }),

  /**
   * Get hospitals near a location with a radius filter
   * Public endpoint - no login required
   */
  getNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(5),
        specialty: z.string().optional(),
      })
    )
    .query(({ input }) => {
      let hospitals: Hospital[] = [...hospitalsData.hospitals];

      // Filter by specialty if provided
      if (input.specialty) {
        hospitals = hospitals.filter((h) =>
          h.specialties.some((s) => s.toLowerCase().includes(input.specialty!.toLowerCase()))
        );
      }

      // Calculate distance and filter by radius
      hospitals = hospitals
        .map((h) => ({
          ...h,
          distance: calculateDistance(input.latitude, input.longitude, h.latitude, h.longitude),
        }))
        .filter((h) => h.distance! <= input.radiusKm)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return hospitals;
    }),
});
