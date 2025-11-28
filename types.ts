
export type LocationCategory = 
  | 'Food (Local Hawker)'
  | 'Food (Restaurants)'
  | 'Hiking, Nature'
  | 'Places of Interests'
  | 'History'
  | 'Events & Activities';

export interface LocationData {
  id: string;
  name: string;
  description: string;
  category: LocationCategory;
  coordinates: [number, number]; // [lat, lng]
  rating: number;
  imageUrl: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$' | 'Free';
  tips: string;
  isGenerated?: boolean;
  // New fields for extended functionality
  distanceFromBase?: string; // e.g. "1.2 km"
  socialProof?: string[]; // e.g. ["Michelin Bib Gourmand", "Viral on TikTok"]
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum ViewMode {
  MAP = 'MAP',
  LIST = 'LIST',
}

export interface RouteStep {
  name: string;
  coordinates: [number, number]; // [lat, lng]
  time: string;
  description: string;
}

export interface Route {
  title: string;
  steps: RouteStep[];
}

export interface Trail {
  id: string;
  name: string;
  description: string;
  category: 'Heritage' | 'Nature' | 'Food' | 'Culture' | 'Nightlife' | 'Urban';
  duration: string;
  steps: RouteStep[];
}

export type MainTab = 'explore' | 'trails';
export type ListTab = 'curated' | 'generated';
