// Service to fetch photos from Google Places API

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface PlacePhoto {
    photoReference: string;
    width: number;
    height: number;
}

interface PlaceResult {
    place_id: string;
    name: string;
    photos?: PlacePhoto[];
}

/**
 * Search for a place by name and get its photo
 */
export async function getPlacePhoto(placeName: string, fallbackImageUrl: string): Promise<string> {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not configured, using fallback image');
        return fallbackImageUrl;
    }

    try {
        // Use Places API Text Search to find the place
        const searchResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName + ' Singapore')}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (!searchResponse.ok) {
            throw new Error('Places API request failed');
        }

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const place = searchData.results[0];

            if (place.photos && place.photos.length > 0) {
                const photoReference = place.photos[0].photo_reference;

                // Return the Photo URL
                return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
            }
        }

        // No photo found, use fallback
        return fallbackImageUrl;
    } catch (error) {
        console.error(`Error fetching photo for ${placeName}:`, error);
        return fallbackImageUrl;
    }
}

/**
 * Get Google Place Photo URL directly (for use in components)
 * This doesn't make API calls - it returns a static URL that will be fetched when displayed
 */
export function getGooglePlacePhotoUrl(placeName: string): string {
    // For static rendering, we'll use a simpler approach:
    // Just construct the URL using Place Photos without the text search
    // This is more performant and doesn't require API calls during build

    // We'll use a placeholder that will be replaced client-side
    return `/api/place-photo?name=${encodeURIComponent(placeName)}`;
}
