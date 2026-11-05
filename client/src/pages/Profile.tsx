import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getProfile, updateProfile, getHistory } from '../api/client';
import SeverityBadge from '../components/SeverityBadge';
import { Severity } from '../utils/helpers';

interface HistoryItem {
  _id: string;
  primarySymptom: string;
  severity: Severity;
  specialty: string;
  reasoning: string;
  createdAt: string;
}

export default function Profile() {
  const { user, token, login, register, logout, updateUser } = useAuth();
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    allergies: '',
    preExistingConditions: '',
    isPregnant: false,
  });

  useEffect(() => {
    if (token) {
      getProfile()
        .then((res) => {
          const u = res.data;
          setProfile({
            name: u.name || '',
            age: u.age?.toString() || '',
            bloodGroup: u.bloodGroup || '',
            allergies: u.allergies?.join(', ') || '',
            preExistingConditions: u.preExistingConditions?.join(', ') || '',
            isPregnant: u.isPregnant || false,
          });
        })
        .catch(() => {});

      getHistory()
        .then((res) => setHistory(res.data))
        .catch(() => {});
    }
  }, [token]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch {
      setError(mode === 'login' ? 'Invalid credentials' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data } = await updateProfile({
        name: profile.name,
        age: profile.age ? parseInt(profile.age) : undefined,
        bloodGroup: profile.bloodGroup || undefined,
        allergies: profile.allergies ? profile.allergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        preExistingConditions: profile.preExistingConditions
          ? profile.preExistingConditions.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        isPregnant: profile.isPregnant,
      });
      updateUser(data);
      setEditing(false);
    } catch {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 max-w-sm mx-auto">
          <h2 className="text-xl font-semibold text-stone-900">
          {mode === 'login' ? t('Sign In') : t('Create Account')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('Sign in to save symptom history and emergency profile info.')}
        </p>

        <form onSubmit={handleAuth} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder={t('Full name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          <input
            type="email"
            placeholder={t('Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder={t('Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {error && <p role="alert" className="text-sm text-red-600">{t(error)}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white font-bold py-3 rounded-xl hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? t('Please wait...') : mode === 'login' ? t('Sign In') : t('Register')}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full text-teal-700 text-sm"
        >
          {mode === 'login' ? t("Don't have an account? Register") : t('Already have an account? Sign in')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-red-600 font-medium">
          {t('Sign out')}
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{t('Health Profile')}</h3>
          <button
            onClick={() => (editing ? saveProfile() : setEditing(true))}
            className="text-sm text-teal-700 font-medium"
          >
            {editing ? (loading ? t('Saving...') : t('Save')) : t('Edit')}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder={t('Name')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <input
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder={t('Age')}
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <select
              value={profile.bloodGroup}
              onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option value="">{t('Blood Group')}</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input
              value={profile.allergies}
              onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
              placeholder={t('Allergies (comma separated)')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <input
              value={profile.preExistingConditions}
              onChange={(e) => setProfile({ ...profile, preExistingConditions: e.target.value })}
              placeholder={t('Pre-existing conditions (comma separated)')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.isPregnant}
                onChange={(e) => setProfile({ ...profile, isPregnant: e.target.checked })}
                className="accent-teal-700"
              />
              {t('Pregnant')}
            </label>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-stone-500">{t('Age')}</dt>
            <dd>{profile.age || '—'}</dd>
            <dt className="text-stone-500">{t('Blood Group')}</dt>
            <dd>{profile.bloodGroup || '—'}</dd>
            <dt className="text-stone-500">{t('Allergies')}</dt>
            <dd>{profile.allergies || t('None')}</dd>
            <dt className="text-stone-500">{t('Conditions')}</dt>
            <dd>{profile.preExistingConditions || t('None')}</dd>
          </dl>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-stone-700">{t('Symptom Check History')}</h3>
        {history.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-500">{t('No assessments yet.')}</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="bg-white rounded-xl p-3 border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize text-sm">
                      {t(h.primarySymptom.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()))}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(h.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN')} · {t(h.specialty)}
                    </p>
                  </div>
                  <SeverityBadge severity={h.severity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
