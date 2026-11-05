import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import advisoriesData from '../data/seasonal_advisories.json';

export const advisoriesRouter = router({
  /**
   * Get all seasonal advisories, optionally filtered by season
   * Public endpoint - no login required
   */
  list: publicProcedure
    .input(
      z.object({
        season: z.string().optional(),
      })
    )
    .query(({ input }) => {
      let advisories = [...advisoriesData.advisories];

      // Filter by season if provided
      if (input.season) {
        advisories = advisories.filter(
          (a) => a.season === input.season || a.season === 'all'
        );
      }

      return advisories;
    }),

  /**
   * Get advisories for the current season based on month
   * Public endpoint - no login required
   */
  getCurrent: publicProcedure.query(() => {
    const now = new Date();
    const month = now.getMonth() + 1;

    let currentSeason = 'all';
    if ([6, 7, 8, 9].includes(month)) {
      currentSeason = 'monsoon';
    } else if ([3, 4, 5].includes(month)) {
      currentSeason = 'summer';
    } else if ([11, 12, 1, 2].includes(month)) {
      currentSeason = 'winter';
    }

    const advisories = advisoriesData.advisories.filter(
      (a) => a.season === currentSeason || a.season === 'all'
    );

    return {
      season: currentSeason,
      month,
      advisories,
    };
  }),

  /**
   * Get advisories filtered by health flags
   * Public endpoint - no login required
   */
  getByFlags: publicProcedure
    .input(
      z.object({
        flags: z.array(z.string()).default([]),
        season: z.string().optional(),
      })
    )
    .query(({ input }) => {
      let advisories = [...advisoriesData.advisories];

      if (input.season) {
        advisories = advisories.filter(
          (a) => a.season === input.season || a.season === 'all'
        );
      }

      if (input.flags.length > 0) {
        advisories = advisories.filter((a) => {
          if (a.healthFlags.length === 0) return true;
          return a.healthFlags.some((flag) => input.flags.includes(flag));
        });
      }

      return advisories;
    }),

  /**
   * Get all available seasons
   * Public endpoint - no login required
   */
  getSeasons: publicProcedure.query(() => {
    return Object.entries(advisoriesData.seasons).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }),
});
