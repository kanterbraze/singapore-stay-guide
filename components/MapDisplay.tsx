import React, { useCallback, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { LocationData, Route, Trail } from '../types';

interface MapDisplayProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (location: LocationData) => void;
  activeRoute: Route | null;
  activeTrail: Trail | null;
  homeBase: LocationData | null;
}

const SINGAPORE_CENTER = {
  lat: 1.3521,
  lng: 103.8198
};

const MapContent: React.FC<Omit<MapDisplayProps, 'locations'> & { locations: LocationData[] }> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  activeRoute,
  activeTrail,
  homeBase
}) => {
  const map = useMap();
  const [openInfoWindow, setOpenInfoWindow] = useState<string | null>(null);

  // Fly to selected location
  React.useEffect(() => {
    if (selectedLocation && map) {
      map.panTo({ lat: selectedLocation.coordinates[0], lng: selectedLocation.coordinates[1] });
      map.setZoom(14);
      setOpenInfoWindow(selectedLocation.id);
    }
  }, [selectedLocation, map]);

  // Fit bounds for routes/trails
  React.useEffect(() => {
    if (!map) return;

    const steps = activeRoute?.steps || activeTrail?.steps;
    if (steps && steps.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      steps.forEach(step => {
        bounds.extend({ lat: step.coordinates[0], lng: step.coordinates[1] });
      });
      map.fitBounds(bounds, 50);
    }
  }, [activeRoute, activeTrail, map]);

  const handleMarkerClick = useCallback((location: LocationData) => {
    setOpenInfoWindow(location.id);
    onSelectLocation(location);
  }, [onSelectLocation]);

  return (
    <>
      {/* Home Base Marker */}
      {homeBase && (
        <AdvancedMarker
          position={{ lat: homeBase.coordinates[0], lng: homeBase.coordinates[1] }}
          onClick={() => handleMarkerClick(homeBase)}
        >
          <div
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          {openInfoWindow === homeBase.id && (
            <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>
                  HOME BASE
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{homeBase.name}</div>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      )}

      {/* Location Markers */}
      {locations.map((loc) => {
        if (homeBase && loc.id === homeBase.id) return null;

        const isGenerated = loc.isGenerated;
        const color = isGenerated ? '#9333ea' : '#2563eb';

        return (
          <AdvancedMarker
            key={loc.id}
            position={{ lat: loc.coordinates[0], lng: loc.coordinates[1] }}
            onClick={() => handleMarkerClick(loc)}
          >
            <div
              style={{
                backgroundColor: color,
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              📍
            </div>
            {openInfoWindow === loc.id && (
              <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{loc.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{loc.category}</div>
                  {isGenerated && (
                    <div style={{ fontSize: '10px', color: '#9333ea', fontWeight: 'bold', marginTop: '4px' }}>
                      ✨ AI Discovery
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        );
      })}

      {/* Route/Trail Step Markers */}
      {(activeRoute?.steps || activeTrail?.steps)?.map((step, index) => {
        const color = activeRoute ? '#2563eb' : '#ea580c';
        const stepId = `step-${index}`;

        return (
          <AdvancedMarker
            key={stepId}
            position={{ lat: step.coordinates[0], lng: step.coordinates[1] }}
            onClick={() => setOpenInfoWindow(stepId)}
          >
            <div
              style={{
                backgroundColor: color,
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '13px',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            >
              {index + 1}
            </div>
            {openInfoWindow === stepId && (
              <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
                <div style={{ padding: '8px', maxWidth: '180px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{step.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{step.description}</div>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const MapDisplay: React.FC<MapDisplayProps> = (props) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-xl font-bold text-red-600 mb-2">Google Maps API Key Missing</div>
          <div className="text-sm text-gray-600">
            Please add GOOGLE_MAPS_API_KEY to your .env.local file
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="singapore-stay-guide-map"
          defaultCenter={SINGAPORE_CENTER}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent {...props} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapDisplay;
