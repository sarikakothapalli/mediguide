import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdvisories, healthCheck } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import AdvisoryCard from '../components/AdvisoryCard';
import SOSButton from '../components/SOSButton';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [advisories, setAdvisories] = useState<Array<{ id: string; icon: string; title: string; summary: string; details: string }>>([]);
  const [apiStatus, setApiStatus] = useState<string>('checking');
  const [advisoryError, setAdvisoryError] = useState('');

  useEffect(() => {
    healthCheck().then(() => setApiStatus('connected')).catch(() => setApiStatus('offline'));
    getAdvisories({ region: 'hyderabad' })
      .then((res) => { setAdvisories(res.data.slice(0, 4)); setAdvisoryError(''); })
      .catch(() => setAdvisoryError('Unable to load advisories. Check the API connection and retry.'));
  }, []);

  const quickActions = [
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
            </Link>
          ))}
        </div>
      </section>

      <section>
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
      <SOSButton />
    </div>
  );
}
