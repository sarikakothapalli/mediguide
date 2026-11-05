import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { HeartPulse, Home, MapPin, Stethoscope, UserRound } from 'lucide-react';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const navItems = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/symptoms', label: 'Symptoms', Icon: Stethoscope },
  { path: '/clinics', label: 'Find Care', Icon: MapPin },
  { path: '/profile', label: 'Profile', Icon: UserRound },
];

const languageNames: Record<Language, string> = { en: 'EN', hi: 'हिन्दी', te: 'తెలుగు' };

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="app-shell min-h-screen flex flex-col pb-20">
      <header className="app-header sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbfaf7]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
            <span className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl bg-[#315d52] text-white">
              <HeartPulse size={22} strokeWidth={2} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-tight tracking-tight text-stone-900">MediGuide</span>
              <span className="block text-xs text-stone-500">{t('Your health companion')}</span>
            </span>
          </Link>
          <label className="language-control flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-600 shadow-sm">
            <span className="sr-only">Language / भाषा / భాష</span>
            <span aria-hidden="true">文</span>
            <select
              aria-label="Language / भाषा / భాష"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="cursor-pointer bg-transparent font-medium text-stone-700 outline-none"
            >
              {(Object.keys(languageNames) as Language[]).map((code) => (
                <option key={code} value={code}>{languageNames[code]}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">{children}</main>

      <nav aria-label="Main navigation" className="app-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-[#fbfaf7]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-2xl">
          {navItems.map(({ path, label, Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors ${active ? 'font-semibold text-[#315d52]' : 'text-stone-500 hover:text-stone-800'}`}
              >
                <Icon size={19} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" />
                {t(label)}
=======

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/symptoms', label: 'Symptoms', icon: '🩺' },
  { path: '/clinics', label: 'Find Care', icon: '📍' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="bg-teal-700 text-white px-4 py-3 shadow-md sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">➕</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">MediGuide</h1>
              <p className="text-xs text-teal-200">Your health companion</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
        <div className="max-w-lg mx-auto flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                  active ? 'text-teal-700 font-semibold' : 'text-slate-500'
                }`}
              >
                <span className="text-xl mb-0.5">{item.icon}</span>
                {item.label}
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
