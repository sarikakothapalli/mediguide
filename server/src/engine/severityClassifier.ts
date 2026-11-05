import rules from './symptomRules.json' with { type: 'json' };

export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

export interface ClassificationResult {
  severity: Severity;
  specialty: string;
  reasoning: string;
  redFlags: string[];
  ruleId: string;
}

interface Rule {
  id: string;
  primarySymptom: string;
  conditions: Record<string, unknown>;
  severity: Severity;
  specialty: string;
  reasoning: string;
  redFlags: string[];
}

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 4,
  severe: 3,
  moderate: 2,
  mild: 1,
};

function matchCondition(key: string, condition: unknown, answers: Record<string, unknown>): boolean {
  const value = answers[key];

  if (condition === true) return value === true;
  if (condition === false) return value === false;

  if (typeof condition === 'object' && condition !== null) {
    const range = condition as { min?: number; max?: number };
    if (typeof value === 'number') {
      if (range.min !== undefined && value < range.min) return false;
      if (range.max !== undefined && value > range.max) return false;
      return true;
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      const num = Number(value);
      if (range.min !== undefined && num < range.min) return false;
      if (range.max !== undefined && num > range.max) return false;
      return true;
    }
  }

  return value === condition;
}

function ruleMatches(rule: Rule, primarySymptom: string, answers: Record<string, unknown>): boolean {
  if (rule.primarySymptom !== primarySymptom) return false;

  for (const [key, condition] of Object.entries(rule.conditions)) {
    if (!matchCondition(key, condition, answers)) return false;
  }
  return true;
}

export function classifySymptoms(
  primarySymptom: string,
  answers: Record<string, unknown>
): ClassificationResult {
  const typedRules = rules as Rule[];
  const matching = typedRules.filter((r) => ruleMatches(r, primarySymptom, answers));

  if (matching.length === 0) {
    return {
      severity: 'moderate',
      specialty: 'general medicine',
      reasoning: 'Your symptoms warrant a general medical evaluation. When in doubt, consult a healthcare provider.',
      redFlags: [],
      ruleId: 'default',
    };
  }

  matching.sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]);
  const best = matching[0];

  return {
    severity: best.severity,
    specialty: best.specialty,
    reasoning: best.reasoning,
    redFlags: best.redFlags,
    ruleId: best.id,
  };
}

export const followUpQuestions: Record<
  string,
  Array<{
    id: string;
    question: string;
    type: 'boolean' | 'number' | 'select' | 'scale';
    options?: string[];
    min?: number;
    max?: number;
  }>
> = {
  chest_pain: [
    { id: 'onset', question: 'When did the pain start?', type: 'select', options: ['Less than 1 hour', '1-6 hours', '6-24 hours', 'More than 24 hours'] },
    { id: 'painScale', question: 'Rate your pain (1-10)', type: 'scale', min: 1, max: 10 },
    { id: 'radiatingPain', question: 'Does the pain radiate to your left arm, jaw, or back?', type: 'boolean' },
    { id: 'shortnessOfBreath', question: 'Are you experiencing shortness of breath?', type: 'boolean' },
    { id: 'preExistingHeart', question: 'Do you have a history of heart disease?', type: 'boolean' },
  ],
  headache: [
    { id: 'onset', question: 'How did the headache start?', type: 'select', options: ['Gradual', 'Sudden (within seconds)', 'After injury'] },
    { id: 'suddenOnset', question: 'Did it reach maximum intensity within seconds (thunderclap)?', type: 'boolean' },
    { id: 'worstHeadache', question: 'Is this the worst headache of your life?', type: 'boolean' },
    { id: 'painScale', question: 'Rate your pain (1-10)', type: 'scale', min: 1, max: 10 },
    { id: 'visionChanges', question: 'Any vision changes, numbness, or weakness?', type: 'boolean' },
  ],
  fever: [
    { id: 'temperature', question: 'Estimated temperature (°C)', type: 'scale', min: 36, max: 42 },
    { id: 'durationDays', question: 'How many days have you had fever?', type: 'scale', min: 0, max: 14 },
    { id: 'confusion', question: 'Any confusion or difficulty staying awake?', type: 'boolean' },
    { id: 'rash', question: 'Do you have a rash?', type: 'boolean' },
    { id: 'preExistingConditions', question: 'Any chronic illness (diabetes, heart disease)?', type: 'boolean' },
  ],
  shortness_of_breath: [
    { id: 'atRest', question: 'Are you short of breath even at rest?', type: 'boolean' },
    { id: 'onExertion', question: 'Does it happen mainly during activity?', type: 'boolean' },
    { id: 'wheezing', question: 'Do you hear wheezing?', type: 'boolean' },
    { id: 'chestPain', question: 'Any associated chest pain?', type: 'boolean' },
    { id: 'preExistingAsthma', question: 'Do you have asthma or COPD?', type: 'boolean' },
  ],
  abdominal_pain: [
    { id: 'location', question: 'Where is the pain?', type: 'select', options: ['Upper abdomen', 'Lower right', 'Lower left', 'Generalized'] },
    { id: 'painScale', question: 'Rate your pain (1-10)', type: 'scale', min: 1, max: 10 },
    { id: 'durationDays', question: 'How many days have you had this pain?', type: 'scale', min: 0, max: 14 },
    { id: 'rigidAbdomen', question: 'Is your abdomen hard/rigid to touch?', type: 'boolean' },
    { id: 'vomitingBlood', question: 'Any vomiting of blood?', type: 'boolean' },
    { id: 'fever', question: 'Do you have fever?', type: 'boolean' },
  ],
  skin_rash: [
    { id: 'durationDays', question: 'How long have you had the rash?', type: 'scale', min: 0, max: 30 },
    { id: 'spreading', question: 'Is the rash spreading rapidly?', type: 'boolean' },
    { id: 'itching', question: 'Is it itchy?', type: 'boolean' },
    { id: 'fever', question: 'Do you have fever?', type: 'boolean' },
    { id: 'painScale', question: 'Rate discomfort (1-10)', type: 'scale', min: 1, max: 10 },
  ],
};

export const primarySymptoms = [
  { id: 'chest_pain', label: 'Chest Pain', icon: '❤️' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'fever', label: 'Fever', icon: '🌡️' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', icon: '🫁' },
  { id: 'abdominal_pain', label: 'Abdominal Pain', icon: '🤢' },
  { id: 'skin_rash', label: 'Skin Rash', icon: '🔴' },
];
