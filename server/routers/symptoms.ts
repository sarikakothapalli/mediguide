import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { classifier } from '../services/severity_classifier';
import { predictDiseases } from '../services/disease_predictor';
import symptomRulesData from '../data/symptom_rules.json';

const assessmentInput = z.object({
  symptom: z.string().min(1),
  onset: z.enum(['sudden', 'gradual']),
  duration: z.string().min(1),
  associatedSymptoms: z.array(z.string()).default([]),
  painScale: z.number().int().min(1).max(10),
});

export const symptomsRouter = router({
  list: publicProcedure.query(() =>
    symptomRulesData.symptoms.map(({ id, name, specialties }) => ({ id, name, specialties })),
  ),

  assess: publicProcedure.input(assessmentInput).mutation(({ input }) => {
    const assessment = classifier.assess(input);
    const diseasePrediction = predictDiseases([input.symptom, ...input.associatedSymptoms]);
    return {
      ...assessment,
      diseasePrediction,
    };
  }),
});
