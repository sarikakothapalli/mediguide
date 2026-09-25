import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MapView from '../components/MapView';

interface DispatchData {
  dispatchId?: string;
  etaMinutes?: number;
  userLocation: { lat: number; lng: number };
  ambulanceStart: { lat: number; lng: number };
  emergencySummary?: {
    name: string;
    bloodGroup: string;
    allergies: string;
    preExistingConditions?: string;
    currentSeverity: string;
    primarySymptom?: string;
    timestamp?: string;
  };
}

export default function Emergency() {
  const location = useLocation();
  const dispatch = location.state?.dispatch as DispatchData | undefined;
  const [eta, setEta] = useState(dispatch?.etaMinutes ?? 10);
  const [ambulancePos, setAmbulancePos] = useState<[number, number] | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const userLoc = dispatch?.userLocation ?? { lat: 17.385, lng: 78.4867 };
  const ambStart = dispatch?.ambulanceStart ?? { lat: userLoc.lat + 0.02, lng: userLoc.lng + 0.02 };

  useEffect(() => {
    setAmbulancePos([ambStart.lat, ambStart.lng]);

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const totalDuration = (dispatch?.etaMinutes ?? 10) * 6;
      const progress = Math.min(elapsed / totalDuration, 1);

      const lat = ambStart.lat + (userLoc.lat - ambStart.lat) * progress;
      const lng = ambStart.lng + (userLoc.lng - ambStart.lng) * progress;
      setAmbulancePos([lat, lng]);

      const remaining = Math.max(0, Math.ceil((dispatch?.etaMinutes ?? 10) * (1 - progress)));
      setEta(remaining);

      if (progress >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, ambStart.lat, ambStart.lng, userLoc.lat, userLoc.lng]);

  const summary = dispatch?.emergencySummary;

  return (
    <div className="space-y-4">
      <div className="bg-red-600 text-white rounded-2xl p-5 text-center">
        <span className="text-4xl">🚑</span>
        <h2 className="text-2xl font-bold mt-2">Ambulance Dispatched</h2>
        <p className="text-red-100 mt-1">Mock dispatch for demo purposes</p>
        {dispatch?.dispatchId && (
          <p className="text-xs text-red-200 mt-2 font-mono">{dispatch.dispatchId}</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-5 border border-slate-200 text-center shadow-sm">
        <p className="text-sm text-slate-500">Estimated arrival</p>
        <p className="text-5xl font-bold text-red-600 mt-1">{eta}</p>
        <p className="text-slate-500">minutes</p>
        {eta === 0 && (
          <p className="text-green-700 font-semibold mt-2">Ambulance has arrived!</p>
        )}
      </div>

      <MapView
        center={[userLoc.lat, userLoc.lng]}
        markers={[{ lat: userLoc.lat, lng: userLoc.lng, label: 'Your Location', type: 'user' }]}
        ambulancePosition={ambulancePos}
        routeLine={
          ambulancePos
            ? [[ambStart.lat, ambStart.lng], ambulancePos, [userLoc.lat, userLoc.lng]]
            : undefined
        }
        height="280px"
        zoom={14}
      />

      {summary && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-900 flex items-center gap-2">
            📋 Emergency Summary Card
          </h3>
          <p className="text-xs text-amber-700 mt-1 mb-3">
            Share this information with first responders
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium">{summary.name}</dd>
            <dt className="text-slate-500">Blood Group</dt>
            <dd className="font-medium">{summary.bloodGroup}</dd>
            <dt className="text-slate-500">Allergies</dt>
            <dd className="font-medium">{summary.allergies}</dd>
            {summary.preExistingConditions && (
              <>
                <dt className="text-slate-500">Conditions</dt>
                <dd className="font-medium">{summary.preExistingConditions}</dd>
              </>
            )}
            <dt className="text-slate-500">Severity</dt>
            <dd className="font-medium capitalize">{summary.currentSeverity}</dd>
            {summary.primarySymptom && (
              <>
                <dt className="text-slate-500">Symptom</dt>
                <dd className="font-medium capitalize">{summary.primarySymptom.replace(/_/g, ' ')}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      <a
        href="tel:108"
        className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg"
      >
        📞 Or call 108 directly
      </a>

      <Link to="/" className="block text-center text-teal-700 font-medium py-2">
        ← Back to Home
      </Link>

      <p className="text-xs text-slate-400 text-center">
        This is a simulated dispatch for demo purposes. In a real emergency, always call 108.
      </p>
    </div>
  );
}
