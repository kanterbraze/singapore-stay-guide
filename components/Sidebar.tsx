
import React, { useState } from 'react';
import { LocationData, LocationCategory, Trail, MainTab, ListTab } from '../types';
import { MapPin, Info, Star, DollarSign, X, Sparkles, Map, MessageSquareQuote, CheckCircle, Home, Navigation, Footprints, Search, Loader2 } from 'lucide-react';
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
  activeListTab: ListTab;
  onListTabChange: (tab: ListTab) => void;
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
  activeListTab,
  onListTabChange
}) => {
  const [baseInput, setBaseInput] = useState('');

  // Filter based on Tab AND Category
  const displayLocations = locations.filter(loc => {
    // Tab Filter
    if (activeListTab === 'curated' && loc.isGenerated) return false;
    if (activeListTab === 'generated' && !loc.isGenerated) return false;
    
    // Category Filter
    if (selectedCategory !== 'All' && loc.category !== selectedCategory) return false;
    
    return true;
  });

  const generatedCount = locations.filter(l => l.isGenerated).length;

  // Merge curated trails with generated trails for the Trails tab
  const allTrails = [...generatedTrails, ...SINGAPORE_TRAILS];

  const handleBaseSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(baseInput.trim()) {
          onSetCustomHomeBase(baseInput);
      }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Use a distinct placeholder if the main image fails
      e.currentTarget.src = "https://loremflickr.com/800/600/singapore,architecture?lock=42";
  };

  if (selectedLocation) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.name + ' Singapore')}`;
    const isHomeBase = homeBase?.id === selectedLocation.id;

    return (
      <div className="flex flex-col h-full bg-white shadow-xl z-20 w-full md:w-96 overflow-y-auto border-r border-gray-200">
        <div className="relative h-48 sm:h-56 shrink-0">
          <img 
            src={selectedLocation.imageUrl || FALLBACK_IMAGE} 
            alt={selectedLocation.name} 
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onCloseSelection}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
             <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-block px-2 py-1 text-white text-xs font-semibold rounded shadow-sm ${selectedLocation.isGenerated ? 'bg-purple-600' : 'bg-blue-600'}`}>
                  {selectedLocation.category}
                </span>
                {selectedLocation.isGenerated && (
                  <span className="inline-flex items-center px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded gap-1 shadow-sm">
                    <Sparkles size={10} /> AI Discovery
                  </span>
                )}
                {selectedLocation.distanceFromBase && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded gap-1 shadow-sm">
                        <Navigation size={10} /> {selectedLocation.distanceFromBase} from Base
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
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-[10px] font-medium uppercase tracking-wide">
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
             <SparklesIcon />
            Ask AI Assistant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white shadow-xl z-20 w-full md:w-96 border-r border-gray-200">
      
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
          <div className="p-6 pb-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Singapore Guide</h1>
            <p className="text-gray-500 text-sm mt-1 mb-4">
                Explore the Lion City
            </p>

            {/* My Stay Section */}
            <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    <Home size={12} /> My Stay
                </div>
                {homeBase ? (
                    <div className="flex items-center justify-between bg-white p-2 rounded border border-green-200 shadow-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                             <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                             <span className="text-sm font-medium text-slate-800 truncate">{homeBase.name}</span>
                        </div>
                        <button onClick={() => setBaseInput('')} className="text-xs text-blue-600 hover:underline shrink-0 ml-2">
                            Change
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleBaseSubmit} className="flex gap-2 relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={14} className="text-gray-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Hotel or Postal Code (e.g. 123456)"
                            className="flex-1 text-sm pl-9 p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all text-gray-900"
                            value={baseInput}
                            onChange={(e) => setBaseInput(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={!baseInput.trim() || isResolvingBase}
                            className="bg-slate-800 text-white p-2 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            {isResolvingBase ? <Loader2 size={16} className="animate-spin" /> : <span className="text-xs font-bold px-1">SET</span>}
                        </button>
                    </form>
                )}
            </div>
            
            {/* Main Tabs (Explore vs Trails) */}
            <div className="flex border-b border-gray-200 mb-4">
                 <button
                    onClick={() => onMainTabChange('explore')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 ${
                        activeMainTab === 'explore' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Explore Places
                </button>
                <button
                    onClick={() => onMainTabChange('trails')}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 ${
                        activeMainTab === 'trails' 
                        ? 'border-orange-500 text-orange-600' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    Trails
                </button>
            </div>

            {/* Sub-Filters for Explore Tab */}
            {activeMainTab === 'explore' && (
                <>
                    <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
                        <button
                            onClick={() => onListTabChange('curated')}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all shadow-sm ${
                                activeListTab === 'curated' 
                                ? 'bg-white text-gray-900' 
                                : 'text-gray-500 hover:text-gray-700 bg-transparent shadow-none'
                            }`}
                        >
                            Curated Gems
                        </button>
                        <button
                            onClick={() => onListTabChange('generated')}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 shadow-sm ${
                                activeListTab === 'generated' 
                                ? 'bg-purple-600 text-white' 
                                : 'text-gray-500 hover:text-gray-700 bg-transparent shadow-none'
                            }`}
                        >
                            <Sparkles size={10} />
                            AI Discoveries ({generatedCount})
                        </button>
                    </div>

                     {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onSelectCategory(cat)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                    selectedCategory === cat 
                                    ? (activeListTab === 'generated' ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-900 text-white border-gray-900')
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </>
            )}
          </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4 ${activeMainTab === 'explore' && activeListTab === 'generated' ? 'bg-purple-50/30' : 'bg-white'}`}>
        
        {activeMainTab === 'explore' ? (
            // EXPLORE LIST
            <>
                {displayLocations.map((loc) => (
                <div 
                    key={loc.id}
                    onClick={() => onSelectLocation(loc)}
                    className={`group flex gap-4 p-3 rounded-xl cursor-pointer transition-all border shadow-sm relative overflow-hidden
                        ${loc.isGenerated 
                            ? 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md' 
                            : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                        }`}
                >
                    {/* Base Distance Badge */}
                    {loc.distanceFromBase && (
                        <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">
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
                    <h3 className={`font-semibold truncate transition-colors flex items-center gap-2 ${loc.isGenerated ? 'text-purple-900 group-hover:text-purple-700' : 'text-gray-900 group-hover:text-blue-600'}`}>
                        {loc.name}
                    </h3>
                    <p className={`text-xs font-medium mb-1 ${loc.isGenerated ? 'text-purple-600' : 'text-blue-600'}`}>
                        {loc.category}
                    </p>
                    
                    {/* Social Proof Snippet for List View */}
                    {loc.isGenerated && loc.socialProof && loc.socialProof[0] && (
                        <p className="text-[10px] text-gray-500 italic truncate">
                            "{loc.socialProof[0]}"
                        </p>
                    )}
                    
                    {!loc.isGenerated && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin size={12} className="mr-1" />
                            <span>View details</span>
                        </div>
                    )}
                    </div>
                </div>
                ))}
                
                {displayLocations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className={`p-4 rounded-full mb-3 ${activeListTab === 'generated' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                            {activeListTab === 'generated' ? <Sparkles className="text-purple-400" size={24} /> : <Map className="text-gray-400" size={24} />}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No locations found.</p>
                        {activeListTab === 'generated' && (
                            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                                Use the "Discover" tab in the chat assistant to find new places!
                            </p>
                        )}
                    </div>
                )}
            </>
        ) : (
            // TRAILS LIST
            <div className="space-y-4">
                {allTrails.map((trail) => {
                    const isAiTrail = trail.id.startsWith('gen-trail');
                    return (
                    <div 
                        key={trail.id}
                        onClick={() => onSelectTrail(trail)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                            activeTrailId === trail.id 
                            ? (isAiTrail ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' : 'bg-orange-50 border-orange-200 ring-1 ring-orange-200') 
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                    >
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                 {isAiTrail && <Sparkles size={14} className="text-purple-600" />}
                                 <h3 className={`font-bold ${isAiTrail ? 'text-purple-900' : 'text-gray-900'}`}>{trail.name}</h3>
                             </div>
                             <span className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full ${
                                 isAiTrail ? 'text-purple-600 bg-purple-100' : 'text-orange-600 bg-orange-100'
                             }`}>
                                 {trail.category}
                             </span>
                         </div>
                         <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block mb-2">
                             {trail.duration}
                         </div>
                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trail.description}</p>
                         <div className="flex items-center text-xs text-gray-400">
                             <Footprints size={12} className="mr-1" />
                             {trail.steps.length} stops
                         </div>
                    </div>
                )})}
                
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

const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
)

export default Sidebar;
