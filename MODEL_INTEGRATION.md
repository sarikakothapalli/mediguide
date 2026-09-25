# MediGuide symptom model integration

The standalone REST application returns both deterministic severity rules and trained-model possibilities when a symptom assessment is submitted.

## Runtime behavior

1. `POST /api/symptoms/assess` or `/api/symptoms/assess/guest` evaluates emergency/red-flag rules.
2. A separate multinomial logistic-regression inference ranks likely model labels from symptom features.
3. The response includes `severity`, `specialty`, `reasoning`, `redFlags`, and `diseasePrediction` (`predictions`, `usedSymptoms`, `unknownSymptoms`, `modelAvailable`).
4. The client shows the top three statistical possibilities with an explicit non-diagnosis notice.

Deterministic red flags remain authoritative. A model score must never override emergency guidance.

## Source files

- `server/src/data/symptomDiseaseModel.json` — exported coefficients, intercepts, vocabulary, and labels.
- `server/src/services/diseasePredictor.ts` — TypeScript inference implementation.
- `server/src/routes/symptoms.ts` — REST assessment and model integration.
- `client/src/pages/SymptomCheck.tsx` — result display.
- `server/src/services/diseasePredictor.test.ts` — model regression tests.

## Run and validate

```bash
npm ci --prefix server
npm ci --prefix client
npm run check
npm run test
npm run dev
```

Open `http://localhost:5173/symptoms`, complete the assessment, and choose **Get Assessment**. The result card shows **Model-based possibilities** when a supported feature was selected.

This is a demonstration model and not a diagnostic device. Outputs may be incorrect or incomplete and should not guide treatment decisions.
