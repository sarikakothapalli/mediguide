import { describe, expect, it } from 'vitest';
import { appRouter } from '../routers';

describe('symptoms router', () => {
  const caller = () => appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

  it('lists configured symptoms', async () => {
    const result = await caller().symptoms.list();
    expect(result.length).toBeGreaterThan(5);
    expect(result.some((item) => item.id === 'chest_pain')).toBe(true);
  });

  it('classifies chest pain with breathing difficulty as critical', async () => {
    const result = await caller().symptoms.assess({
      symptom: 'Chest Pain',
      onset: 'sudden',
      duration: '1-3_hours',
      associatedSymptoms: ['difficulty_breathing', 'sweating'],
      painScale: 9,
    });
    expect(result.severity).toBe('critical');
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.diseasePrediction.modelAvailable).toBe(true);
    expect(result.diseasePrediction.predictions.length).toBe(3);
    expect(result.diseasePrediction.predictions[0]?.disease).toBeTruthy();
  });
});
