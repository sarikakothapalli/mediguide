export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

export const severityColors: Record<Severity, { bg: string; text: string; border: string; label: string }> = {
  mild: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Mild' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Moderate' },
  severe: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', label: 'Severe' },
  critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'Critical' },
};

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function googleMapsDirections(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const DISCLAIMER =
  'MediGuide provides general guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.';
