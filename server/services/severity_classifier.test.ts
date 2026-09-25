import { describe, it, expect } from 'vitest';
import { classifier, SymptomAssessmentInput } from './severity_classifier';

describe('SeverityClassifier', () => {
  describe('Fever assessment', () => {
    it('should classify mild fever', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Fever',
        onset: 'gradual',
        duration: '1-3_days',
        associatedSymptoms: [],
        painScale: 2,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('mild');
      expect(result.specialty).toBe('General Practitioner');
    });

    it('should classify moderate fever', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Fever',
        onset: 'sudden',
        duration: '1-3_days',
        associatedSymptoms: [],
        painScale: 5,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('moderate');
    });

    it('should classify critical fever with red flags', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Fever',
        onset: 'sudden',
        duration: '3-7_days',
        associatedSymptoms: ['confusion', 'stiff_neck'],
        painScale: 9,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('critical');
      expect(result.redFlags.length).toBeGreaterThan(0);
    });
  });

  describe('Chest pain assessment', () => {
    it('should classify mild chest pain', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Chest Pain',
        onset: 'gradual',
        duration: 'under_1_hour',
        associatedSymptoms: [],
        painScale: 2,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('mild');
      expect(result.specialty).toBe('Cardiologist');
    });

    it('should classify critical chest pain with red flags', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Chest Pain',
        onset: 'sudden',
        duration: '1-3_hours',
        associatedSymptoms: ['difficulty_breathing', 'sweating', 'radiating_to_arm'],
        painScale: 9,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('critical');
      expect(result.specialty).toBe('Cardiologist');
    });
  });

  describe('Headache assessment', () => {
    it('should classify mild headache', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Headache',
        onset: 'gradual',
        duration: '1-3_hours',
        associatedSymptoms: [],
        painScale: 3,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('mild');
      expect(result.specialty).toBe('Neurologist');
    });

    it('should classify critical headache with meningitis signs', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Headache',
        onset: 'sudden',
        duration: '1-3_hours',
        associatedSymptoms: ['stiff_neck', 'fever', 'confusion'],
        painScale: 9,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('critical');
    });
  });

  describe('Difficulty breathing assessment', () => {
    it('should classify severe difficulty breathing', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Difficulty Breathing',
        onset: 'sudden',
        duration: 'over_3_hours',
        associatedSymptoms: ['chest_pain', 'fever'],
        painScale: 7,
      };

      const result = classifier.assess(input);
      expect(['severe', 'critical']).toContain(result.severity);
      expect(result.specialty).toBe('Pulmonologist');
    });
  });

  describe('Unknown symptom', () => {
    it('should handle unknown symptoms gracefully', () => {
      const input: SymptomAssessmentInput = {
        symptom: 'Unknown Symptom',
        onset: 'gradual',
        duration: '1-3_days',
        associatedSymptoms: [],
        painScale: 5,
      };

      const result = classifier.assess(input);
      expect(result.severity).toBe('moderate');
      expect(result.specialty).toBe('General Practitioner');
      expect(result.reasoning).toContain('Unable to find specific rules');
    });
  });
});
