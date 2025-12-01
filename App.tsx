
import React, { useState, useMemo, useEffect } from 'react';
import { SINGAPORE_LOCATIONS } from './constants';
import { LocationData, LocationCategory, Route, Trail, MainTab, ListTab } from './types';
import Sidebar from './components/Sidebar';
import MapDisplay from './components/MapDisplay';
import ChatInterface from './components/ChatInterface';
import { Menu, Map as MapIcon, Sparkles } from 'lucide-react';
import { resolveLocation } from './services/geminiService';

// Helper to calculate distance (Haversine Formula) in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(1) + " km";
};

import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | 'All'>('All');
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  // Navigation State (Lifted from Sidebar)
  const [mainTab, setMainTab] = useState<MainTab>('explore');
  const [activeListTabs, setActiveListTabs] = useState<ListTab[]>(['curated']);

  // Persisted State
  const [homeBase, setHomeBase] = useState<LocationData | null>(() => {
    try {
      const saved = localStorage.getItem('sg_homeBase');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [generatedLocations, setGeneratedLocations] = useState<LocationData[]>(() => {
    try {
      const saved = localStorage.getItem('sg_generatedLocations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [generatedTrails, setGeneratedTrails] = useState<Trail[]>(() => {
    try {
      const saved = localStorage.getItem('sg_generatedTrails');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isResolvingBase, setIsResolvingBase] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sg_homeBase', JSON.stringify(homeBase));
  }, [homeBase]);

  useEffect(() => {
    localStorage.setItem('sg_generatedLocations', JSON.stringify(generatedLocations));
  }, [generatedLocations]);

  useEffect(() => {
    localStorage.setItem('sg_generatedTrails', JSON.stringify(generatedTrails));
  }, [generatedTrails]);

  // Merge curated and generated locations, adding distance if home base is set
  const allLocations = useMemo(() => {
    const combined = [...SINGAPORE_LOCATIONS, ...generatedLocations];

    if (!homeBase) return combined;

    return combined.map(loc => ({
      ...loc,
      distanceFromBase: calculateDistance(
        homeBase.coordinates[0], homeBase.coordinates[1],
        loc.coordinates[0], loc.coordinates[1]
      )
    }));
  }, [generatedLocations, homeBase]);

  // Debug: Log state changes
  React.useEffect(() => {
    console.log('📊 State Update: selectedLocation =', selectedLocation?.id, selectedLocation?.name);
    console.log('📊 State Update: isSidebarOpen =', isSidebarOpen);
  }, [selectedLocation, isSidebarOpen]);

  const handleSelectLocation = React.useCallback((location: LocationData) => {
    console.log('🎯 App.tsx: handleSelectLocation called with:', location.id, location.name);
    setSelectedLocation(location);

    // Only clear trail/route if this is NOT a trail waypoint
    const isTrailWaypoint = location.id.startsWith('step-');
    if (!isTrailWaypoint) {
      setActiveTrail(null); // Clear active trail so standard map view takes precedence
      setCurrentRoute(null); // Clear active route so standard map view takes precedence
    }

    setIsSidebarOpen(true); // Open sidebar on mobile when marker clicked
    setIsChatOpen(false); // Minimize chat to show location details in sidebar
  }, []);

  const handleAskAI = React.useCallback((location: LocationData) => {
    setChatContext(location.name);
    setIsChatOpen(true);
  }, []);

  const handleRouteGenerated = React.useCallback((route: Route) => {
    // Create a persistent trail object from the AI route
    const newTrail: Trail = {
      id: `gen-trail-${Date.now()}`,
      name: route.title,
      description: 'Custom AI generated itinerary based on your request.',
      category: 'Urban', // Default fallback
      duration: 'Flexible',
      steps: route.steps
    };

    // Add to list of generated trails
    setGeneratedTrails(prev => [newTrail, ...prev]);

    // Set as active immediately
    setCurrentRoute(null); // Clear temporary route
    setActiveTrail(newTrail); // Activate as a full trail

    // NAVIGATE: Switch to Trails tab
    setMainTab('trails');
    setIsSidebarOpen(true);
  }, []);

  const handleLocationsGenerated = React.useCallback((newLocations: LocationData[]) => {
    // Deduplicate: Only add if name doesn't exist in current lists
    const existingNames = new Set(allLocations.map(l => l.name.toLowerCase()));

    const uniqueNew = newLocations.filter(loc =>
      !existingNames.has(loc.name.toLowerCase())
    );

    if (uniqueNew.length > 0) {
      setGeneratedLocations(prev => [...prev, ...uniqueNew]);

      // NAVIGATE: Switch to Explore -> Ensure Generated is active
      setMainTab('explore');
      setActiveListTabs(prev => prev.includes('generated') ? prev : [...prev, 'generated']);
      setIsSidebarOpen(true);
    }
  }, [allLocations]);

  const handleSetCustomHomeBase = React.useCallback(async (query: string) => {
    console.log('handleSetCustomHomeBase called with:', query);

    // RESET
    if (!query) {
      console.log('Resetting home base');
      setHomeBase(null);
      return;
    }

    setIsResolvingBase(true);

    // Check if it's our special JSON format from Autocomplete
    if (query.startsWith('JSON:')) {
      try {
        const data = JSON.parse(query.substring(5));
        console.log('Parsed place data:', data);
        const newBase: LocationData = {
          id: 'home-base',
          name: data.name,
          description: 'My Home Base',
          category: 'Places of Interests', // dummy category
          coordinates: [data.lat, data.lng],
          rating: 0,
          imageUrl: '',
          tips: '',
        };
        console.log('Setting new home base:', newBase);
        setHomeBase(newBase);
        setIsResolvingBase(false);
        return;
      } catch (e) {
        console.error("Failed to parse place data", e);
      }
    }

    // Fallback to AI resolution (shouldn't be reached with new UI, but good for safety)
    console.log('Using AI resolution fallback');
    const result = await resolveLocation(query);
    if (result) {
      const newBase: LocationData = {
        id: 'home-base',
        name: result.name,
        description: 'My Home Base',
        category: 'Places of Interests', // dummy category
        coordinates: result.coordinates,
        rating: 0,
        imageUrl: '',
        tips: '',
      };
      setHomeBase(newBase);
    }
    setIsResolvingBase(false);
  }, []);

  const handleSelectTrail = React.useCallback((trail: Trail) => {
    setActiveTrail(trail);
    setCurrentRoute(null); // Deselect generated route
    setSelectedLocation(null); // Clear selected location
    setIsSidebarOpen(true); // Auto-expand drawer when trail is selected
  }, []);

  // Debug log for render
  console.log('🖼️ App Render: Passing selectedLocation to MapDisplay:', selectedLocation?.id);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans">
        {/* ... content ... */}
        {!isChatOpen && (
          <div className="fixed bottom-6 right-6 z-40 md:hidden">
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg text-white active:scale-95 transition-transform"
            >
              <Sparkles size={24} />
            </button>
          </div>
        )}

        {/* Sidebar Container */}
        {/* Sidebar Container (Bottom Sheet on Mobile, Sidebar on Desktop) */}
        <div
          onClick={() => {
            // Auto-expand if minimized and clicked
            if (!isSidebarOpen) {
              console.log('📱 Minimized drawer clicked, expanding...');
              setIsSidebarOpen(true);
            }
          }}
          className={`
        fixed z-30 transition-all duration-500 ease-in-out shadow-2xl
        md:relative md:inset-auto md:h-full md:shadow-none md:translate-x-0
        ${isSidebarOpen
              ? 'inset-x-0 bottom-0 h-[60vh] rounded-t-2xl md:rounded-none md:w-auto' // Expanded
              : 'inset-x-0 bottom-0 h-32 rounded-t-2xl md:rounded-none md:w-0 md:overflow-hidden' // Minimized/Collapsed - increased from h-20
            }
        md:block
      `}>
          <Sidebar
            locations={allLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            onCloseSelection={() => setSelectedLocation(null)}
            onAskAI={handleAskAI}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            homeBase={homeBase}
            onSetCustomHomeBase={handleSetCustomHomeBase}
            isResolvingBase={isResolvingBase}
            onSelectTrail={handleSelectTrail}
            activeTrailId={activeTrail?.id || null}
            generatedTrails={generatedTrails}

            // Navigation Props
            activeMainTab={mainTab}
            onMainTabChange={setMainTab}
            activeListTabs={activeListTabs}
            onListTabChange={setActiveListTabs}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative h-full transition-all duration-500">
          <MapDisplay
            locations={allLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            activeRoute={currentRoute}
            activeTrail={activeTrail}
            homeBase={homeBase}
            onMapClick={() => setIsSidebarOpen(false)}
          />

          {/* Floating AI Button (Desktop) */}
          {!isChatOpen && (
            <div className="hidden md:block absolute bottom-8 right-8 z-20">
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center space-x-2 px-5 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-full shadow-xl border border-gray-100 transition-all hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-full text-white group-hover:rotate-12 transition-transform">
                  <Sparkles size={16} />
                </div>
                <span className="font-medium">Generate AI Itinerary</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Chat Interface */}
        <ChatInterface
          locations={allLocations} // Pass all locations so AI knows what is currently available
          initialContext={chatContext}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onRouteGenerated={handleRouteGenerated}
          onLocationsGenerated={handleLocationsGenerated}
        />

      </div>
    </APIProvider>
  );
}

export default App;
