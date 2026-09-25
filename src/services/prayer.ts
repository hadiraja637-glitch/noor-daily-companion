export type PrayerName =
  | 'Fajr'
  | 'Sunrise'
  | 'Dhuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha';

export interface PrayerLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export interface PrayerTiming {
  name: PrayerName;
  time: string;
  minutes: number;
}

export interface PrayerData {
  location: PrayerLocation;
  timings: PrayerTiming[];
  hijriDate: string;
  readableDate: string;
  timezone?: string;
}

export const DEFAULT_LOCATION: PrayerLocation = {
  name: 'Islamabad, Pakistan',
  country: 'Pakistan',
  lat: 33.6844,
  lon: 73.0479,
};

export const CITY_OPTIONS: PrayerLocation[] = [
  DEFAULT_LOCATION,
  { name: 'Lahore, Pakistan', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi, Pakistan', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
  { name: 'Rawalpindi, Pakistan', country: 'Pakistan', lat: 33.5651, lon: 73.0169 },
  { name: 'Faisalabad, Pakistan', country: 'Pakistan', lat: 31.4504, lon: 73.1350 },
  { name: 'Gujrat, Pakistan', country: 'Pakistan', lat: 32.5739, lon: 74.0796 },
  { name: 'Multan, Pakistan', country: 'Pakistan', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar, Pakistan', country: 'Pakistan', lat: 34.0151, lon: 71.5805 },
  { name: 'Sialkot, Pakistan', country: 'Pakistan', lat: 32.4945, lon: 74.5229 },
  { name: 'Quetta, Pakistan', country: 'Pakistan', lat: 30.1798, lon: 66.9750 },
];

const MAIN_PRAYERS: PrayerName[] = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

function toMinutes(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);

  if (!match) return 0;

  return Number(match[1]) * 60 + Number(match[2]);
}

function normalizeTime(value: string): string {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return value;
  return String(Number(match[1])).padStart(2, '0') + ':' + match[2];
}

function formatDisplayTime(time: string): string {
  const [h, m] = time.split(':').map(Number);

  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;

  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function dateParam(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

function hijriLabel(hijri: any): string {
  if (!hijri) return '';

  const month = hijri.month?.en ?? '';

  return `${hijri.day} ${month} ${hijri.year} ${
    hijri.designation?.abbreviated ?? 'AH'
  }`;
}

async function requestJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Prayer API request failed (${response.status})`);
  }

  const json = await response.json();

  if (json?.code !== 200) {
    throw new Error(
      json?.status || 'Prayer API returned an error'
    );
  }

  return json.data;
}

/**
 * Converts GPS coordinates into a readable city/location.
 * Works worldwide instead of depending on a fixed city list.
 */
export async function getCityFromCoordinates(
  lat: number,
  lon: number
): Promise<PrayerLocation> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=10&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Location service unavailable');
    }

    const data = await response.json();

    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state ||
      'Current Location';

    const country = address.country || '';

    return {
      name: country ? `${city}, ${country}` : city,
      country,
      lat,
      lon,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);

    return {
      name: 'Current Location',
      lat,
      lon,
    };
  }
}

/**
 * Search any city/place worldwide.
 *
 * Example:
 * London
 * Sahiwal
 * New York
 * Albbruck
 * Makkah
 * any small town/village
 */
export async function searchWorldwideLocation(
  query: string
): Promise<PrayerLocation | null> {
  if (!query.trim()) return null;

  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json` +
      `&q=${encodeURIComponent(query)}` +
      `&limit=1` +
      `&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Worldwide location search failed');
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    const result = results[0];

    const address = result.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state ||
      result.display_name ||
      query;

    const country = address.country || '';

    return {
      name: country ? `${city}, ${country}` : city,
      country,
      lat: Number(result.lat),
      lon: Number(result.lon),
    };
  } catch (error) {
    console.error('Worldwide location search error:', error);
    return null;
  }
}

export async function fetchPrayerData(
  location: PrayerLocation
): Promise<PrayerData> {
  const date = dateParam();

  const url = new URL(
    `https://api.aladhan.com/v1/timings/${date}`
  );

  url.searchParams.set('latitude', String(location.lat));
  url.searchParams.set('longitude', String(location.lon));

  // MWL calculation method
  url.searchParams.set('method', '3');

  // Hanafi Asr calculation
  url.searchParams.set('school', '1');

  url.searchParams.set('iso8601', 'false');

  const data = await requestJson(url.toString());

  const timings = MAIN_PRAYERS.map((name) => {
    const normalized = normalizeTime(data.timings[name]);

    return {
      name,
      time: formatDisplayTime(normalized),
      minutes: toMinutes(normalized),
    };
  });

  return {
    location,
    timings,
    hijriDate: hijriLabel(data.date?.hijri),
    readableDate:
      data.date?.readable ??
      new Date().toLocaleDateString('en-US', {
        dateStyle: 'long',
      }),
    timezone:
      data.meta?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function getCurrentAndNextPrayer(
  timings: PrayerTiming[],
  now = new Date(),
  timeZone?: string
) {
  let mins =
    now.getHours() * 60 +
    now.getMinutes() +
    now.getSeconds() / 60;

  /*
   * Use the prayer location's timezone when available.
   * This is important for worldwide locations.
   */
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).formatToParts(now);

      const hour = Number(
        parts.find((p) => p.type === 'hour')?.value ?? 0
      );

      const minute = Number(
        parts.find((p) => p.type === 'minute')?.value ?? 0
      );

      const second = Number(
        parts.find((p) => p.type === 'second')?.value ?? 0
      );

      mins = hour * 60 + minute + second / 60;
    } catch {
      // Browser local time fallback
    }
  }

  const active = timings.filter(
    (p) => p.name !== 'Sunrise'
  );

  if (!active.length) {
    return {
      current: undefined,
      next: undefined,
      mins,
    };
  }

  let current = active[active.length - 1];
  let next = active[0];

  for (let i = 0; i < active.length; i++) {
    if (mins < active[i].minutes) {
      next = active[i];

      current =
        i === 0
          ? active[active.length - 1]
          : active[i - 1];

      return {
        current,
        next,
        mins,
      };
    }
  }

  // After Isha → next prayer is tomorrow's Fajr
  current = active[active.length - 1];
  next = active[0];

  return {
    current,
    next,
    mins,
  };
}
```
