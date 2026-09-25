import { useState } from 'react';

interface Advisory {
  id: string;
  icon: string;
  title: string;
  summary: string;
  details: string;
}

export default function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex gap-3">
        <span className="text-3xl shrink-0">{advisory.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800">{advisory.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{advisory.summary}</p>
          {expanded && (
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{advisory.details}</p>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-teal-700 text-sm font-medium mt-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Learn more →'}
          </button>
        </div>
      </div>
    </div>
  );
}
