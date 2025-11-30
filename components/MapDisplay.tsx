import React, { useCallback, useState } from 'react';
import { AdvancedMarker, Map, Pin, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Home, Footprints, Flag } from 'lucide-react';
import { LocationData, Route, Trail } from '../types';

interface MapDisplayProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (location: LocationData) => void;
  activeRoute: Route | null;
  activeTrail: Trail | null;
  homeBase: LocationData | null;
  onMapClick?: () => void;
}

const SINGAPORE_CENTER = {
  lat: 1.3521,
  lng: 103.8198
};

const MapContent: React.FC<Omit<MapDisplayProps, 'locations'> & { locations: LocationData[], stepDistances?: string[], stepDurations?: string[] }> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  activeRoute,
  activeTrail,
  homeBase,
  stepDistances,
  stepDurations
}) => {
  const map = useMap();
  const [openInfoWindow, setOpenInfoWindow] = useState<string | null>(null);

  // Fly to selected location
  React.useEffect(() => {
    if (selectedLocation && map) {
      console.log('🎯 MapDisplay: selectedLocation changed:', selectedLocation.id, selectedLocation.name);

      // Pan to location
      map.panTo({ lat: selectedLocation.coordinates[0], lng: selectedLocation.coordinates[1] });

      // Smart Zoom: Only zoom in if current zoom is too far out
      // This prevents jarring zoom-outs if user is already inspecting closely
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined && currentZoom < 15) {
        map.setZoom(15);
      }

      setOpenInfoWindow(selectedLocation.id);

      // Mobile Offset: Shift map down so location appears above the drawer
      // Use setTimeout to ensure panTo completes first
      setTimeout(() => {
        if (window.innerWidth < 768) {
          // Drawer covers bottom ~60%, so we want the point in the top ~40%
          // We shift the map center down by ~30% of screen height
          // This moves the target point UP relative to the viewport center
          const offset = window.innerHeight * 0.30;
          console.log('📱 Applying mobile offset:', offset);
          map.panBy(0, offset);
        }
      }, 100);
    }
  }, [selectedLocation, map]);

  // Fit bounds for routes/trails
  const coreLibrary = useMapsLibrary('core');
  React.useEffect(() => {
    console.log('🔄 FitBounds Effect Triggered:', {
      hasMap: !!map,
      hasCore: !!coreLibrary,
      hasActiveRoute: !!activeRoute,
      hasActiveTrail: !!activeTrail,
      stepsCount: activeRoute?.steps?.length || activeTrail?.steps?.length
    });

    if (!map || !coreLibrary) return;

    const steps = activeRoute?.steps || activeTrail?.steps;
    if (steps && steps.length > 0) {
      const bounds = new coreLibrary.LatLngBounds();
      steps.forEach(step => {
        bounds.extend({ lat: step.coordinates[0], lng: step.coordinates[1] });
      });

      // Standard fitBounds with padding
      // On mobile, the drawer covers the bottom 60%, so we add bottom padding
      // to ensure the trail is centered in the visible top area.
      // We use 0.65 (65%) to be safe against mobile browser address bars/toolbars
      const isMobile = window.innerWidth < 768;
      const padding = isMobile
        ? { top: 50, right: 50, left: 50, bottom: (window.innerHeight * 0.65) + 50 }
        : 50;

      console.log('📐 Fitting bounds for trail:', {
        stepsCount: steps.length,
        isMobile,
        padding,
        screenHeight: window.innerHeight
      });

      map.fitBounds(bounds, padding);
    }
  }, [activeRoute, activeTrail, map, coreLibrary]);

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
          zIndex={20}
        >
          <div
            className="group"
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
          >
            <Home size={20} fill="white" className="group-hover:scale-110 transition-transform" />
          </div>
          {openInfoWindow === homeBase.id && (
            <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
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

        const isSelected = selectedLocation?.id === loc.id;
        const isGenerated = loc.isGenerated;

        // Soft Gradients
        const background = isGenerated
          ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' // Soft Purple
          : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'; // Soft Blue

        const shadowColor = isGenerated ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)';

        const size = isSelected ? '44px' : '32px';
        const zIndex = isSelected ? 100 : 1;

        return (
          <AdvancedMarker
            key={loc.id}
            position={{ lat: loc.coordinates[0], lng: loc.coordinates[1] }}
            onClick={() => handleMarkerClick(loc)}
            zIndex={zIndex}
          >
            <div
              className="group"
              style={{
                background,
                color: 'white',
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isSelected ? '3px solid white' : '2px solid white',
                boxShadow: isSelected
                  ? `0 8px 20px ${shadowColor}`
                  : `0 4px 8px ${shadowColor}`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
                transform: isSelected ? 'scale(1.05) translateY(-4px)' : 'scale(1)'
              }}
            >
              {isGenerated ? (
                <MapPin size={isSelected ? 24 : 18} fill="white" className="group-hover:scale-110 transition-transform" />
              ) : (
                <MapPin size={isSelected ? 24 : 18} fill="white" className="group-hover:scale-110 transition-transform" />
              )}
            </div>
            {openInfoWindow === loc.id && (
              <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{loc.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{loc.category}</div>
                  {isGenerated && (
                    <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 'bold', marginTop: '4px' }}>
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
      {(activeRoute || activeTrail) && (activeRoute?.steps || activeTrail?.steps || []).map((step, index) => {
        const stepId = `step-${index}`;
        const stepsArray = activeRoute?.steps || activeTrail?.steps || [];
        const isStart = index === 0;
        const isEnd = index === (stepsArray.length - 1);
        const isSelected = selectedLocation?.id === stepId;

        // Unified Color Scheme: All markers are Orange, only Selected is Blue
        const bgColor = isSelected
          ? '#2563eb' // Blue 600 (Selected)
          : '#f97316'; // Orange 500 (Unselected)

        const scale = isSelected ? 1.3 : 1;
        const zIndex = isSelected ? 150 : 100;

        // Unified styling variables
        const textColor = 'white'; // Always white text
        const borderColor = isSelected ? '#fff' : '#fdba74'; // White border for selected, light orange for others
        const size = isSelected ? '36px' : '32px'; // Slightly larger when selected
        const fontSize = isSelected ? '16px' : '14px'; // Slightly larger font when selected

        return (
          <AdvancedMarker
            key={index}
            position={{ lat: step.coordinates[0], lng: step.coordinates[1] }}
            onClick={() => {
              // Open info window and trigger selection
              setOpenInfoWindow(stepId);

              // Create temp location to trigger selection state
              const tempLocation = {
                id: stepId,
                name: step.name,
                description: step.description,
                category: 'Trail Waypoint' as any,
                coordinates: step.coordinates,
                rating: 0,
                imageUrl: '',
                tips: ''
              };
              onSelectLocation(tempLocation);
            }}
            zIndex={zIndex}
            className="cursor-pointer"
          >
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `${isSelected ? '3px' : '2px'} solid ${borderColor}`,
                fontSize: fontSize,
                fontWeight: 'bold',
                boxShadow: isSelected
                  ? '0 4px 12px rgba(234, 88, 12, 0.4)'
                  : '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.1) translateY(-2px)' : 'scale(1)'
              }}
            >
              {index + 1}
            </div>
            {openInfoWindow === stepId && (
              <InfoWindow onCloseClick={() => setOpenInfoWindow(null)}>
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{index + 1}. {step.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{step.description}</div>

                  {/* Waypoint Metadata */}
                  {index > 0 && stepDistances && stepDistances[index - 1] && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', fontSize: '11px' }}>
                      <div style={{ color: '#2563eb', fontWeight: 'bold' }}>
                        {stepDistances[index - 1]}
                      </div>
                      {stepDurations && stepDurations[index - 1] && (
                        <div style={{ color: '#059669', fontWeight: 'bold' }}>
                          {stepDurations[index - 1]}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Google Maps Link */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(step.name + ' Singapore')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      marginTop: '8px',
                      padding: '6px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textDecoration: 'none'
                    }}
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};



const Directions: React.FC<{
  activeRoute: Route | null;
  activeTrail: Trail | null;
  onDistancesCalculated: (distances: string[], durations: string[], totalDist?: string, totalDur?: string) => void;
}> = ({ activeRoute, activeTrail, onDistancesCalculated }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  // Initialize services
  React.useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true, // Prevent auto-fitting bounds so our custom padding works
      polylineOptions: {
        strokeColor: '#2563eb',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  // Calculate Route
  React.useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const steps = activeRoute?.steps || activeTrail?.steps;

    if (!steps || steps.length < 2) {
      directionsRenderer.setMap(null);
      onDistancesCalculated([], []);
      return;
    }

    directionsRenderer.setMap(map);

    const origin = { lat: steps[0].coordinates[0], lng: steps[0].coordinates[1] };
    const destination = { lat: steps[steps.length - 1].coordinates[0], lng: steps[steps.length - 1].coordinates[1] };

    const waypoints = steps.slice(1, -1).map(step => ({
      location: { lat: step.coordinates[0], lng: step.coordinates[1] },
      stopover: true
    }));

    directionsService.route({
      origin,
      destination,
      waypoints,
      travelMode: 'WALKING' as google.maps.TravelMode
    }).then(response => {
      directionsRenderer.setDirections(response);

      // Extract distances and durations
      if (response.routes[0] && response.routes[0].legs) {
        const dists = response.routes[0].legs.map(leg => leg.distance?.text || '');
        const durs = response.routes[0].legs.map(leg => leg.duration?.text || '');

        // Calculate total distance and duration
        const totalDistVal = response.routes[0].legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
        const totalDurVal = response.routes[0].legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0);

        const totalDistText = (totalDistVal / 1000).toFixed(1) + ' km';
        const totalDurText = Math.round(totalDurVal / 60) + ' min';

        // Pass all data in a single call
        onDistancesCalculated(dists, durs, totalDistText, totalDurText);
        console.log(`🚶 Walking Route: ${totalDistText}, ${totalDurText}`);
      }
    }).catch(e => {
      console.error("Directions request failed:", e);
      console.error("Error details:", {
        message: e.message,
        code: e.code,
        status: e.status
      });
      console.warn("This usually means the Directions API is not enabled or the API key doesn't have permission.");
      console.warn("Go to: https://console.cloud.google.com/apis/library/directions-backend.googleapis.com");
      // Clear the map line if it fails
      directionsRenderer.setMap(null);
      onDistancesCalculated([], []);
    });

  }, [directionsService, directionsRenderer, activeRoute, activeTrail, map, onDistancesCalculated]);

  return null;
};

// ... (MapContent and Directions components remain same)

const MapDisplay: React.FC<MapDisplayProps> = (props) => {
  const [stepDistances, setStepDistances] = useState<string[]>([]);
  const [stepDurations, setStepDurations] = useState<string[]>([]);
  const [totalDistance, setTotalDistance] = useState<string>('');
  const [totalDuration, setTotalDuration] = useState<string>('');

  // Reset distances when route/trail changes
  React.useEffect(() => {
    setStepDistances([]);
    setStepDurations([]);
    setTotalDistance('');
    setTotalDuration('');
  }, [props.activeRoute, props.activeTrail]);

  // Memoize callback to prevent infinite loop
  const handleDistancesCalculated = React.useCallback((distances: string[], durations: string[], totalDist?: string, totalDur?: string) => {
    setStepDistances(distances);
    setStepDurations(durations);
    if (totalDist) setTotalDistance(totalDist);
    if (totalDur) setTotalDuration(totalDur);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Map
        mapId="singapore-stay-guide-map"
        defaultCenter={SINGAPORE_CENTER}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
        onClick={props.onMapClick}
      >
        <MapContent {...props} stepDistances={stepDistances} stepDurations={stepDurations} />
        <Directions
          activeRoute={props.activeRoute}
          activeTrail={props.activeTrail}
          onDistancesCalculated={handleDistancesCalculated}
        />
      </Map>

      {/* Trail Summary Overlay - Positioned to avoid drawer on mobile */}
      {(props.activeRoute || props.activeTrail) && totalDistance && (
        <div className="absolute left-4 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-md border border-gray-200 z-10 flex items-center gap-2.5 bottom-[calc(60vh+1rem)] md:bottom-6">
          <div className="flex items-center gap-1">
            <span className="text-xs">🚶</span>
            <span className="font-bold text-gray-800 text-[10px]">{totalDistance}</span>
          </div>
          <div className="w-px h-2.5 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span className="text-xs">⏱️</span>
            <span className="font-bold text-gray-800 text-[10px]">{totalDuration}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
