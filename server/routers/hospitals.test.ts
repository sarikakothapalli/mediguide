import { describe, it, expect } from 'vitest';
import { hospitalsRouter } from './hospitals';

describe('Hospitals Router', () => {
  describe('Distance calculation', () => {
    it('should return hospitals sorted by distance', async () => {
      const caller = hospitalsRouter.createCaller({});

      // Hyderabad city center coordinates
      const result = await caller.list({
        userLatitude: 17.3850,
        userLongitude: 78.4867,
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // Check that distances are calculated
      const hospitalsWithDistance = result.filter((h) => h.distance !== undefined);
      expect(hospitalsWithDistance.length).toBeGreaterThan(0);

      // Check that results are sorted by distance
      for (let i = 1; i < hospitalsWithDistance.length; i++) {
        expect(hospitalsWithDistance[i].distance).toBeGreaterThanOrEqual(
          hospitalsWithDistance[i - 1].distance || 0
        );
      }
    });
  });

  describe('Specialty filtering', () => {
    it('should filter hospitals by specialty', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.list({
        specialty: 'Cardiology',
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // All results should have Cardiology in specialties
      result.forEach((hospital) => {
        expect(
          hospital.specialties.some((s) => s.toLowerCase().includes('cardiology'))
        ).toBe(true);
      });
    });

    it('should return empty array for non-existent specialty', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.list({
        specialty: 'NonExistentSpecialty123',
      });

      expect(result).toEqual([]);
    });
  });

  describe('Get specialties', () => {
    it('should return all unique specialties', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.getSpecialties();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Cardiology');
      expect(result).toContain('General Practitioner');

      // Verify they are sorted alphabetically
      const sorted = [...result].sort();
      expect(result).toEqual(sorted);
    });
  });

  describe('Get nearby hospitals', () => {
    it('should return hospitals within radius', async () => {
      const caller = hospitalsRouter.createCaller({});

      // Secunderabad area
      const result = await caller.getNearby({
        latitude: 17.3850,
        longitude: 78.4867,
        radiusKm: 5,
      });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // All results should be within 5km
      result.forEach((hospital) => {
        expect(hospital.distance).toBeLessThanOrEqual(5);
      });
    });

    it('should filter nearby hospitals by specialty', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.getNearby({
        latitude: 17.3850,
        longitude: 78.4867,
        radiusKm: 10,
        specialty: 'Orthopedics',
      });

      expect(result).toBeDefined();

      // All results should have Orthopedics
      result.forEach((hospital) => {
        expect(
          hospital.specialties.some((s) => s.toLowerCase().includes('orthopedics'))
        ).toBe(true);
      });
    });
  });

  describe('Get hospital by ID', () => {
    it('should return hospital by ID', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.getById({
        id: 'apollo_hyderabad',
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe('Apollo Hospitals Hyderabad');
      expect(result?.specialties).toContain('Cardiology');
    });

    it('should return null for non-existent ID', async () => {
      const caller = hospitalsRouter.createCaller({});

      const result = await caller.getById({
        id: 'non_existent_id',
      });

      expect(result).toBeNull();
    });
  });
});
