import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPrimarySymptoms,
  getFollowUpQuestions,
  assessSymptoms,
  assessSymptomsGuest,
  getHospitalRecommendations,
} from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useGeolocation } from '../hooks/useGeolocation';
import SeverityBadge from '../components/SeverityBadge';
import HospitalCard from '../components/HospitalCard';
import MapView from '../components/MapView';
import SOSButton from '../components/SOSButton';
import { DISCLAIMER, Severity } from '../utils/helpers';

interface Question {
  id: string;
  question: string;
  type: 'boolean' | 'number' | 'select' | 'scale';
  options?: string[];
  min?: number;
  max?: number;
}

interface AssessmentResult {
  severity: Severity;
  specialty: string;
  reasoning: string;
  redFlags: string[];
  disclaimer: string;
  diseasePrediction?: {
    predictions: Array<{ disease: string; probability: number }>;
    usedSymptoms: string[];
    unknownSymptoms: string[];
    modelAvailable: boolean;
  };
}

export default function SymptomCheck() {
  const [step, setStep] = useState(0);
  const [symptoms, setSymptoms] = useState<Array<{ id: string; label: string; icon: string }>>([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [hospitals, setHospitals] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const { t } = useLanguage();
  const { lat, lng } = useGeolocation();
  const navigate = useNavigate();

  useEffect(() => {
    getPrimarySymptoms().then((res) => setSymptoms(res.data)).catch(() => {});
  }, []);

  const selectSymptom = async (id: string) => {
    setError('');
    setSelectedSymptom(id);
    try {
      const res = await getFollowUpQuestions(id);
      setQuestions(res.data);
      setAnswers({});
      setStep(1);
    } catch {
      setError('Unable to load follow-up questions. Check the API connection and try again.');
    }
  };

  const setAnswer = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const submitAssessment = async () => {
    setLoading(true);
    setError('');
    try {
      const assessFn = token ? assessSymptoms : assessSymptomsGuest;
      const { data } = await assessFn({ primarySymptom: selectedSymptom, answers });
      setResult(data);
      setStep(2);

      if (lat && lng) {
        try {
          const hospRes = await getHospitalRecommendations({ specialty: data.specialty, lat, lng });
          setHospitals(hospRes.data);
        } catch {
          setHospitals([]);
        }
      }
    } catch {
      setError('Unable to complete the assessment. Your answers were not evaluated. Check the API connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedSymptom('');
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setHospitals([]);
    setError('');
  };

  const isCritical = result?.severity === 'critical';

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">{t('Symptom Checker')}</h2>
        <p className="mt-1 text-sm text-stone-500">{t('Step')} {step + 1} {t('of')} 3</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{t(error)}</p>}

      <div className="flex gap-2">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-teal-600' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <p className="text-stone-600">{t('What is your primary symptom?')}</p>
          <div className="grid grid-cols-2 gap-3">
            {symptoms.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSymptom(s.id)}
                className="min-h-[80px] rounded-xl border border-stone-200 bg-white p-4 text-left transition-colors hover:border-[#9bb5a1]"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-2 text-sm font-medium text-stone-800">{t(s.label)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="mb-3 font-medium text-stone-800">{t(q.question)}</p>

              {q.type === 'boolean' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setAnswer(q.id, true)}
                    className={`flex-1 py-3 rounded-lg font-medium ${
                      answers[q.id] === true ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t('Yes')}
                  </button>
                  <button
                    onClick={() => setAnswer(q.id, false)}
                    className={`flex-1 py-3 rounded-lg font-medium ${
                      answers[q.id] === false ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t('No')}
                  </button>
                </div>
              )}

              {q.type === 'scale' && (
                <div>
                  <input
                    type="range"
                    min={q.min ?? 1}
                    max={q.max ?? 10}
                    value={(answers[q.id] as number) ?? Math.floor(((q.min ?? 1) + (q.max ?? 10)) / 2)}
                    onChange={(e) => setAnswer(q.id, parseInt(e.target.value))}
                    className="w-full accent-teal-700"
                  />
                  <p className="text-center text-teal-700 font-bold text-lg mt-1">
                    {(answers[q.id] as number) ?? Math.floor(((q.min ?? 1) + (q.max ?? 10)) / 2)}
                  </p>
                </div>
              )}

              {q.type === 'select' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setAnswer(q.id, opt);
                        if (q.id === 'onset' && opt.includes('Sudden')) {
                          setAnswer('suddenOnset', true);
                        }
                      }}
                      className={`w-full text-left py-3 px-4 rounded-lg ${
                        answers[q.id] === opt ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t(opt)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={submitAssessment}
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
          >
            {loading ? t('Analyzing...') : t('Get Assessment')}
          </button>
        </div>
      )}

      {step === 2 && result && (
        <div className="space-y-4">
          {isCritical && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <p className="text-lg font-semibold text-red-800">{t('⚠️ Critical — Seek Emergency Care Now')}</p>
              <p className="mt-1 text-sm text-red-700">
                {t('Your symptoms may indicate a medical emergency. Use the SOS button or call 108 immediately.')}
              </p>
              <div className="flex gap-2 mt-3">
                <a
                  href="tel:108"
                  className="flex-1 text-center bg-red-600 text-white font-bold py-3 rounded-lg"
                >
                  {t('📞 Call 108')}
                </a>
                <button
                  onClick={() => navigate('/emergency')}
                  className="flex-1 bg-red-100 text-red-800 font-bold py-3 rounded-lg"
                >
                  {t('🚨 SOS Dispatch')}
                </button>
              </div>
            </div>
          )}

            <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('Assessment Result')}</h3>
              <SeverityBadge severity={result.severity} size="lg" />
            </div>
            <p className="text-sm text-slate-500 mt-1 capitalize">
              {t('Recommended specialty:')} {t(result.specialty)}
            </p>
            <p className="mt-3 leading-relaxed text-stone-700">{t(result.reasoning)}</p>

            {!!result.diseasePrediction?.predictions.length && (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#315d52]">{t('Model-based possibilities')}</p>
                <p className="mt-1 text-xs text-stone-600">{t('Statistical model output only; not a diagnosis.')}</p>
                <ul className="mt-3 space-y-2">
                  {result.diseasePrediction.predictions.map((prediction) => (
                    <li key={prediction.disease} className="flex justify-between gap-3 text-sm">
                      <span className="font-medium text-stone-800">{t(prediction.disease)}</span>
                      <span className="text-slate-600">{Math.round(prediction.probability * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.redFlags.length > 0 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-800">{t('Red Flags:')}</p>
                <ul className="text-sm text-orange-700 mt-1 list-disc list-inside">
                  {result.redFlags.map((f) => (
                    <li key={f}>{t(f)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {!isCritical && hospitals.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-stone-700">{t('Recommended Hospitals')}</h3>
              {lat && lng && (
                <MapView
                  center={[lat, lng]}
                  markers={[
                    { lat, lng, label: t('You'), type: 'user' },
                    ...hospitals.map((h) => ({
                      lat: h.lat as number,
                      lng: h.lng as number,
                      label: h.name as string,
                      type: 'hospital' as const,
                      phone: h.phone as string,
                    })),
                  ]}
                  height="220px"
                />
              )}
              {hospitals.map((h, i) => (
                <HospitalCard key={h._id as string} hospital={h as never} highlight={i === 0} />
              ))}
            </div>
          )}

          <button onClick={reset} className="w-full text-teal-700 font-medium py-3">
            {t('Start New Assessment')}
          </button>
        </div>
      )}

      <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-500 leading-relaxed">
        {t(DISCLAIMER)}
      </div>

      <SOSButton symptomSeverity={result?.severity} />
    </div>
  );
}
