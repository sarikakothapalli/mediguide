import { severityColors, Severity } from '../utils/helpers';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'lg';
}

export default function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const colors = severityColors[severity];
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${
        size === 'lg' ? 'px-4 py-1.5 text-base' : 'px-3 py-1 text-sm'
      }`}
    >
<<<<<<< HEAD
      {t(colors.label)}
=======
      {colors.label}
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
    </span>
  );
}
