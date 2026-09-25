import type { PrayerLocation } from '../services/prayer';

/**
 * Worldwide location search
 *
 * Uses OpenStreetMap Nominatim to find cities, towns and villages
 * anywhere in the world.
 */

export async function searchGlobalLocations(
  query: string
): Promise<PrayerLocation[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  try {
    const url = new URL(
      'https://nominatim.openstreetmap.org/search'
    );

    url.searchParams.set('format', 'json');
    url.searchParams.set('q', trimmedQuery);
    url.searchParams.set('limit', '8');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Location search failed (${response.status})`
      );
    }

    const results = await response.json();

    return results
      .map((item: any): PrayerLocation | null => {
        const lat = Number(item.lat);
        const lon = Number(item.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return null;
        }

        const address = item.address ?? {};

        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          address.state ||
          item.display_name ||
          'Selected Location';

        const country = address.country || '';

        return {
          name: country
            ? `${city}, ${country}`
            : city,
          country,
          lat,
          lon,
        };
      })
      .filter(
        (location: PrayerLocation | null): location is PrayerLocation =>
          location !== null
      );
  } catch (error) {
    console.error('Worldwide location search error:', error);
    return [];
  }
}

/**
 * Creates a PrayerLocation directly from GPS coordinates.
 * This works anywhere the browser provides a location.
 */
export function createLocationFromCoordinates(
  lat: number,
  lon: number,
  name = 'Current Location'
): PrayerLocation {
  return {
    name,
    lat,
    lon,
  };
}
