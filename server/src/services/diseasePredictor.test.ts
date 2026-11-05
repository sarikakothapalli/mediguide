import assert from 'node:assert/strict';
import test from 'node:test';
import { predictDiseases } from './diseasePredictor.js';

test('returns three ranked model-based possibilities for supported symptoms', () => {
  const result = predictDiseases(['chest_pain', 'difficulty_breathing', 'sweating']);
  assert.equal(result.modelAvailable, true);
  assert.equal(result.predictions.length, 3);
  assert.ok(result.predictions[0].probability >= result.predictions[1].probability);
  assert.ok(result.predictions[1].probability >= result.predictions[2].probability);
  assert.ok(result.predictions.every((item) => item.probability >= 0 && item.probability <= 1));
});

test('returns no disease list when no selected symptom is in the model vocabulary', () => {
  const result = predictDiseases(['not_a_real_feature']);
  assert.equal(result.modelAvailable, true);
  assert.equal(result.predictions.length, 0);
  assert.deepEqual(result.unknownSymptoms, ['not_a_real_feature']);
});
