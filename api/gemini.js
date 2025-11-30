const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini - using API_KEY to match Vercel environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

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
    You are an expert Singapore Travel Planner and Local Insider.
    EXISTING LOCATIONS: The user has a list of places. Find NEW, distinct gems.
    YOUR ROLE: Act as a "Local Insider". Validate recommendations.
    CRITICAL - TRAIL LOGIC:
    1. GEOGRAPHIC CLUSTERING: Ensure steps are in the same neighborhood.
    2. WALKABILITY: Steps must be 5-15 mins walk apart.
    3. SEQUENCE: Logical order.
    4. ACCURACY: Real coordinates.
    Tone: Enthusiastic but PRACTICAL.
`;

module.exports = async (req, res) => {
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

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            systemInstruction: currentSystemInstruction,
            tools: [{ functionDeclarations: [suggestRouteTool, suggestPlacesTool] }]
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        // Extract function calls
        const functionCalls = response.functionCalls();
        let routeData = null;
        let generatedLocations = null;
        let textResponse = response.text();

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
};
