
import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
import { LocationData, Route } from "../types";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Set VITE_GEMINI_PROXY_URL or API_KEY in .env.local');
    }
    console.warn('⚠️ Using direct Gemini API mode. For production, set VITE_GEMINI_PROXY_URL to use secure backend proxy.');
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// Define the tool for suggesting routes
const suggestRouteTool: FunctionDeclaration = {
  name: "suggest_route",
  description: "Suggest a travel route or itinerary. IMPORTANT: Locations must be geographically close and walkable for a pleasant experience.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A catchy title for the route (e.g., 'Joo Chiat Heritage Walk')."
      },
      steps: {
        type: Type.ARRAY,
        description: "An ordered list of locations to visit. These MUST be geographically close to each other.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the location." },
            latitude: { type: Type.NUMBER, description: "Latitude of the location." },
            longitude: { type: Type.NUMBER, description: "Longitude of the location." },
            time: { type: Type.STRING, description: "Suggested time to visit (e.g., '09:00 AM')." },
            description: { type: Type.STRING, description: "Short activity description. Mention walking time from previous spot." }
          },
          required: ["name", "latitude", "longitude", "time", "description"]
        }
      }
    },
    required: ["title", "steps"]
  }
};

// Define the tool for generating new location recommendations
const suggestPlacesTool: FunctionDeclaration = {
  name: "suggest_places",
  description: "Curate a list of recommended places based on a theme. Returns structured data including coordinates and social proof.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      theme: { type: Type.STRING, description: "The theme of the recommendations." },
      locations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: ['Food (Local Hawker)', 'Food (Restaurants)', 'Hiking, Nature', 'Places of Interests', 'History', 'Events & Activities']
            },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER },
            rating: { type: Type.NUMBER },
            priceRange: { type: Type.STRING, enum: ['$', '$$', '$$$', '$$$$', 'Free'] },
            tips: { type: Type.STRING },
            social_proof: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Short validation strings (e.g. 'Michelin Bib Gourmand', 'Featured on LadyIronChef', '4.8 stars on Google')"
            }
          },
          required: ["name", "description", "category", "latitude", "longitude", "rating", "tips"]
        }
      }
    },
    required: ["theme", "locations"]
  }
};

export const createTravelChat = (locations: LocationData[]): Chat => {
  const client = getClient();

  // Construct a system instruction that gives the model context about the "Sheet" data
  // This helps it avoid duplicating existing curated locations
  const existingNames = locations.map(l => l.name).join(', ');

  const systemInstruction = `
    You are an expert Singapore Travel Planner and Local Insider.
    
    EXISTING LOCATIONS:
    The user already has these places in their list: ${existingNames}.
    When using 'suggest_places', DO NOT recommend these again. Find NEW, distinct gems.
    
    YOUR ROLE:
    Act as a "Local Insider" (like a foodie blogger or heritage expert).
    Validate your recommendations against local knowledge (e.g. "Is this place actually good?", "Is it a tourist trap?").
    
    CRITICAL - TRAIL LOGIC & SPATIAL AWARENESS:
    When using 'suggest_route' to create trails:
    1. GEOGRAPHIC CLUSTERING: Ensure all steps are in the same specific neighborhood (e.g., "Katong", "Civic District", "Tiong Bahru"). DO NOT create trails that jump across the island (e.g. Jurong to Changi) unless specifically asked for a "driving tour".
    2. WALKABILITY: Consecutive steps MUST be within walking distance (5-15 mins) of each other. The route should flow logically.
    3. SEQUENCE: Order the steps logically (e.g. Start at MRT -> Stop A -> Stop B -> End at Cafe).
    4. ACCURACY: Do not hallucinate locations. Ensure coordinates are real.
    
    TOOLS:
    1. 'suggest_route': For detailed timed itineraries.
    2. 'suggest_places': For curating lists of NEW places based on a vibe/theme. 
       - When using this, fill the 'social_proof' field with credibility markers (e.g. "Best Laksa 2023 award", "Viral on TikTok", "Historic 1920s decor").
       - Ensure coordinates are accurate.
    
    Tone: Enthusiastic but PRACTICAL. Focus on logistics and real walkability.
  `;

  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction.trim(),
      tools: [
        { functionDeclarations: [suggestRouteTool, suggestPlacesTool] }
      ],
    }
  });
};

export interface GeminiResponse {
  text: string;
  route?: Route;
  generatedLocations?: LocationData[];
}

const PROXY_URL = import.meta.env.VITE_GEMINI_PROXY_URL;

export const sendMessageToGemini = async (chat: Chat, message: string, history: any[] = [], existingLocations: LocationData[] = []): Promise<GeminiResponse> => {
  // PROXY MODE (Secure)
  if (PROXY_URL) {
    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.parts[0].text }] // Simplify history for transport
          })),
          existingLocations: existingLocations.map(l => l.name).join(', ')
        })
      });

      if (!response.ok) throw new Error('Proxy call failed');
      return await response.json();
    } catch (error) {
      console.error("Proxy Error:", error);
      throw error;
    }
  }

  // DIRECT MODE (Dev/Legacy)
  try {
    let response: GenerateContentResponse = await chat.sendMessage({ message });
    let routeData: Route | undefined;
    let generatedLocations: LocationData[] | undefined;

    // Check for function calls
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];

      if (call.name === 'suggest_route') {
        const args = call.args as any;
        routeData = {
          title: args.title,
          steps: args.steps.map((s: any) => ({
            name: s.name,
            coordinates: [s.latitude, s.longitude],
            time: s.time,
            description: s.description
          }))
        };

        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: 'suggest_route',
              response: { result: "Route displayed on map successfully." }
            }
          }]
        });
      } else if (call.name === 'suggest_places') {
        const args = call.args as any;
        // Transform args into LocationData
        generatedLocations = args.locations.map((loc: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          name: loc.name,
          description: loc.description,
          category: loc.category,
          coordinates: [loc.latitude, loc.longitude],
          rating: loc.rating,
          imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
          priceRange: loc.priceRange || '$$',
          tips: loc.tips,
          isGenerated: true,
          socialProof: loc.social_proof || []
        }));

        response = await chat.sendMessage({
          message: [{
            functionResponse: {
              name: 'suggest_places',
              response: { result: `Found ${generatedLocations?.length} places matching the theme.` }
            }
          }]
        });
      }
    }

    return {
      text: response.text || "Here is your plan!",
      route: routeData,
      generatedLocations: generatedLocations
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// New function to resolve user input for Home Base
export const resolveLocation = async (query: string): Promise<{ name: string, coordinates: [number, number] } | null> => {
  const prompt = `
      Identify the location '${query}' in Singapore. 
      IMPORTANT: If the input consists of 6 digits (e.g., 123456), treat it as a Singapore Postal Code.
      Return ONLY a JSON object with: { "name": "Official Name", "latitude": 1.23, "longitude": 103.45 }
    `;

  // PROXY MODE
  if (PROXY_URL) {
    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      // The proxy returns { text: "JSON string" }
      // We need to parse the text content which might be wrapped in markdown code blocks
      let jsonStr = data.text;
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(jsonStr);
      return {
        name: result.name,
        coordinates: [result.latitude, result.longitude]
      };
    } catch (e) {
      console.error("Proxy Resolve Error:", e);
      return null;
    }
  }

  // DIRECT MODE
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER },
          },
          required: ['name', 'latitude', 'longitude']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        name: data.name,
        coordinates: [data.latitude, data.longitude]
      };
    }
    return null;
  } catch (e) {
    console.error("Error resolving location:", e);
    return null;
  }
};
