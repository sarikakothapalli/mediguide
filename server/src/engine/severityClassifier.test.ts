import assert from 'node:assert/strict';
import test from 'node:test';
import { classifySymptoms, followUpQuestions, primarySymptoms } from './severityClassifier.js';

test('lists supported primary symptoms and follow-up questions', () => {
  assert.ok(primarySymptoms.some((symptom) => symptom.id === 'chest_pain'));
  assert.ok(followUpQuestions.chest_pain.length >= 3);
});

test('flags chest pain with radiation and shortness of breath as critical', () => {
  const result = classifySymptoms('chest_pain', { radiatingPain: true, shortnessOfBreath: true });
  assert.equal(result.severity, 'critical');
  assert.equal(result.specialty, 'cardiology');
  assert.ok(result.redFlags.length > 0);
});

test('returns a conservative default for less specific answers', () => {
  const result = classifySymptoms('fever', {});
  assert.equal(result.severity, 'mild');
  assert.ok(result.reasoning.length > 0);
});
