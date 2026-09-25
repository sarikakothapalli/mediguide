import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
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
        <h2 className="text-xl font-bold text-slate-800">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-500">
          Sign in to save symptom history and emergency profile info.
        </p>

        <form onSubmit={handleAuth} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white font-bold py-3 rounded-xl hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full text-teal-700 text-sm"
        >
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-red-600 font-medium">
          Sign out
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Health Profile</h3>
          <button
            onClick={() => (editing ? saveProfile() : setEditing(true))}
            className="text-sm text-teal-700 font-medium"
          >
            {editing ? (loading ? 'Saving...' : 'Save') : 'Edit'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <input
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="Age"
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <select
              value={profile.bloodGroup}
              onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option value="">Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input
              value={profile.allergies}
              onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
              placeholder="Allergies (comma separated)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <input
              value={profile.preExistingConditions}
              onChange={(e) => setProfile({ ...profile, preExistingConditions: e.target.value })}
              placeholder="Pre-existing conditions (comma separated)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.isPregnant}
                onChange={(e) => setProfile({ ...profile, isPregnant: e.target.checked })}
                className="accent-teal-700"
              />
              Pregnant
            </label>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-500">Age</dt>
            <dd>{profile.age || '—'}</dd>
            <dt className="text-slate-500">Blood Group</dt>
            <dd>{profile.bloodGroup || '—'}</dd>
            <dt className="text-slate-500">Allergies</dt>
            <dd>{profile.allergies || 'None'}</dd>
            <dt className="text-slate-500">Conditions</dt>
            <dd>{profile.preExistingConditions || 'None'}</dd>
          </dl>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Symptom Check History</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border">No assessments yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="bg-white rounded-xl p-3 border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize text-sm">
                      {h.primarySymptom.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(h.createdAt).toLocaleDateString()} · {h.specialty}
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
