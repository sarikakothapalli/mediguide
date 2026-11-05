import { describe, expect, it } from 'vitest';
import { appRouter } from '../routers';

describe('advisories router', () => {
  it('returns current-season advisories publicly', async () => {
    const result = await appRouter.createCaller({ user: null, req: {} as never, res: {} as never }).advisories.getCurrent();
    expect(result.season).toMatch(/^(monsoon|summer|winter|all)$/);
    expect(result.advisories.length).toBeGreaterThan(0);
    expect(result.advisories.every((item) => item.title && item.tips.length > 0)).toBe(true);
  });

  it('filters advisories by matching health flags while retaining general advice', async () => {
    const result = await appRouter.createCaller({ user: null, req: {} as never, res: {} as never }).advisories.getByFlags({ flags: ['asthma'], season: 'winter' });
    expect(result.some((item) => item.healthFlags.includes('asthma'))).toBe(true);
    expect(result.some((item) => item.healthFlags.length === 0)).toBe(true);
  });
});
