import { useEffect, useState } from 'react';
import { getAdvisories } from '../api/client';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42

interface Advisory { id: string; icon: string; title: string; summary: string; details: string; tags: string[] }

export default function Advisories() {
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdvisories({ region: 'hyderabad' })
      .then((response) => setAdvisories(response.data))
      .catch(() => setError('Unable to load advisories. Check that the MediGuide API is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4 pb-6">
      <div>
<<<<<<< HEAD
        <p className="text-sm font-semibold uppercase tracking-wide text-[#315d52]">{t('Hyderabad · Seasonal guidance')}</p>
        <h2 className="mt-1 text-2xl font-semibold text-stone-900">{t('Health Advisories')}</h2>
        <p className="mt-2 text-sm text-stone-600">{t('Prevention tips for seasonal health risks. For concerning symptoms, seek professional medical care.')}</p>
      </div>
      {loading && <p role="status" className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">{t('Loading advisories…')}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{t(error)}</p>}
      {!loading && !error && advisories.length === 0 && <p className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">{t('No advisories are listed for this month.')}</p>}
      {advisories.map((advisory) => (
        <article key={advisory.id} className="rounded-xl border border-stone-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-semibold text-stone-800"><span aria-hidden="true">{advisory.icon}</span>{t(advisory.title)}</h3>
          <p className="mt-2 text-sm text-stone-600">{t(advisory.summary)}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">{t(advisory.details)}</p>
        </article>
      ))}
      <p className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500">{t('General health information only; not a substitute for medical advice.')}</p>
=======
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Hyderabad · Seasonal guidance</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">Health Advisories</h2>
        <p className="mt-2 text-sm text-slate-600">Prevention tips for seasonal health risks. For concerning symptoms, seek professional medical care.</p>
      </div>
      {loading && <p role="status" className="rounded-xl border bg-white p-4 text-slate-600">Loading advisories…</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      {!loading && !error && advisories.length === 0 && <p className="rounded-xl border bg-white p-4 text-slate-600">No advisories are listed for this month.</p>}
      {advisories.map((advisory) => (
        <article key={advisory.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800"><span aria-hidden="true">{advisory.icon}</span>{advisory.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{advisory.summary}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{advisory.details}</p>
        </article>
      ))}
      <p className="rounded-lg border bg-slate-50 p-3 text-xs text-slate-500">General health information only; not a substitute for medical advice.</p>
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
    </section>
  );
}
