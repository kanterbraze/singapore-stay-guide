
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationData, Route, Trail } from '../types';

// Fix for default Leaflet markers in React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a distinct icon for AI generated locations (Purple)
const AiIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a distinct icon for Home Base (Green/House)
const HomeIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #16a34a; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
           </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to create numbered icons for the route
const createNumberedIcon = (number: number, color: string = '#2563eb') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

interface MapDisplayProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (location: LocationData) => void;
  activeRoute: Route | null;
  activeTrail: Trail | null;
  homeBase: LocationData | null;
}

// Component to handle map movement
const MapUpdater: React.FC<{ center: [number, number] | null, bounds: L.LatLngBoundsExpression | null }> = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, bounds, map]);
  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({ locations, selectedLocation, onSelectLocation, activeRoute, activeTrail, homeBase }) => {
  const center: [number, number] = [1.3521, 103.8198]; // Center of Singapore

  // Calculate bounds if a route is active
  const routeBounds = React.useMemo(() => {
    if (activeRoute && activeRoute.steps.length > 0) {
      const coords = activeRoute.steps.map(s => s.coordinates);
      return coords as L.LatLngBoundsExpression;
    } else if (activeTrail && activeTrail.steps.length > 0) {
      const coords = activeTrail.steps.map(s => s.coordinates);
      return coords as L.LatLngBoundsExpression;
    }
    return null;
  }, [activeRoute, activeTrail]);

  // Memoize location markers
  const locationMarkers = React.useMemo(() => {
    return locations.map((loc) => {
      // If location is home base, don't render standard marker
      if (homeBase && loc.id === homeBase.id) return null;

      return (
        <Marker
          key={loc.id}
          position={loc.coordinates}
          icon={loc.isGenerated ? AiIcon : DefaultIcon}
          eventHandlers={{
            click: () => onSelectLocation(loc),
          }}
          opacity={activeTrail ? 0.4 : 1} // Fade others when trail is active
        >
          <Popup>
            <div className="text-sm font-semibold">{loc.name}</div>
            <div className="text-xs text-gray-500">{loc.category}</div>
            {loc.isGenerated && <div className="text-[10px] text-purple-600 font-bold mt-1">✨ AI Discovery</div>}
          </Popup>
        </Marker>
      );
    });
  }, [locations, homeBase, activeTrail, onSelectLocation]);

  // Memoize route markers
  const routeMarkers = React.useMemo(() => {
    if (!activeRoute) return null;
    return (
      <>
        <Polyline
          positions={activeRoute.steps.map(s => s.coordinates)}
          pathOptions={{ color: '#2563eb', weight: 5, dashArray: '1, 6', opacity: 0.9, lineCap: 'round' }}
        />
        {activeRoute.steps.map((step, index) => (
          <Marker
            key={`route-${index}`}
            position={step.coordinates}
            icon={createNumberedIcon(index + 1)}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="p-1">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded mb-1">
                  {step.time}
                </span>
                <div className="text-sm font-bold text-gray-900">{step.name}</div>
                <div className="text-xs text-gray-600 mt-1 max-w-[150px]">{step.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    );
  }, [activeRoute]);

  // Memoize trail markers
  const trailMarkers = React.useMemo(() => {
    if (!activeTrail) return null;
    return (
      <>
        <Polyline
          positions={activeTrail.steps.map(s => s.coordinates)}
          pathOptions={{ color: '#ea580c', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
        />
        {activeTrail.steps.map((step, index) => (
          <Marker
            key={`trail-${index}`}
            position={step.coordinates}
            icon={createNumberedIcon(index + 1, '#ea580c')}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="p-1">
                <div className="text-sm font-bold text-gray-900">{step.name}</div>
                <div className="text-xs text-gray-600 mt-1 max-w-[150px]">{step.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    );
  }, [activeTrail]);

  return (
    <div className="w-full h-full bg-[#f0ede5] relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full outline-none"
        zoomControl={false}
      >
        {/* CartoDB Voyager - Accessible, clean, supports high zoom */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Home Base Marker */}
        {homeBase && (
          <Marker
            position={homeBase.coordinates}
            icon={HomeIcon}
            zIndexOffset={1000}
            eventHandlers={{
              click: () => onSelectLocation(homeBase),
            }}
          >
            <Popup>
              <div className="text-center">
                <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Home Base</div>
                <div className="text-sm font-bold">{homeBase.name}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Location Markers */}
        {locationMarkers}

        {/* AI Route Visualization */}
        {routeMarkers}

        {/* Pre-defined Trail Visualization */}
        {trailMarkers}

        <MapUpdater
          center={selectedLocation ? selectedLocation.coordinates : null}
          bounds={routeBounds}
        />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
