import { severityColors, Severity } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'lg';
}

export default function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const colors = severityColors[severity];
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${
        size === 'lg' ? 'px-4 py-1.5 text-base' : 'px-3 py-1 text-sm'
      }`}
    >
      {t(colors.label)}
    </span>
  );
}
