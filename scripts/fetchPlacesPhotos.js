// Script to fetch Google Places photos for all locations
// Run this with: node scripts/fetchPlacesPhotos.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY not found in environment');
    process.exit(1);
}

// Locations to fetch photos for
const locations = [
    { name: 'Braze Singapore Office', id: 'braze-sg' },
    { name: 'Marina Bay Sands Singapore', id: '1' },
    { name: 'Gardens by the Bay Singapore', id: '2' },
    { name: 'Jewel Changi Airport Singapore', id: '3' },
    { name: 'Sentosa Island Singapore', id: '3b' },
    { name: 'Singapore Zoo', id: '3c' },
    { name: 'Merlion Park Singapore', id: '3d' },
    { name: 'Haji Lane Singapore', id: '3e' },
    { name: 'Universal Studios Singapore', id: 'evt-1' },
    { name: 'Singapore Flyer', id: 'evt-2' },
    { name: 'Night Safari Singapore', id: 'evt-3' },
    { name: 'S.E.A. Aquarium Singapore', id: 'evt-4' },
    { name: 'Adventure Cove Waterpark Singapore', id: 'evt-5' },
    { name: 'Maxwell Food Centre Singapore', id: '4' },
    { name: 'Lau Pa Sat Singapore', id: '5' },
    { name: 'Old Airport Road Food Centre Singapore', id: '6' },
    { name: 'Newton Food Centre Singapore', id: '6b' },
    { name: 'Tiong Bahru Market Singapore', id: '6c' },
    { name: 'Tekka Centre Singapore', id: '6d' },
    { name: 'National Museum of Singapore', id: '7' },
    { name: 'Fort Canning Battlebox Singapore', id: '8' },
    { name: 'Chinatown Heritage Centre Singapore', id: '9' },
    { name: 'Asian Civilisations Museum Singapore', id: '9b' },
    { name: 'Kranji War Memorial Singapore', id: '9c' },
    { name: 'Thian Hock Keng Temple Singapore', id: '9d' },
    { name: 'Singapore Botanic Gardens', id: '10' },
    { name: 'MacRitchie Reservoir Park Singapore', id: '11' },
    { name: 'Pulau Ubin Singapore', id: '12' },
    { name: 'Southern Ridges Singapore', id: '12b' },
    { name: 'Sungei Buloh Wetland Reserve Singapore', id: '12c' },
    { name: 'Fort Canning Park Singapore', id: '12d' },
    { name: 'Raffles Hotel Long Bar Singapore', id: '13' },
    { name: 'Odette Restaurant Singapore', id: '14' },
    { name: 'Jumbo Seafood East Coast Singapore', id: '15' },
    { name: 'Atlas Bar Singapore', id: '15b' },
    { name: 'Keng Eng Kee Seafood Singapore', id: '15c' },
    { name: 'CÉ LA VI Singapore', id: '15d' }
];

async function fetchPlacePhoto(placeName) {
    try {
        console.log(`Fetching photo for: ${placeName}`);

        // Use new Places API (v1) - Text Search
        const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
        const searchResponse = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.photos'
            },
            body: JSON.stringify({
                textQuery: placeName
            })
        });

        const searchData = await searchResponse.json();

        if (!searchData.places || searchData.places.length === 0) {
            console.log(`  ❌ No results found for ${placeName}`);
            return null;
        }

        const place = searchData.places[0];

        if (!place.photos || place.photos.length === 0) {
            console.log(`  ⚠️  No photos available for ${placeName}`);
            return null;
        }

        const photoName = place.photos[0].name;
        // New API photo URL format
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${GOOGLE_MAPS_API_KEY}`;

        console.log(`  ✅ Found photo for ${placeName}`);
        return photoUrl;
    } catch (error) {
        console.error(`  ❌ Error fetching photo for ${placeName}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting Google Places photo fetch...\n');

    const results = {};

    for (const location of locations) {
        const photoUrl = await fetchPlacePhoto(location.name);
        if (photoUrl) {
            results[location.id] = photoUrl;
        }
        // Be nice to the API - add a small delay
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Fetched ${Object.keys(results).length} photos out of ${locations.length} locations\n`);

    // Save results to a JSON file
    const outputPath = path.join(__dirname, '../photo-urls.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`📝 Results saved to: photo-urls.json`);
    console.log('\nNext steps:');
    console.log('1. Review the photo-urls.json file');
    console.log('2. Update constants.ts with these URLs');
}

main().catch(console.error);
