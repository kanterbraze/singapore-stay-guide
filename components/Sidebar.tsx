import React, { useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { LocationData, LocationCategory, Trail, MainTab, ListTab } from '../types';
import { MapPin, Info, Star, DollarSign, X, Sparkles, Map, MessageSquareQuote, CheckCircle, Home, Navigation, Footprints, Search, Loader2, ArrowLeft, Map as MapIcon } from 'lucide-react';
import { SINGAPORE_TRAILS } from '../constants';

interface SidebarProps {
    locations: LocationData[];
    selectedLocation: LocationData | null;
    onSelectLocation: (location: LocationData) => void;
    onCloseSelection: () => void;
    onAskAI: (location: LocationData) => void;
    selectedCategory: LocationCategory | 'All';
    onSelectCategory: (category: LocationCategory | 'All') => void;
    // Home Base Props
    homeBase: LocationData | null;
    onSetCustomHomeBase: (query: string) => Promise<void>;
    isResolvingBase: boolean;
    // Trail Props
    onSelectTrail: (trail: Trail) => void;
    activeTrailId: string | null;
    generatedTrails: Trail[]; // New prop for AI trails
    // Navigation Props (Controlled)
    activeMainTab: MainTab;
    onMainTabChange: (tab: MainTab) => void;
    activeListTabs: ListTab[];
    onListTabChange: (tabs: ListTab[]) => void;
    onToggleSidebar?: () => void;
}

const CATEGORIES: (LocationCategory | 'All')[] = [
    'All',
    'Food (Local Hawker)',
    'Food (Restaurants)',
    'Hiking, Nature',
    'Places of Interests',
    'History',
    'Events & Activities'
];

// Fallback image in case Unsplash fails
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=800&auto=format&fit=crop";

const Sidebar: React.FC<SidebarProps> = ({
    locations,
    selectedLocation,
    onSelectLocation,
    onCloseSelection,
    onAskAI,
    selectedCategory,
    onSelectCategory,
    homeBase,
    onSetCustomHomeBase,
    isResolvingBase,
    onSelectTrail,
    activeTrailId,
    generatedTrails,
    activeMainTab,
    onMainTabChange,
    activeListTabs,
    onListTabChange,
    onToggleSidebar
}) => {
    const [baseInput, setBaseInput] = useState('');
    const [isMyStayOpen, setIsMyStayOpen] = useState(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
    const [expandedWaypoints, setExpandedWaypoints] = useState<Record<string, boolean>>({});

    // Google Places API (New)
    const placesLibrary = useMapsLibrary('places');

    // Handle input change and fetch predictions using Places API (New)
    const handleBaseInputChange = async (value: string) => {
        setBaseInput(value);

        if (!value.trim() || !placesLibrary) {
            setPredictions([]);
            return;
        }

        setIsLoadingPredictions(true);

        try {
            // Use the new AutocompleteSuggestion API
            const { AutocompleteSuggestion } = placesLibrary;
            const request = {
                input: value,
                includedRegionCodes: ['sg'], // New API uses includedRegionCodes instead of componentRestrictions
                includedPrimaryTypes: ['establishment', 'geocode']
            };

            const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
            setPredictions(suggestions || []);
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
            setPredictions([]);
        } finally {
            setIsLoadingPredictions(false);
        }
    };

    // Handle prediction selection using Places API (New)
    const handlePredictionSelect = async (placePrediction: any) => {
        if (!placesLibrary) return;

        const displayText = placePrediction.placePrediction?.text?.text || placePrediction.queryPrediction?.text?.text || '';
        setBaseInput(displayText);
        setPredictions([]);
        setIsLoadingPredictions(true);

        try {
            // Use the new Place class
            const { Place } = placesLibrary;
            const place = new Place({
                id: placePrediction.placePrediction?.placeId
            });

            // Fetch place details with field mask
            await place.fetchFields({
                fields: ['displayName', 'location']
            });

            if (place.location) {
                const placeData = JSON.stringify({
                    name: place.displayName || displayText,
                    lat: place.location.lat(),
                    lng: place.location.lng()
                });
                console.log('Setting home base:', placeData);
                onSetCustomHomeBase(`JSON:${placeData} `);
                setIsMyStayOpen(false);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        } finally {
            setIsLoadingPredictions(false);
        }
    };

    // Filter based on Category only (no more tab filtering)
    const displayLocations = locations.filter(loc => {
        // Tab Filter
        if (activeMainTab === 'explore' && loc.isGenerated) return false;
        if (activeMainTab === 'ai-picks' && !loc.isGenerated) return false;

        // Category Filter
        if (selectedCategory !== 'All' && loc.category !== selectedCategory) return false;

        return true;
    });

    const generatedCount = locations.filter(l => l.isGenerated).length;

    // Merge curated trails with generated trails for the Trails tab
    const allTrails = [...generatedTrails, ...SINGAPORE_TRAILS];

    const handleBaseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (baseInput.trim()) {
            onSetCustomHomeBase(baseInput);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Use a distinct placeholder if the main image fails
        e.currentTarget.src = "https://loremflickr.com/800/600/singapore,architecture?lock=42";
    };

    if (selectedLocation && !selectedLocation.id.startsWith('step-')) {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.name + ' Singapore')}`;
        const isHomeBase = homeBase?.id === selectedLocation.id;

        return (
            <div className="flex flex-col h-full bg-white shadow-xl z-20 w-full md:w-96 border-r border-gray-200 relative">
                {/* Floating Navbar Overlay - Fixed at top */}
                <div className="absolute top-0 left-0 w-full z-50 p-4 pointer-events-none bg-gradient-to-b from-black/60 to-transparent">
                    <button
                        onClick={onCloseSelection}
                        className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md flex items-center gap-1 pr-3 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="relative h-48 sm:h-56 shrink-0">
                        <img
                            src={selectedLocation.imageUrl || FALLBACK_IMAGE}
                            alt={selectedLocation.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`inline-block px-2 py-1 text-white text-xs font-semibold rounded shadow-sm ${selectedLocation.isGenerated ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {selectedLocation.category}
                                </span>
                                {selectedLocation.isGenerated && (
                                    <span className="inline-flex items-center px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded gap-1 shadow-sm">
                                        <Sparkles size={12} /> AI Discovery
                                    </span>
                                )}
                                {selectedLocation.distanceFromBase && (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded gap-1 shadow-sm">
                                        <Navigation size={12} /> {selectedLocation.distanceFromBase} from Base
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">{selectedLocation.name}</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 pb-24 md:pb-6">
                        {/* Action Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center text-yellow-600 font-bold">
                                    <Star size={16} className="mr-1 fill-yellow-500 text-yellow-500" />
                                    {selectedLocation.rating}
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center text-green-700 font-bold">
                                    <DollarSign size={16} className="mr-0.5" />
                                    {selectedLocation.priceRange || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Badges for AI Items */}
                        {selectedLocation.socialProof && selectedLocation.socialProof.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedLocation.socialProof.map((proof, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-medium uppercase tracking-wide">
                                        {proof}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {selectedLocation.description}
                            </p>
                        </div>

                        <div className={`${selectedLocation.isGenerated ? 'bg-purple-50 border-purple-100' : 'bg-indigo-50 border-indigo-100'} p-4 rounded-xl border`}>
                            <h3 className={`flex items-center font-semibold mb-2 text-sm ${selectedLocation.isGenerated ? 'text-purple-900' : 'text-indigo-900'}`}>
                                <Info size={16} className="mr-2" />
                                Insider Tip
                            </h3>
                            <p className={`${selectedLocation.isGenerated ? 'text-purple-800' : 'text-indigo-800'} text-sm italic`}>
                                "{selectedLocation.tips}"
                            </p>
                        </div>

                        {/* External Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="col-span-1 flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all text-center group"
                            >
                                <Map size={20} className="text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold text-gray-700">Open Maps & Save</span>
                            </a>
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="col-span-1 flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-all text-center group"
                            >
                                <MessageSquareQuote size={20} className="text-orange-500 mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold text-gray-700">Read Reviews</span>
                            </a>
                        </div>

                        <button
                            onClick={() => onAskAI(selectedLocation)}
                            className={`w-full py-3 px-4 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                ${selectedLocation.isGenerated
                                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                }`}
                        >
                            <Sparkles size={20} />
                            Ask AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white md:shadow-xl z-20 w-full md:w-96 border-r border-gray-200 rounded-t-2xl md:rounded-none">

            {/* Mobile Drag Handle */}
            <div
                className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-pointer"
                onClick={onToggleSidebar}
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
                {/* Row 1: Title + My Stay Toggle (Compact) */}
                <div className="px-4 py-2 flex items-center justify-between bg-white">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Singapore Guide</h1>
                        <p className="text-gray-400 text-[10px] font-medium">Explore the Lion City</p>
                    </div>

                    {/* Compact My Stay Toggle */}
                    <button
                        onClick={() => setIsMyStayOpen(!isMyStayOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${homeBase ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                            }`}
                    >
                        <Home size={12} />
                        <span className="max-w-[80px] truncate">{homeBase ? homeBase.name : 'Set Base'}</span>
                    </button>
                </div>

                {/* Collapsible My Stay Content (Absolute overlay to not push content down) */}
                {isMyStayOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-20 p-3 animate-in slide-in-from-top-2 duration-200">
                        {homeBase ? (
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-green-200">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                    <span className="text-sm font-medium text-slate-800 truncate">{homeBase.name}</span>
                                </div>
                                <button
                                    onClick={() => onSetCustomHomeBase('')} // Reset home base
                                    className="text-xs text-blue-600 hover:underline shrink-0 ml-2"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={14} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={baseInput}
                                        onChange={(e) => handleBaseInputChange(e.target.value)}
                                        placeholder="Search for a location..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                    {isLoadingPredictions && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <Loader2 size={14} className="text-gray-400 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                {/* Predictions Dropdown */}
                                {predictions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {predictions.map((suggestion, idx) => {
                                            const mainText = suggestion.placePrediction?.text?.text || suggestion.queryPrediction?.text?.text || '';
                                            const secondaryText = suggestion.placePrediction?.structuredFormat?.secondaryText?.text || '';

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handlePredictionSelect(suggestion)}
                                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <MapPin size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {mainText}
                                                            </div>
                                                            {secondaryText && (
                                                                <div className="text-xs text-gray-500 truncate">
                                                                    {secondaryText}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Row 2: Tabs + Filters (Single Line Scrollable) */}
                <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar bg-gray-50/50">
                    {/* Main Tabs Pills */}
                    <div className="flex bg-gray-200/80 p-0.5 rounded-lg shrink-0">
                        <button
                            onClick={() => onMainTabChange('explore')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeMainTab === 'explore' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => onMainTabChange('ai-picks')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeMainTab === 'ai-picks' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Sparkles size={10} /> AI Picks
                        </button>
                        <button
                            onClick={() => onMainTabChange('trails')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeMainTab === 'trails' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Trails
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-300 shrink-0 mx-1"></div>

                    {/* Sub Filters (For Explore and AI Picks) */}
                    {(activeMainTab === 'explore' || activeMainTab === 'ai-picks') && (
                        <>
                            {/* Categories */}
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => onSelectCategory(selectedCategory === cat ? 'All' : cat)}
                                    className={`shrink-0 whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-500 border-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4 bg-white">

                {activeMainTab !== 'trails' ? (
                    // EXPLORE LIST
                    <>
                        {displayLocations.map((loc) => (
                            <div
                                key={loc.id}
                                onClick={() => onSelectLocation(loc)}
                                className={`group flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all border shadow-sm relative overflow-hidden
                        ${loc.isGenerated
                                        ? 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
                                        : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                                    }`}
                            >
                                {/* Base Distance Badge */}
                                {loc.distanceFromBase && (
                                    <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10">
                                        {loc.distanceFromBase} away
                                    </div>
                                )}

                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200 relative">
                                    <img
                                        src={loc.imageUrl || FALLBACK_IMAGE}
                                        alt={loc.name}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <h3 className={`font-semibold truncate transition-colors flex items-center gap-2 text-sm ${loc.isGenerated ? 'text-purple-900 group-hover:text-purple-700' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                        {loc.name}
                                    </h3>
                                    <p className={`text-xs font-medium mb-0.5 ${loc.isGenerated ? 'text-purple-600' : 'text-blue-600'}`}>
                                        {loc.category}
                                    </p>

                                    {/* Social Proof Snippet for List View */}
                                    {loc.isGenerated && loc.socialProof && loc.socialProof[0] && (
                                        <p className="text-xs text-gray-500 italic truncate">
                                            "{loc.socialProof[0]}"
                                        </p>
                                    )}

                                    {!loc.isGenerated && (
                                        <div className="flex items-center text-xs text-gray-400 mt-0.5">
                                            <MapPin size={12} className="mr-1" />
                                            <span>View details</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {displayLocations.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full mb-3 bg-gray-100">
                                    <Map className="text-gray-400" size={24} />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">No locations found.</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                                    Try selecting a different category or use the AI assistant to discover new places!
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    // TRAILS LIST
                    <div className="space-y-3">
                        {allTrails.map((trail) => {
                            const isAiTrail = trail.id.startsWith('gen-trail');
                            return (
                                <div
                                    key={trail.id}
                                    onClick={() => onSelectTrail(trail)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${activeTrailId === trail.id
                                        ? (isAiTrail ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' : 'bg-orange-50 border-orange-200 ring-1 ring-orange-200')
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {isAiTrail && <Sparkles size={14} className="text-purple-600" />}
                                            <h3 className={`font-bold text-sm ${isAiTrail ? 'text-purple-900' : 'text-gray-900'}`}>{trail.name}</h3>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-full ${isAiTrail ? 'text-purple-600 bg-purple-100' : 'text-orange-600 bg-orange-100'
                                            }`}>
                                            {isAiTrail ? 'AI Recommended' : trail.category}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded inline-block mb-1">
                                        {trail.duration}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{trail.description}</p>
                                    <div className="flex items-center text-[10px] text-gray-400">
                                        <Footprints size={10} className="mr-1" />
                                        {trail.steps.length} stops
                                    </div>

                                    {/* Trail Details Drawer */}
                                    {activeTrailId === trail.id && (
                                        <div className="mt-3 pt-3 border-t border-gray-200/50 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Route Itinerary</h4>
                                            <div className="space-y-2">
                                                {trail.steps.map((step, idx) => {
                                                    const isStart = idx === 0;
                                                    const isEnd = idx === trail.steps.length - 1;
                                                    const waypointKey = `${trail.id}-${idx}`;
                                                    const isExpanded = expandedWaypoints[waypointKey] || false;
                                                    const hasLongDescription = step.description && step.description.length > 80;
                                                    const isWaypointSelected = selectedLocation?.id === `step-${idx}`;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`rounded-lg border transition-all ${isWaypointSelected
                                                                ? 'border-orange-400 bg-orange-50 shadow-sm'
                                                                : 'border-gray-100 hover:border-orange-200'
                                                                }`}
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Create a temporary location to trigger map pan
                                                                    const tempLocation = {
                                                                        id: `step-${idx}`,
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
                                                                className="w-full text-left p-2.5 hover:bg-orange-50/50 transition-all group/waypoint rounded-lg"
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    {/* Number Badge */}
                                                                    <div
                                                                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isStart || isEnd
                                                                            ? 'bg-orange-500 text-white'
                                                                            : 'bg-white text-orange-600 border-2 border-orange-300'
                                                                            }`}
                                                                    >
                                                                        {idx + 1}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-xs font-bold text-gray-800 leading-tight mb-0.5 group-hover/waypoint:text-orange-600 transition-colors">
                                                                            {step.name}
                                                                        </div>
                                                                        {step.description && (
                                                                            <p className={`text-[10px] text-gray-500 leading-relaxed ${!isExpanded && hasLongDescription ? 'line-clamp-2' : ''}`}>
                                                                                {step.description}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Navigate Icon */}
                                                                    <div className="shrink-0 text-gray-400 group-hover/waypoint:text-orange-500 transition-colors">
                                                                        <MapIcon size={12} />
                                                                    </div>
                                                                </div>
                                                            </button>

                                                            {/* Expand/Collapse for long descriptions */}
                                                            {hasLongDescription && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedWaypoints(prev => ({
                                                                            ...prev,
                                                                            [waypointKey]: !prev[waypointKey]
                                                                        }));
                                                                    }}
                                                                    className="w-full px-2.5 pb-2 text-[9px] text-orange-600 hover:text-orange-700 font-medium text-left"
                                                                >
                                                                    {isExpanded ? '▲ Show less' : '▼ Read more'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {allTrails.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No trails found.
                            </div>
                        )}
                    </div>
                )}

            </div>

            <div className="hidden md:block p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
                {activeMainTab === 'explore' ? 'Powered by Gemini AI' : 'Curated by Heritage Board'}
            </div>
        </div>
    );
};

export default Sidebar;
