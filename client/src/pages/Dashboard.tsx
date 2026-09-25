import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdvisories, healthCheck } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AdvisoryCard from '../components/AdvisoryCard';
import SOSButton from '../components/SOSButton';

export default function Dashboard() {
  const { user } = useAuth();
  const [advisories, setAdvisories] = useState<Array<{ id: string; icon: string; title: string; summary: string; details: string }>>([]);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [advisoryError, setAdvisoryError] = useState('');

  useEffect(() => {
    healthCheck()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('offline'));

    getAdvisories({ region: 'hyderabad' })
      .then((res) => {
        setAdvisories(res.data.slice(0, 4));
        setAdvisoryError('');
      })
      .catch(() => setAdvisoryError('Unable to load advisories. Check the API connection and retry.'));
  }, []);

  const quickActions = [
    { to: '/symptoms', icon: '🩺', label: 'Check Symptoms', desc: 'AI severity assessment', color: 'bg-teal-50 border-teal-200' },
    { to: '/clinics', icon: '🏥', label: 'Find Hospitals', desc: 'Nearby care options', color: 'bg-blue-50 border-blue-200' },
    { to: '/clinics?type=pharmacy', icon: '💊', label: 'Pharmacies', desc: 'Medicine nearby', color: 'bg-indigo-50 border-indigo-200' },
    { to: '/emergency-sos', icon: '🚨', label: 'Emergency SOS', desc: 'Call 108 or start a mock dispatch', color: 'bg-red-50 border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl p-5 -mt-1">
        <p className="text-teal-200 text-sm">Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}</p>
        <h2 className="text-2xl font-bold mt-1">How can we help today?</h2>
        <p className="text-teal-100 text-sm mt-2">
          Get symptom guidance, find nearby care, or trigger emergency help.
        </p>
        {apiStatus === 'connected' && (
          <span className="inline-block mt-3 text-xs bg-teal-800/50 px-2 py-1 rounded-full">● API connected</span>
        )}
      </section>

      <section>
        <h3 className="font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`flex items-center gap-4 p-4 rounded-xl border ${action.color} hover:shadow-md transition-shadow`}
            >
              <span className="text-3xl">{action.icon}</span>
              <div>
                <p className="font-semibold text-slate-800">{action.label}</p>
                <p className="text-sm text-slate-500">{action.desc}</p>
              </div>
              <span className="ml-auto text-slate-400">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-slate-700 mb-3">Seasonal Health Advisories</h3>
        {advisoryError ? (
          <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {advisoryError} <Link to="/advisories" className="font-semibold underline">Open advisories</Link>
          </div>
        ) : advisories.length === 0 ? (
          <p role="status" className="text-sm text-slate-500 bg-white p-4 rounded-xl border">Loading advisories…</p>
        ) : (
          <div className="space-y-3">
            {advisories.map((a) => (
              <AdvisoryCard key={a.id} advisory={a} />
            ))}
          </div>
        )}
        <Link to="/advisories" className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700">
          View all seasonal advisories →
        </Link>
      </section>

      <SOSButton />
    </div>
  );
}
