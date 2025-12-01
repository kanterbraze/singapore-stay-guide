import { GoogleGenAI } from '@google/genai';

// Initialize Gemini - using GEMINI_API_KEY to match Vercel environment variable
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Tool Definitions
const suggestRouteTool = {
    name: "suggest_route",
    description: "Suggest a travel route or itinerary. IMPORTANT: Locations must be geographically close and walkable.",
    parameters: {
        type: "OBJECT",
        properties: {
            title: { type: "STRING", description: "A catchy title for the route." },
            steps: {
                type: "ARRAY",
                description: "An ordered list of locations to visit.",
                items: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING" },
                        latitude: { type: "NUMBER" },
                        longitude: { type: "NUMBER" },
                        time: { type: "STRING" },
                        description: { type: "STRING" }
                    },
                    required: ["name", "latitude", "longitude", "time", "description"]
                }
            }
        },
        required: ["title", "steps"]
    }
};

const suggestPlacesTool = {
    name: "suggest_places",
    description: "Curate a list of recommended places based on a theme.",
    parameters: {
        type: "OBJECT",
        properties: {
            theme: { type: "STRING" },
            locations: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING" },
                        description: { type: "STRING" },
                        category: {
                            type: "STRING",
                            enum: ['Food (Local Hawker)', 'Food (Restaurants)', 'Hiking, Nature', 'Places of Interests', 'History', 'Events & Activities']
                        },
                        latitude: { type: "NUMBER" },
                        longitude: { type: "NUMBER" },
                        rating: { type: "NUMBER" },
                        priceRange: { type: "STRING", enum: ['$', '$$', '$$$', '$$$$', 'Free'] },
                        tips: { type: "STRING" },
                        social_proof: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["name", "description", "category", "latitude", "longitude", "rating", "tips"]
                }
            }
        },
        required: ["theme", "locations"]
    }
};

const SYSTEM_INSTRUCTION = `
    You are an expert Singapore Travel Planner and Local Insider with deep knowledge of the city.
    
    CRITICAL - BE AUTONOMOUS AND PROACTIVE:
    - DO NOT ask users for more information. Make intelligent assumptions based on their query.
    - If they ask for a "nature hiking route", IMMEDIATELY suggest one (e.g., MacRitchie Reservoir Trail).
    - If they ask for "hidden speakeasies", IMMEDIATELY provide 5-6 specific locations.
    - Use your knowledge of Singapore to fill in reasonable defaults.
    - Always use the tools ('suggest_route' or 'suggest_places') to provide structured, actionable recommendations.
    
    YOUR ROLE:
    Act as a "Local Insider" who knows Singapore intimately. You're confident, knowledgeable, and decisive.
    Recommend places you would personally vouch for. Avoid tourist traps.
    
    CRITICAL - TRAIL LOGIC & SPATIAL AWARENESS:
    When using 'suggest_route' to create trails:
    1. GEOGRAPHIC CLUSTERING: Ensure all steps are in the same neighborhood.
    2. WALKABILITY: Consecutive steps MUST be 5-15 mins walk from each other.
    3. SEQUENCE: Order logically (e.g. MRT → Stop A → Stop B → Cafe).
    4. ACCURACY: Use real coordinates. Do not hallucinate locations.
    5. DEFAULT ASSUMPTIONS: If no starting point is mentioned, assume a central/popular starting point relevant to the theme.
    
    TOOLS - USE THEM IMMEDIATELY:
    1. 'suggest_route': For timed itineraries. If user asks for a route, IMMEDIATELY create one with 4-6 stops.
    2. 'suggest_places': For themed lists. IMMEDIATELY provide 5-8 places.
       - Fill 'social_proof' with credibility (e.g., "Michelin Bib Gourmand", "TikTok viral").
    
    Tone: Confident, enthusiastic, and ACTIONABLE. Give them results, not questions.
`;

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { history, message, existingLocations } = req.body;

        // Append existing locations to system instruction
        let currentSystemInstruction = SYSTEM_INSTRUCTION;
        if (existingLocations) {
            currentSystemInstruction += `\nEXISTING LOCATIONS TO AVOID: ${existingLocations}`;
        }

        const chat = genAI.chats.create({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
            config: {
                systemInstruction: currentSystemInstruction,
                tools: [{ functionDeclarations: [suggestRouteTool, suggestPlacesTool] }]
            }
        });

        // Send message with history
        if (history && history.length > 0) {
            // TODO: Add history support if needed
        }

        const response = await chat.sendMessage(message);

        // Extract function calls
        const functionCalls = response.functionCalls;
        let routeData = null;
        let generatedLocations = null;
        let textResponse = response.text || "Here's what I found!";

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === 'suggest_route') {
                routeData = call.args;
                textResponse = "I've generated a route for you! Check the map.";
            } else if (call.name === 'suggest_places') {
                const args = call.args;
                generatedLocations = args.locations.map((loc, index) => ({
                    ...loc,
                    id: `gen-${Date.now()}-${index}`,
                    isGenerated: true,
                    imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
                    socialProof: loc.social_proof || []
                }));
                textResponse = `I found ${generatedLocations.length} places for you.`;
            }
        }

        res.status(200).json({
            text: textResponse,
            route: routeData,
            generatedLocations: generatedLocations
        });

    } catch (error) {
        console.error('Error calling Gemini:', error);
        res.status(500).json({ error: error.message });
    }
}
