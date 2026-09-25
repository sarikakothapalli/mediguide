import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ lat: 17.385, lng: 78.4867, loading: false, error: 'Geolocation not supported — using Hyderabad default' });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      () => {
        setState({
          lat: 17.385,
          lng: 78.4867,
          loading: false,
          error: 'Location access denied — using Hyderabad default',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
