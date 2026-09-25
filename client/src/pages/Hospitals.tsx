import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  rating: number;
  website: string;
  distance?: number;
}

export default function Hospitals() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch specialties
  const specialtiesQuery = trpc.hospitals.getSpecialties.useQuery();

  // Fetch hospitals
  const hospitalsQuery = trpc.hospitals.list.useQuery(
    {
      specialty: selectedSpecialty === 'all' ? undefined : selectedSpecialty,
      userLatitude: userLocation?.lat,
      userLongitude: userLocation?.lng,
    },
    {
      enabled: true,
    }
  );

  // Get user location on component mount
  useEffect(() => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError('');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Showing all hospitals.');
          setIsLoadingLocation(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  }, []);

  const hospitals = hospitalsQuery.data || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Hospitals & Clinics</h1>
          <p className="text-muted-foreground">
            Discover nearby hospitals and clinics in Hyderabad based on your location and specialty needs
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {/* Location Status */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              {isLoadingLocation ? (
                <span className="text-muted-foreground">Getting your location...</span>
              ) : userLocation ? (
                <span className="text-green-600">
                  ✓ Location detected ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                </span>
              ) : (
                <span className="text-amber-600">Location not available</span>
              )}
            </div>

            {locationError && <p className="text-sm text-amber-600">{locationError}</p>}

            {/* Specialty Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialtiesQuery.data?.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found <strong>{hospitals.length}</strong> hospital{hospitals.length !== 1 ? 's' : ''}
            {selectedSpecialty !== 'all' && ` with ${selectedSpecialty}`}
          </p>
        </div>

        {/* Loading State */}
        {hospitalsQuery.isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Hospitals List */}
        {!hospitalsQuery.isLoading && hospitals.length > 0 && (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Hospital Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{hospital.name}</h3>
                        <p className="text-sm text-muted-foreground">{hospital.type}</p>
                      </div>
                      {hospital.rating && (
                        <Badge variant="secondary" className="ml-2">
                          ⭐ {hospital.rating}
                        </Badge>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex gap-2 mb-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-foreground">{hospital.address}</p>
                        {hospital.distance !== undefined && (
                          <p className="text-muted-foreground text-xs">
                            {hospital.distance.toFixed(1)} km away
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {hospital.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {/* Phone */}
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>

                    {/* Directions */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </a>

                    {/* Website */}
                    {hospital.website && (
                      <a
                        href={hospital.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!hospitalsQuery.isLoading && hospitals.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No hospitals found with the selected filters.
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedSpecialty('all')}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Medical Disclaimer */}
        <div className="medical-disclaimer mt-8">
          <p>
            MediGuide provides general guidance only and is not a substitute for professional medical
            advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
