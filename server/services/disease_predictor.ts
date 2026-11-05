import modelData from '../data/symptom_disease_model.json';

export interface DiseasePrediction {
  disease: string;
  probability: number;
}

export interface DiseasePredictionResult {
  predictions: DiseasePrediction[];
  usedSymptoms: string[];
  unknownSymptoms: string[];
  modelAvailable: boolean;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/\.\d+$/, '');
}

const aliases: Record<string, string[]> = {
  fever: ['high_fever', 'mild_fever'],
  difficulty_breathing: ['breathlessness'],
  'nausea_&_vomiting': ['nausea', 'vomiting'],
  sore_throat: ['sore_throat'],
};

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exponentials = scores.map((score) => Math.exp(score - max));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function predictDiseases(symptoms: string[], topK = 3): DiseasePredictionResult {
  const featureSet = new Set(modelData.features);
  const requested = symptoms.flatMap((value) => {
    const normalized = normalize(value);
    return aliases[normalized] ?? [normalized];
  });
  const uniqueRequested = Array.from(new Set(requested));
  const usedSymptoms = uniqueRequested.filter((symptom) => featureSet.has(symptom));
  const unknownSymptoms = uniqueRequested.filter((symptom) => !featureSet.has(symptom));

  if (usedSymptoms.length === 0) {
    return { predictions: [], usedSymptoms, unknownSymptoms, modelAvailable: true };
  }

  const activeFeatures = new Set(usedSymptoms);
  const scores = modelData.coefficients.map((row, classIndex) => {
    let score = modelData.intercepts[classIndex] ?? 0;
    for (let featureIndex = 0; featureIndex < modelData.features.length; featureIndex += 1) {
      if (activeFeatures.has(modelData.features[featureIndex])) {
        score += row[featureIndex] ?? 0;
      }
    }
    return score;
  });
  const probabilities = softmax(scores);
  const predictions = probabilities
    .map((probability, index) => ({ disease: modelData.classes[index], probability }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, Math.max(1, topK))
    .map((prediction) => ({ ...prediction, probability: Number(prediction.probability.toFixed(4)) }));

  return { predictions, usedSymptoms, unknownSymptoms, modelAvailable: true };
}
