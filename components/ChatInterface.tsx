
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LocationData, Route, MainTab } from '../types';
import { Send, Sparkles, X, Minimize2, Maximize2, Loader2, MapPin, Compass, Search, RotateCcw, PlusCircle } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';
import { createTravelChat, sendMessageToGemini } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  locations: LocationData[];
  initialContext?: string;
  isOpen: boolean;
  onClose: () => void;
  onRouteGenerated: (route: Route) => void;
  onLocationsGenerated: (locations: LocationData[]) => void;
  onSwitchToTab?: (tab: MainTab) => void;
}

type Tab = 'assistant' | 'discover';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  locations,
  initialContext,
  isOpen,
  onClose,
  onRouteGenerated,
  onLocationsGenerated,
  onSwitchToTab
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('assistant');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  // Discover Tab States
  const [discoverTheme, setDiscoverTheme] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    chatSessionRef.current = createTravelChat(locations);
  }, [locations]);

  useEffect(() => {
    if (initialContext && isOpen) {
      setActiveTab('assistant');
      handleSend(`Tell me more interesting facts and insider tips about ${initialContext}. Please provide information only, don't generate new routes or add new locations.`);
    }
  }, [initialContext, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resetChat = () => {
    setMessages([]);
    chatSessionRef.current = createTravelChat(locations);
    setIsLoading(false);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(chatSessionRef.current, text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Handle Route Generation
      if (response.route) {
        onRouteGenerated(response.route);
        const systemMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'model',
          text: `🗺️ **I've mapped out the "${response.route.title}" for you on the main map!**`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, systemMsg]);
      }

      // Handle Generated Locations
      if (response.generatedLocations && response.generatedLocations.length > 0) {
        onLocationsGenerated(response.generatedLocations);
        const systemMsg: ChatMessage = {
          id: (Date.now() + 3).toString(),
          role: 'model',
          text: `✨ **I've found ${response.generatedLocations.length} new places and added them to your map!**\n\n${response.generatedLocations.map(l => `• **${l.name}** (${l.category})`).join('\n')}`,
          timestamp: new Date(),
          action: 'view_ai_picks'
        }
        setMessages(prev => [...prev, systemMsg]);
      }

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the travel network right now. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscoverSubmit = () => {
    if (!discoverTheme.trim()) return;
    setActiveTab('assistant'); // Switch to chat view to see results
    handleSend(`Can you curate a list of places in Singapore matching the theme: "${discoverTheme}"? Please use the suggest_places tool to add them to my map.`);
    setDiscoverTheme('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestPrompt = (prompt: string) => {
    handleSend(prompt);
  }

  if (!isOpen) return null;

  return (
    <div className={`fixed z-30 transition-all duration-300 shadow-2xl bg-white border border-gray-200 overflow-hidden flex flex-col
      ${isMinimized
        ? 'bottom-4 right-4 w-72 h-14 rounded-full'
        : 'bottom-0 right-0 w-full md:bottom-6 md:right-6 md:w-[450px] md:h-[80vh] md:rounded-2xl h-[60vh] rounded-t-2xl'
      }`}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 shrink-0 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center text-white space-x-2">
          <Sparkles size={20} />
          <h3 className="font-semibold text-xs md:text-sm">Travel Assistant</h3>
        </div>
        <div className="flex items-center text-white/80 space-x-2">
          {!isMinimized && messages.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); resetChat(); }}
              className="hover:text-white transition-colors p-1"
              title="Reset Chat"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          {!isMinimized && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white shrink-0">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'assistant'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Chat Assistant
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'discover'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <PlusCircle size={14} />
              Generator
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'assistant' ? (
            // --- ASSISTANT TAB ---
            <>
              <div className="flex-1 bg-gray-50 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-3 px-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <Compass size={28} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Plan your Singapore adventure</p>
                      <p className="text-xs text-gray-500 mt-1">Ask me to generate a route or itinerary:</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                      <button
                        onClick={() => suggestPrompt("Suggest a 1-day Heritage Trail visiting historical sites. Keep it walkable.")}
                        className="text-xs bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                      >
                        <span>🏛️</span> 1-Day Heritage Trail
                      </button>
                      <button
                        onClick={() => suggestPrompt("Create a Local Food Trail. Group the spots by neighborhood so I can walk.")}
                        className="text-xs bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                      >
                        <span>🍜</span> Local Food Trail
                      </button>
                      <button
                        onClick={() => suggestPrompt("Suggest a nature hiking route. Ensure the path is connected and walkable.")}
                        className="text-xs bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                      >
                        <span>🌳</span> Nature Route
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[90%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.isError
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-2 prose-a:text-blue-400 hover:prose-a:underline">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                      {msg.action === 'view_ai_picks' && onSwitchToTab && (
                        <button
                          onClick={() => onSwitchToTab('ai-picks')}
                          className="mt-2 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 w-fit"
                        >
                          <Sparkles size={12} />
                          View in AI Picks
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100 flex items-center space-x-2">
                      <Loader2 size={14} className="animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask for a route..."
                    className="w-full pl-3 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-900 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className={`absolute right-1.5 p-1.5 rounded-lg transition-all ${input.trim() && !isLoading
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <Send size={14} />
                  </button>
                </div>
                <div className="text-[10px] text-gray-400 text-center mt-1.5 flex justify-center items-center gap-1">
                  <Sparkles size={8} />
                  <span>Powered by Gemini</span>
                </div>
              </div>
            </>
          ) : (
            // --- GENERATOR TAB (DISCOVER) ---
            <div className="flex-1 bg-gray-50 flex flex-col max-h-full overflow-y-auto">
              <div className="flex flex-col items-center justify-start p-4 text-center">
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <PlusCircle size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Generate & Add Locations</h3>
                <p className="text-xs text-gray-600 mb-1 max-w-[90%] leading-relaxed">
                  Describe a theme or vibe, and AI will curate personalized locations for your Singapore adventure.
                </p>
                <p className="text-[10px] text-gray-400 mb-6 max-w-[85%]">
                  Try: "Hidden speakeasies", "Cyberpunk cafes", "Romantic rooftops", "Best laksa spots"
                </p>

                <div className="w-full max-w-md space-y-3">
                  <div>
                    <label className="block text-left text-[10px] font-semibold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Enter Your Theme</label>
                    <textarea
                      value={discoverTheme}
                      onChange={(e) => setDiscoverTheme(e.target.value)}
                      placeholder="Describe what you're looking for... (e.g., '1920s Art Deco architecture', 'Late-night hawker centers', 'Instagram-worthy murals')"
                      rows={3}
                      className="w-full p-4 rounded-xl border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm text-gray-900 placeholder-gray-400 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleDiscoverSubmit}
                    disabled={!discoverTheme.trim()}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Generate & Add to Map
                  </button>

                  <div className="pt-6">
                    <p className="text-[10px] text-gray-400 mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['Cyberpunk', 'Romantic Rooftops', 'Minimalist Cafes', 'Haunted Places', 'Street Art', 'Hidden Gems'].map(theme => (
                        <button
                          key={theme}
                          onClick={() => {
                            setDiscoverTheme(theme);
                          }}
                          className="text-[10px] px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )
      }
    </div >
  );
};

export default ChatInterface;
