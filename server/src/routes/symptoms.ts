import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import SymptomCheck from '../models/SymptomCheck.js';
import {
  classifySymptoms,
  followUpQuestions,
  primarySymptoms,
} from '../engine/severityClassifier.js';
import { predictDiseases } from '../services/diseasePredictor.js';
import { localStore } from '../services/localStore.js';

const router = Router();

function validAssessment(body: any): body is { primarySymptom: string; answers: Record<string, unknown> } {
  return typeof body?.primarySymptom === 'string'
    && Boolean(followUpQuestions[body.primarySymptom])
    && body.answers !== null
    && typeof body.answers === 'object'
    && !Array.isArray(body.answers);
}

function buildResult(primarySymptom: string, answers: Record<string, unknown>) {
  const result = classifySymptoms(primarySymptom, answers);
  const diseasePrediction = predictDiseases([primarySymptom, ...Object.entries(answers).filter(([, value]) => value === true).map(([key]) => key)]);
  return { ...result, diseasePrediction };
}

router.get('/primary', (_req, res: Response) => {
  res.json(primarySymptoms);
});

router.get('/questions/:symptomId', (req, res: Response) => {
  const questions = followUpQuestions[req.params.symptomId];
  if (!questions) {
    res.status(404).json({ error: 'Unknown symptom' });
    return;
  }
  res.json(questions);
});

router.post('/assess', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { primarySymptom, answers } = req.body ?? {};
    if (!validAssessment(req.body)) {
      res.status(400).json({ error: 'A valid primarySymptom and answers object are required' });
      return;
    }

    const result = buildResult(primarySymptom, answers);
    let id: string;
    if (mongoose.connection.readyState === 1) {
      const check = await SymptomCheck.create({
        userId: req.userId,
        primarySymptom,
        answers,
        severity: result.severity,
        specialty: result.specialty,
        reasoning: result.reasoning,
        redFlags: result.redFlags,
      });
      id = String(check._id);
    } else {
      const check = localStore.addSymptomCheck({
        userId: req.userId!,
        primarySymptom,
        answers,
        severity: result.severity,
        specialty: result.specialty,
        reasoning: result.reasoning,
        redFlags: result.redFlags,
      });
      id = check._id;
    }

    res.json({
      id,
      ...result,
      disclaimer: 'This is not a medical diagnosis. If you are in severe distress, call emergency services immediately.',
    });
  } catch (err) {
    console.error('Assessment failed:', err);
    res.status(500).json({ error: 'Assessment failed' });
  }
});

router.post('/assess/guest', (req, res: Response) => {
  const { primarySymptom, answers } = req.body ?? {};
  if (!validAssessment(req.body)) {
    res.status(400).json({ error: 'A valid primarySymptom and answers object are required' });
    return;
  }

  const result = buildResult(primarySymptom, answers);
  res.json({
    ...result,
    disclaimer: 'This is not a medical diagnosis. If you are in severe distress, call emergency services immediately.',
  });
});

export default router;
