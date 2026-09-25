import { formatDistance, googleMapsDirections } from '../utils/helpers';

interface Hospital {
  _id: string;
  name: string;
  specialties: string[];
  rating: number;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  specialtyMatch?: boolean;
  type?: string;
  openNow?: boolean;
}

export default function HospitalCard({ hospital, highlight }: { hospital: Hospital; highlight?: boolean }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 border shadow-sm ${
        highlight ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">{hospital.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{hospital.address}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-amber-500 text-sm font-medium">★ {hospital.rating}</span>
          {hospital.distance != null && (
            <p className="text-xs text-teal-700 font-medium mt-0.5">
              {formatDistance(hospital.distance)}
            </p>
          )}
        </div>
      </div>

      {hospital.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {hospital.specialties.slice(0, 3).map((s) => (
            <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full capitalize">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <a
          href={`tel:${hospital.phone}`}
          className="flex-1 text-center bg-teal-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-teal-800"
        >
          📞 Call
        </a>
        <a
          href={googleMapsDirections(hospital.lat, hospital.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-slate-100 text-slate-700 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-200"
        >
          🗺️ Directions
        </a>
      </div>
    </div>
  );
}
