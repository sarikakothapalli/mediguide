import symptomRulesData from '../data/symptom_rules.json';

export interface SymptomAssessmentInput {
  symptom: string;
  onset: 'sudden' | 'gradual';
  duration: string;
  associatedSymptoms: string[];
  painScale: number;
}

export interface SymptomAssessmentResult {
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  specialty: string;
  redFlags: string[];
  reasoning: string;
}

class SeverityClassifier {
  private rules: typeof symptomRulesData;

  constructor() {
    this.rules = symptomRulesData;
  }

  /**
   * Assess symptom severity based on input parameters
   */
  assess(input: SymptomAssessmentInput): SymptomAssessmentResult {
    const symptomRule = this.findSymptomRule(input.symptom);
    
    if (!symptomRule) {
      return {
        severity: 'moderate',
        specialty: 'General Practitioner',
        redFlags: [],
        reasoning: `Unable to find specific rules for "${input.symptom}". Recommend consulting a General Practitioner.`,
      };
    }

    // Check for critical red flags first
    const detectedRedFlags = this.detectRedFlags(symptomRule, input);
    if (detectedRedFlags.length > 0) {
      return {
        severity: 'critical',
        specialty: symptomRule.specialties[0] || 'Emergency Medicine',
        redFlags: detectedRedFlags,
        reasoning: `Critical red flags detected: ${detectedRedFlags.join(', ')}. This requires immediate medical attention.`,
      };
    }

    // Determine severity based on rules
    const severity = this.determineSeverity(symptomRule, input);

    return {
      severity,
      specialty: symptomRule.specialties[0] || 'General Practitioner',
      redFlags: symptomRule.redFlags || [],
      reasoning: symptomRule.reasoning || `Assessment based on ${input.symptom} severity level.`,
    };
  }

  private findSymptomRule(symptom: string) {
    return this.rules.symptoms.find(
      (s) => s.name.toLowerCase() === symptom.toLowerCase() || s.id === symptom.toLowerCase()
    );
  }

  private detectRedFlags(
    symptomRule: (typeof this.rules.symptoms)[0],
    input: SymptomAssessmentInput
  ): string[] {
    const detectedFlags: string[] = [];

    // Check for specific red flag conditions
    if (symptomRule.redFlags) {
      for (const flag of symptomRule.redFlags) {
        if (this.matchesRedFlag(flag, input)) {
          detectedFlags.push(flag);
        }
      }
    }

    return detectedFlags;
  }

  private matchesRedFlag(flag: string, input: SymptomAssessmentInput): boolean {
    // Map red flag names to conditions
    const flagConditions: Record<string, boolean> = {
      'high_fever_over_40': false,
      'confusion': input.associatedSymptoms.includes('confusion'),
      'loss_of_consciousness': input.associatedSymptoms.includes('loss_of_consciousness'),
      'severe_headache_with_stiff_neck': 
        input.associatedSymptoms.includes('stiff_neck') && input.painScale >= 8,
      'difficulty_breathing': input.associatedSymptoms.includes('difficulty_breathing'),
      'blood_in_sputum': input.associatedSymptoms.includes('blood_in_sputum'),
      'severe_chest_pain': input.painScale >= 8 && input.symptom.toLowerCase().includes('chest'),
      'bluish_lips': input.associatedSymptoms.includes('bluish_lips'),
      'wheezing': input.associatedSymptoms.includes('wheezing'),
      'blood_in_stool': input.associatedSymptoms.includes('blood_in_stool'),
      'severe_vomiting': input.associatedSymptoms.includes('severe_vomiting'),
      'rigid_abdomen': input.associatedSymptoms.includes('rigid_abdomen'),
      'severe_dizziness': input.painScale >= 8,
      'severe_headache': input.painScale >= 8,
      'vision_changes': input.associatedSymptoms.includes('vision_changes'),
      'severe_sudden_headache': input.onset === 'sudden' && input.painScale >= 9,
      'stiff_neck_with_fever': 
        input.associatedSymptoms.includes('stiff_neck') && input.associatedSymptoms.includes('fever'),
      'radiating_to_arm': input.associatedSymptoms.includes('radiating_to_arm'),
      'sweating': input.associatedSymptoms.includes('sweating'),
      'severe_sore_throat': input.painScale >= 8,
      'difficulty_swallowing': input.associatedSymptoms.includes('difficulty_swallowing'),
      'widespread_rash': input.associatedSymptoms.includes('widespread_rash'),
      'rash_with_fever': 
        input.associatedSymptoms.includes('fever') && input.symptom.toLowerCase().includes('rash'),
    };

    return flagConditions[flag] || false;
  }

  private determineSeverity(
    symptomRule: (typeof this.rules.symptoms)[0],
    input: SymptomAssessmentInput
  ): 'mild' | 'moderate' | 'severe' | 'critical' {
    const severityRules = symptomRule.severityRules;

    // Check critical conditions
    if (this.matchesSeverityLevel(severityRules.critical, input)) {
      return 'critical';
    }

    // Check severe conditions
    if (this.matchesSeverityLevel(severityRules.severe, input)) {
      return 'severe';
    }

    // Check moderate conditions
    if (this.matchesSeverityLevel(severityRules.moderate, input)) {
      return 'moderate';
    }

    // Check mild conditions
    if (this.matchesSeverityLevel(severityRules.mild, input)) {
      return 'mild';
    }

    // Default to moderate if no specific match
    return 'moderate';
  }

  private matchesSeverityLevel(
    severityLevel: any,
    input: SymptomAssessmentInput
  ): boolean {
    if (!severityLevel) return false;

    // Check conditions array
    if (severityLevel.conditions && Array.isArray(severityLevel.conditions)) {
      for (const condition of severityLevel.conditions) {
        if (this.matchesCondition(condition, input)) {
          return true;
        }
      }
    }

    // Check red flags
    if (severityLevel.redFlags && Array.isArray(severityLevel.redFlags)) {
      for (const flag of severityLevel.redFlags) {
        if (this.matchesRedFlag(flag, input)) {
          return true;
        }
      }
    }

    return false;
  }

  private matchesCondition(condition: any, input: SymptomAssessmentInput): boolean {
    // Check onset
    if (condition.onset && condition.onset !== input.onset) {
      return false;
    }

    // Check duration
    if (condition.duration) {
      if (!this.matchesDuration(condition.duration, input.duration)) {
        return false;
      }
    }

    // Check pain scale
    if (condition.painScale) {
      const parts = condition.painScale.split('-').map(Number);
      if (parts.length === 2) {
        const [min, max] = parts;
        if (input.painScale < min || input.painScale > max) {
          return false;
        }
      }
    }

    // Check associated symptoms
    if (condition.associatedSymptoms && Array.isArray(condition.associatedSymptoms)) {
      for (const symptom of condition.associatedSymptoms) {
        if (!input.associatedSymptoms.includes(symptom)) {
          return false;
        }
      }
    }

    return true;
  }

  private matchesDuration(ruleDuration: string, inputDuration: string): boolean {
    // Direct string matching for exact durations
    if (ruleDuration === inputDuration) {
      return true;
    }

    const durationMap: Record<string, number> = {
      'under_1_hour': 0.5,
      '1-3_hours': 2,
      '3-12_hours': 6,
      'under_3_hours': 2,
      '1-3_days': 2,
      '3-7_days': 5,
      'over_7_days': 10,
      'over_3_days': 4,
      'over_1_day': 1.5,
      'over_3_hours': 4,
      'over_12_hours': 13,
    };

    const inputValue = durationMap[inputDuration] || 0;
    const ruleValue = durationMap[ruleDuration] || 0;

    // If both are mapped, do approximate matching
    if (inputValue > 0 && ruleValue > 0) {
      return Math.abs(inputValue - ruleValue) < 1.5;
    }

    return false;
  }
}

export const classifier = new SeverityClassifier();
