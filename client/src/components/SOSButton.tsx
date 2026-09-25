import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dispatchAmbulance, dispatchAmbulanceGuest } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';

interface SOSButtonProps { symptomSeverity?: string }
const HYDERABAD = { lat: 17.385, lng: 78.4867 };

export default function SOSButton({ symptomSeverity }: SOSButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { lat, lng } = useGeolocation();

  const getDispatchLocation = async () => {
    if (!navigator.geolocation) return lat !== null && lng !== null ? { lat, lng } : HYDERABAD;
    return new Promise<{ lat: number; lng: number }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => resolve(lat !== null && lng !== null ? { lat, lng } : HYDERABAD),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 },
      );
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    const location = await getDispatchLocation();
    try {
      const response = token
        ? await dispatchAmbulance({ ...location, symptomSeverity })
        : await dispatchAmbulanceGuest({ ...location, symptomSeverity, name: user?.name });
      setShowConfirm(false);
      navigate('/emergency', { state: { dispatch: response.data } });
    } catch {
      setShowConfirm(false);
      navigate('/emergency', {
        state: {
          dispatch: {
            userLocation: location,
            ambulanceStart: { lat: location.lat + 0.02, lng: location.lng + 0.02 },
            etaMinutes: 10,
            emergencySummary: {
              name: user?.name || 'Guest',
              bloodGroup: 'Not set',
              allergies: 'None',
              currentSeverity: symptomSeverity || 'unknown',
            },
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-24 right-4 z-50 sos-pulse flex min-h-[56px] min-w-[56px] items-center gap-2 rounded-full bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg hover:bg-red-700"
        aria-label="SOS — Call Ambulance"
      >
        <span className="text-xl" aria-hidden="true">🚨</span>
        <span className="hidden sm:inline">SOS — Call Ambulance</span>
        <span className="sm:hidden">SOS</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <section role="dialog" aria-modal="true" aria-labelledby="sos-title" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <span className="text-4xl" aria-hidden="true">🚨</span>
              <h2 id="sos-title" className="mt-2 text-xl font-bold text-red-700">Emergency Ambulance</h2>
              <p className="mt-2 text-sm text-slate-600">This will create a simulated demo dispatch with your location. It does not contact emergency services.</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleConfirm} disabled={loading} className="w-full rounded-xl bg-red-600 py-4 text-lg font-bold text-white disabled:opacity-50">
                {loading ? 'Getting location and dispatching…' : 'Confirm — Dispatch Ambulance'}
              </button>
              <a href="tel:108" className="block w-full rounded-xl bg-slate-100 py-3 text-center font-semibold text-red-700">For a real emergency, call 108</a>
              <button onClick={() => setShowConfirm(false)} disabled={loading} className="w-full py-2 text-sm text-slate-500">Cancel</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
