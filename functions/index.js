const { GoogleGenerativeAI } = require('@google/generative-ai');
const functions = require('@google-cloud/functions-framework');

// Initialize Gemini
// Ensure GEMINI_API_KEY is set in your Cloud Function environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Tool Definitions (Copied from Client) ---
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

functions.http('geminiProxy', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { history, message, existingLocations } = req.body;

        // Append existing locations to system instruction context if provided
        let currentSystemInstruction = SYSTEM_INSTRUCTION;
        if (existingLocations) {
            currentSystemInstruction += `\nEXISTING LOCATIONS TO AVOID: ${existingLocations}`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
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
});
