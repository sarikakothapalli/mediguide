import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdvisories, healthCheck } from '../api/client';
import { useAuth } from '../hooks/useAuth';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
import AdvisoryCard from '../components/AdvisoryCard';
import SOSButton from '../components/SOSButton';

export default function Dashboard() {
  const { user } = useAuth();
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
  const [advisories, setAdvisories] = useState<Array<{ id: string; icon: string; title: string; summary: string; details: string }>>([]);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [advisoryError, setAdvisoryError] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    healthCheck().then(() => setApiStatus('connected')).catch(() => setApiStatus('offline'));
    getAdvisories({ region: 'hyderabad' })
      .then((res) => { setAdvisories(res.data.slice(0, 4)); setAdvisoryError(''); })
=======
    healthCheck()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('offline'));

    getAdvisories({ region: 'hyderabad' })
      .then((res) => {
        setAdvisories(res.data.slice(0, 4));
        setAdvisoryError('');
      })
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
      .catch(() => setAdvisoryError('Unable to load advisories. Check the API connection and retry.'));
  }, []);

  const quickActions = [
<<<<<<< HEAD
    { to: '/symptoms', icon: '🩺', label: 'Check Symptoms', desc: 'Symptom guidance' },
    { to: '/clinics', icon: '🏥', label: 'Find Hospitals', desc: 'Nearby care options' },
    { to: '/clinics?type=pharmacy', icon: '💊', label: 'Pharmacies', desc: 'Medicine nearby' },
    { to: '/emergency-sos', icon: '🚨', label: 'Emergency SOS', desc: 'Call 108 or start a mock dispatch' },
  ];

  return (
    <div className="space-y-7 pb-4">
      <section className="rounded-2xl border border-[#dce5db] border-l-4 border-l-[#557965] bg-[#eef2eb] p-5 sm:p-6">
        <p className="text-sm text-stone-600">{t('Welcome')}{user ? `, ${user.name.split(' ')[0]}` : ''}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">{t('How can we help today?')}</h2>
        <p className="mt-2 max-w-prose text-sm leading-6 text-stone-600">{t('Get symptom guidance, find nearby care, or trigger emergency help.')}</p>
        <p role="status" className="mt-4 inline-flex items-center gap-2 text-xs text-stone-600">
          <span className={`h-2 w-2 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-600' : apiStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-500'}`} />
          {apiStatus === 'connected' ? t('API connected') : apiStatus === 'offline' ? t('API unavailable') : t('Connecting to service…')}
        </p>
      </section>

      <section>
        <h3 className="mb-3 text-base font-semibold text-stone-800">{t('Quick Actions')}</h3>
        <div className="grid gap-2.5">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-[#9bb5a1] hover:bg-[#fcfcf9]">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3f4ef] text-2xl">{action.icon}</span>
              <span className="min-w-0">
                <span className="block font-medium text-stone-800">{t(action.label)}</span>
                <span className="mt-0.5 block text-sm text-stone-500">{t(action.desc)}</span>
              </span>
              <span aria-hidden="true" className="ml-auto text-stone-400 transition-transform group-hover:translate-x-0.5">→</span>
=======
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
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
            </Link>
          ))}
        </div>
      </section>

      <section>
<<<<<<< HEAD
        <h3 className="mb-3 text-base font-semibold text-stone-800">{t('Seasonal Health Advisories')}</h3>
        {advisoryError ? (
          <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{t(advisoryError)} <Link to="/advisories" className="font-semibold underline">{t('Open advisories')}</Link></div>
        ) : advisories.length === 0 ? (
          <p role="status" className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-500">{t('Loading advisories…')}</p>
        ) : (
          <div className="space-y-3">{advisories.map((a) => <AdvisoryCard key={a.id} advisory={a} />)}</div>
        )}
        <Link to="/advisories" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#315d52]">{t('View all seasonal advisories →')}</Link>
      </section>
=======
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

>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
      <SOSButton />
    </div>
  );
}
