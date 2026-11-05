import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
import { getHospitals } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';
import HospitalCard from '../components/HospitalCard';
import MapView from '../components/MapView';
import SOSButton from '../components/SOSButton';

interface Facility {
  _id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  specialties: string[];
  rating: number;
  phone: string;
  address: string;
  distance?: number;
  openNow?: boolean;
}

export default function Clinics() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'hospital';
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [type, setType] = useState(initialType);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [radius, setRadius] = useState(15);
  const [openOnly, setOpenOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { lat, lng, error: geoError } = useGeolocation();
<<<<<<< HEAD
  const { t } = useLanguage();
=======
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42

  useEffect(() => {
    setType(searchParams.get('type') || 'hospital');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setLoadError('');
    const params: Record<string, string | number | boolean> = { type, radius, limit: 20 };
    if (lat && lng) {
      params.lat = lat;
      params.lng = lng;
    }
    if (openOnly) params.openNow = true;

    getHospitals(params)
      .then((res) => setFacilities(res.data))
      .catch(() => {
        setFacilities([]);
        setLoadError('Unable to load nearby facilities. Check the API connection and try again.');
      })
      .finally(() => setLoading(false));
  }, [type, lat, lng, radius, openOnly, retryCount]);

  const filtered = facilities.filter((f) =>
    search ? f.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const types = [
    { id: 'hospital', label: 'Hospitals', icon: '🏥' },
    { id: 'clinic', label: 'Clinics', icon: '🩺' },
    { id: 'pharmacy', label: 'Pharmacies', icon: '💊' },
  ];

  return (
    <div className="space-y-4 pb-4">
      <div>
<<<<<<< HEAD
        <h2 className="text-xl font-semibold text-stone-900">{t('Find Care Nearby')}</h2>
        {geoError && <p className="mt-1 text-xs text-amber-700">{geoError}</p>}
      </div>

      <div className="flex gap-2">
        {types.map((typeOption) => (
          <button
            key={typeOption.id}
            onClick={() => setType(typeOption.id)}
            className={`flex-1 rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
              type === typeOption.id
                ? 'border-[#315d52] bg-[#315d52] text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-[#9bb5a1]'
            }`}
          >
            {typeOption.icon} {t(typeOption.label)}
=======
        <h2 className="text-xl font-bold text-slate-800">Find Care Nearby</h2>
        {geoError && <p className="text-xs text-amber-600 mt-1">{geoError}</p>}
      </div>

      <div className="flex gap-2">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              type === t.id
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {t.icon} {t.label}
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
          </button>
        ))}
      </div>

      <input
        type="text"
<<<<<<< HEAD
        placeholder={t('Search by name...')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7f9d88]"
      />

      <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
        <div>
          <label className="flex justify-between text-sm text-stone-600">
            <span>{t('Search radius')}</span>
=======
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
        <div>
          <label className="text-sm text-slate-600 flex justify-between">
            <span>Search radius</span>
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
            <span className="font-medium text-teal-700">{radius} km</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full accent-teal-700 mt-1"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="accent-teal-700 w-4 h-4"
          />
<<<<<<< HEAD
          {t('Open now only')}
=======
          Open now only
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView('list')}
<<<<<<< HEAD
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            view === 'list' ? 'bg-[#315d52] text-white' : 'bg-white text-stone-600'
          }`}
        >
          {t('📋 List')}
        </button>
        <button
          onClick={() => setView('map')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            view === 'map' ? 'bg-[#315d52] text-white' : 'bg-white text-stone-600'
          }`}
        >
          {t('🗺️ Map')}
=======
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            view === 'list' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          📋 List
        </button>
        <button
          onClick={() => setView('map')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            view === 'map' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          🗺️ Map
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
        </button>
      </div>

      {loading ? (
<<<<<<< HEAD
        <p role="status" className="py-8 text-center text-stone-500">{t('Finding nearby facilities...')}</p>
      ) : loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t(loadError)}
          <button onClick={() => setRetryCount((count) => count + 1)} className="ml-2 font-semibold underline">{t('Retry')}</button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-white py-8 text-center text-stone-500">
          {t('No facilities found. Try increasing the search radius or run the seed script.')}
=======
        <p className="text-center text-slate-500 py-8">Finding nearby facilities...</p>
      ) : loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
          <button onClick={() => setRetryCount((count) => count + 1)} className="ml-2 font-semibold underline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-8 bg-white rounded-xl border">
          No facilities found. Try increasing the search radius or run the seed script.
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
        </p>
      ) : view === 'map' && lat && lng ? (
        <MapView
          center={[lat, lng]}
          markers={[
<<<<<<< HEAD
            { lat, lng, label: t('You'), type: 'user' },
=======
            { lat, lng, label: 'You', type: 'user' },
>>>>>>> 550dab46139872aade42b1e48c40fb96e788de42
            ...filtered.map((f) => ({
              lat: f.lat,
              lng: f.lng,
              label: f.name,
              type: (f.type === 'pharmacy' ? 'pharmacy' : 'hospital') as 'hospital' | 'pharmacy',
              phone: f.phone,
            })),
          ]}
          height="400px"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <HospitalCard key={f._id} hospital={f} />
          ))}
        </div>
      )}

      <SOSButton />
    </div>
  );
}
