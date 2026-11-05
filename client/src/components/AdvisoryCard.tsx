import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Advisory { id: string; icon: string; title: string; summary: string; details: string }

export default function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4ef] text-2xl" aria-hidden="true">{advisory.icon}</span>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium leading-snug text-stone-800">{t(advisory.title)}</h4>
          <p className="mt-1 text-sm leading-5 text-stone-600">{t(advisory.summary)}</p>
          {expanded && <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-6 text-stone-600">{t(advisory.details)}</p>}
          <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-[#315d52] hover:underline">
            {expanded ? <>{t('Show less')} <ChevronUp size={15} /></> : <>{t('Learn more →')} <ChevronDown size={15} /></>}
          </button>
        </div>
      </div>
    </article>
  );
}
