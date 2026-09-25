import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, AlertTriangle, Heart } from 'lucide-react';
import { trpc } from '@/lib/trpc';

type Step = 'symptom' | 'onset' | 'duration' | 'associated' | 'pain' | 'results';

const SYMPTOMS = [
  'Fever',
  'Cough',
  'Headache',
  'Chest Pain',
  'Difficulty Breathing',
  'Abdominal Pain',
  'Dizziness',
  'Nausea & Vomiting',
  'Sore Throat',
  'Skin Rash',
];

const ASSOCIATED_SYMPTOMS = [
  'fever',
  'cough',
  'chest_pain',
  'difficulty_breathing',
  'confusion',
  'loss_of_consciousness',
  'stiff_neck',
  'sweating',
  'radiating_to_arm',
  'blood_in_stool',
  'severe_vomiting',
  'vision_changes',
];

const DURATIONS = [
  'under_1_hour',
  '1-3_hours',
  '3-12_hours',
  'under_3_hours',
  '1-3_days',
  '3-7_days',
  'over_7_days',
];

const DURATION_LABELS: Record<string, string> = {
  'under_1_hour': 'Less than 1 hour',
  '1-3_hours': '1-3 hours',
  '3-12_hours': '3-12 hours',
  'under_3_hours': 'Less than 3 hours',
  '1-3_days': '1-3 days',
  '3-7_days': '3-7 days',
  'over_7_days': 'More than 7 days',
};

const SEVERITY_COLORS: Record<string, string> = {
  mild: 'severity-mild',
  moderate: 'severity-moderate',
  severe: 'severity-severe',
  critical: 'severity-critical',
};

const SEVERITY_ICONS: Record<string, React.ReactNode> = {
  mild: <CheckCircle2 className="w-8 h-8" />,
  moderate: <AlertCircle className="w-8 h-8" />,
  severe: <AlertTriangle className="w-8 h-8" />,
  critical: <Heart className="w-8 h-8" />,
};

export default function SymptomChecker() {
  const [currentStep, setCurrentStep] = useState<Step>('symptom');
  const [symptom, setSymptom] = useState('');
  const [onset, setOnset] = useState<'sudden' | 'gradual'>('gradual');
  const [duration, setDuration] = useState('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [painScale, setPainScale] = useState(5);

  const assessMutation = trpc.symptoms.assess.useMutation();

  const handleAssocSymptomChange = (symptom: string, checked: boolean) => {
    setAssociatedSymptoms((prev) =>
      checked ? [...prev, symptom] : prev.filter((s) => s !== symptom)
    );
  };

  const handleSubmit = async () => {
    if (!symptom || !duration) return;

    await assessMutation.mutateAsync({
      symptom,
      onset,
      duration,
      associatedSymptoms,
      painScale,
    });

    setCurrentStep('results');
  };

  const handleReset = () => {
    setCurrentStep('symptom');
    setSymptom('');
    setOnset('gradual');
    setDuration('');
    setAssociatedSymptoms([]);
    setPainScale(5);
    assessMutation.reset();
  };

  const result = assessMutation.data;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Symptom Checker</h1>
          <p className="text-muted-foreground">
            Assess your symptoms to get personalized health guidance
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep !== 'results' && (
          <div className="mb-8 flex justify-between items-center">
            {(['symptom', 'onset', 'duration', 'associated', 'pain'] as const).map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep === step
                      ? 'bg-primary text-primary-foreground'
                      : ['symptom', 'onset', 'duration', 'associated', 'pain'].indexOf(currentStep) > idx
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 4 && (
                  <div
                    className={`h-1 w-12 mx-2 transition-colors ${
                      ['symptom', 'onset', 'duration', 'associated', 'pain'].indexOf(currentStep) > idx
                        ? 'bg-accent'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Symptom Selection */}
        {currentStep === 'symptom' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What symptom are you experiencing?</h2>
            <div className="grid grid-cols-2 gap-3">
              {SYMPTOMS.map((s) => (
                <Button
                  key={s}
                  variant={symptom === s ? 'default' : 'outline'}
                  onClick={() => setSymptom(s)}
                  className="justify-start"
                >
                  {s}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentStep('onset')}
              disabled={!symptom}
              className="w-full mt-6"
            >
              Next
            </Button>
          </Card>
        )}

        {/* Step 2: Onset */}
        {currentStep === 'onset' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How did the symptom start?</h2>
            <div className="space-y-3">
              {(['sudden', 'gradual'] as const).map((o) => (
                <Button
                  key={o}
                  variant={onset === o ? 'default' : 'outline'}
                  onClick={() => setOnset(o)}
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-semibold capitalize">{o}</div>
                    <div className="text-sm text-muted-foreground">
                      {o === 'sudden' ? 'Appeared without warning' : 'Gradually developed over time'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep('symptom')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setCurrentStep('duration')} className="flex-1">
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Duration */}
        {currentStep === 'duration' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How long have you had this symptom?</h2>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DURATION_LABELS[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep('onset')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setCurrentStep('associated')} disabled={!duration} className="flex-1">
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Associated Symptoms */}
        {currentStep === 'associated' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Any other symptoms?</h2>
            <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
            <div className="space-y-3">
              {ASSOCIATED_SYMPTOMS.map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <Checkbox
                    id={s}
                    checked={associatedSymptoms.includes(s)}
                    onCheckedChange={(checked) => handleAssocSymptomChange(s, checked as boolean)}
                  />
                  <label htmlFor={s} className="text-sm font-medium cursor-pointer capitalize">
                    {s.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep('duration')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setCurrentStep('pain')} className="flex-1">
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Step 5: Pain Scale */}
        {currentStep === 'pain' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Rate your pain level</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium">No pain</span>
                  <span className="text-2xl font-bold text-primary">{painScale}</span>
                  <span className="text-sm font-medium">Severe pain</span>
                </div>
                <Slider
                  value={[painScale]}
                  onValueChange={(value) => setPainScale(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep('associated')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={assessMutation.isPending}
                className="flex-1"
              >
                {assessMutation.isPending ? 'Assessing...' : 'Get Assessment'}
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {currentStep === 'results' && result && (
          <Card className="p-6 mb-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${SEVERITY_COLORS[result.severity]}`}>
                  {SEVERITY_ICONS[result.severity]}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Assessment Complete</h2>
              <Badge className={`text-lg px-4 py-2 ${SEVERITY_COLORS[result.severity]}`}>
                {result.severity.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">RECOMMENDED SPECIALTY</h3>
                <p className="text-lg font-medium">{result.specialty}</p>
              </div>

              {result.diseasePrediction.predictions.length > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">MODEL-BASED POSSIBILITIES</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Based on the symptoms selected. These are model outputs, not a diagnosis.
                  </p>
                  <div className="space-y-2">
                    {result.diseasePrediction.predictions.map((prediction: { disease: string; probability: number }) => (
                      <div key={prediction.disease} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{prediction.disease}</span>
                        <span className="text-muted-foreground">{Math.round(prediction.probability * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  {result.diseasePrediction.unknownSymptoms.length > 0 && (
                    <p className="mt-3 text-xs text-amber-700">
                      Not included in the model vocabulary: {result.diseasePrediction.unknownSymptoms.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {result.redFlags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">RED FLAGS DETECTED</h3>
                  <div className="space-y-2">
                    {result.redFlags.map((flag: string) => (
                      <div key={flag} className="flex items-start gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm capitalize">{flag.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">RECOMMENDATION</h3>
                <p className="text-sm">{result.severity === 'mild' ? 'Monitor symptoms. Consider over-the-counter remedies. Consult a doctor if symptoms persist.' : result.severity === 'moderate' ? 'Schedule an appointment with a healthcare provider. Avoid self-medication.' : result.severity === 'severe' ? 'Seek immediate medical attention. Visit an urgent care or emergency room.' : 'This is a medical emergency. Call 108 immediately or visit the nearest emergency room.'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">REASONING</h3>
                <p className="text-sm">{result.reasoning}</p>
              </div>
            </div>

            {result.severity === 'critical' && (
              <div className="severity-critical text-white rounded-lg p-6 mb-6 shadow-lg">
                <p className="font-bold text-lg mb-3">🚨 MEDICAL EMERGENCY</p>
                <p className="mb-4">
                  This assessment indicates a critical condition that requires immediate medical attention.
                </p>
                <div className="flex gap-3">
                  <a
                    href="tel:108"
                    className="flex-1 bg-white text-red-600 px-4 py-3 rounded-lg font-bold hover:bg-gray-100 text-center"
                  >
                    📞 Call 108 Now
                  </a>
                  <button
                    onClick={() => (window.location.href = '/hospitals')}
                    className="flex-1 bg-white/20 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/30"
                  >
                    Find Hospital
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Start Over
              </Button>
              <Button onClick={() => window.location.href = '/hospitals'} className="flex-1">
                Find Hospitals
              </Button>
            </div>
          </Card>
        )}

        {/* Medical Disclaimer */}
        <div className="medical-disclaimer mt-8">
          <p>
            MediGuide provides general guidance only and is not a substitute for professional medical
            advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
