import { Link } from 'react-router-dom';
import SOSButton from '../components/SOSButton';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';

export default function EmergencySOS() {
  const { t } = useLanguage();
  return (
    <section className="space-y-5 pb-8">
      <div className="rounded-2xl bg-red-700 p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-100">{t('Emergency support')}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t('Need urgent help?')}</h2>
        <p className="mt-2 text-sm text-red-50">{t('This demo can simulate a dispatch and show an estimated route. It does not contact emergency services.')}</p>
      </div>
      <div className="rounded-xl border border-red-200 bg-white p-5">
        <h3 className="font-semibold text-stone-800">{t('If this is a real emergency')}</h3>
        <p className="mt-2 text-sm text-stone-600">{t('Call India’s emergency ambulance number directly. Do not wait for this application.')}</p>
        <a href="tel:108" className="mt-4 block rounded-xl bg-red-600 px-4 py-4 text-center text-lg font-bold text-white">{t('Call 108 now')}</a>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-stone-800">{t('Demo ambulance tracking')}</h3>
        <p className="mt-2 text-sm text-stone-600">{t('Confirm below to create a simulated dispatch using your location (or the sample Hyderabad location if location access is unavailable).')}</p>
=======

export default function EmergencySOS() {
  return (
    <section className="space-y-5 pb-8">
      <div className="rounded-2xl bg-red-700 p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-100">Emergency support</p>
        <h2 className="mt-2 text-2xl font-bold">Need urgent help?</h2>
        <p className="mt-2 text-sm text-red-50">This demo can simulate a dispatch and show an estimated route. It does not contact emergency services.</p>
      </div>
      <div className="rounded-xl border border-red-200 bg-white p-5">
        <h3 className="font-semibold text-slate-800">If this is a real emergency</h3>
        <p className="mt-2 text-sm text-slate-600">Call India’s emergency ambulance number directly. Do not wait for this application.</p>
        <a href="tel:108" className="mt-4 block rounded-xl bg-red-600 px-4 py-4 text-center text-lg font-bold text-white">Call 108 now</a>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-800">Demo ambulance tracking</h3>
        <p className="mt-2 text-sm text-slate-600">Confirm below to create a simulated dispatch using your location (or the sample Hyderabad location if location access is unavailable).</p>
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
        <div className="relative mt-5 h-16">
          <SOSButton />
        </div>
      </div>
<<<<<<< HEAD
      <Link to="/" className="block text-center font-medium text-[#315d52]">{t('← Back to home')}</Link>
      <p className="text-center text-xs text-stone-500">{t('MediGuide is general guidance only and not a substitute for professional medical care.')}</p>
=======
      <Link to="/" className="block text-center font-medium text-teal-700">← Back to home</Link>
      <p className="text-center text-xs text-slate-500">MediGuide is general guidance only and not a substitute for professional medical care.</p>
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
    </section>
  );
}
