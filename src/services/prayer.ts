export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

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
  name: 'Gujrat, Pakistan',
  country: 'Pakistan',
  lat: 32.5739,
  lon: 74.0796,
};

export const CITY_OPTIONS: PrayerLocation[] = [
  DEFAULT_LOCATION,
  { name: 'Lahore, Pakistan', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
  { name: 'Islamabad, Pakistan', country: 'Pakistan', lat: 33.6844, lon: 73.0479 },
  { name: 'Rawalpindi, Pakistan', country: 'Pakistan', lat: 33.5651, lon: 73.0169 },
  { name: 'Faisalabad, Pakistan', country: 'Pakistan', lat: 31.4504, lon: 73.1350 },
  { name: 'Karachi, Pakistan', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
  { name: 'Multan, Pakistan', country: 'Pakistan', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar, Pakistan', country: 'Pakistan', lat: 34.0151, lon: 71.5249 },
  { name: 'Sialkot, Pakistan', country: 'Pakistan', lat: 32.4945, lon: 74.5229 },
  { name: 'Quetta, Pakistan', country: 'Pakistan', lat: 30.1798, lon: 66.9750 },
];

const MAIN_PRAYERS: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function toMinutes(value: string): number {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function normalizeTime(value: string): string {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return value;
  return `${String(Number(match[1])).padStart(2, '0')}:${match[2]}`;
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
  return `${hijri.day} ${month} ${hijri.year} ${hijri.designation?.abbreviated ?? 'AH'}`;
}

async function requestJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Prayer API request failed (${response.status})`);
  const json = await response.json();
  if (json?.code !== 200) throw new Error(json?.status || 'Prayer API returned an error');
  return json.data;
}

/**
 * Free Reverse Geocoding API to fetch exact City Name using Lat/Lon coordinates
 */
export async function getCityFromCoordinates(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error('Geocoding service unavailable');
    
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.address?.state_district;
    const country = data.address?.country;

    if (city && country) {
      return `${city}, ${country}`;
    } else if (country) {
      return country;
    }
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
}

export async function fetchPrayerData(location: PrayerLocation): Promise<PrayerData> {
  const date = dateParam();
  const url = new URL(`https://api.aladhan.com/v1/timings/${date}`);
  url.searchParams.set('latitude', String(location.lat));
  url.searchParams.set('longitude', String(location.lon));
  url.searchParams.set('method', '1');
  url.searchParams.set('school', '1');
  url.searchParams.set('iso8601', 'false');

  const data = await requestJson(url.toString());
  const timings = MAIN_PRAYERS.map((name) => {
    const normalized = normalizeTime(data.timings[name]);
    return { name, time: formatDisplayTime(normalized), minutes: toMinutes(normalized) };
  });

  return {
    location,
    timings,
    hijriDate: hijriLabel(data.date?.hijri),
    readableDate: data.date?.readable ?? new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
    timezone: data.meta?.timezone,
  };
}

export async function fetchPrayerDataByCity(city: PrayerLocation): Promise<PrayerData> {
  const date = dateParam();
  const url = new URL(`https://api.aladhan.com/v1/timingsByCity/${date}`);
  url.searchParams.set('city', city.name.split(',')[0]);
  url.searchParams.set('country', city.country ?? 'Pakistan');
  url.searchParams.set('method', '1');
  url.searchParams.set('school', '1');
  url.searchParams.set('iso8601', 'false');

  const data = await requestJson(url.toString());
  const timings = MAIN_PRAYERS.map((name) => {
    const normalized = normalizeTime(data.timings[name]);
    return { name, time: formatDisplayTime(normalized), minutes: toMinutes(normalized) };
  });

  return {
    location: city,
    timings,
    hijriDate: hijriLabel(data.date?.hijri),
    readableDate: data.date?.readable ?? new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
    timezone: data.meta?.timezone,
  };
}

export function getCurrentAndNextPrayer(timings: PrayerTiming[], now = new Date(), timeZone?: string) {
  let mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).formatToParts(now);

      const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
      const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
      const second = Number(parts.find((p) => p.type === 'second')?.value ?? 0);
      mins = hour * 60 + minute + second / 60;
    } catch {
      /* fallback to browser time */
    }
  }

  const active = timings.filter((p) => p.name !== 'Sunrise');
  let current = active[active.length - 1];
  let next = active[0];

  for (let i = 0; i < active.length; i++) {
    if (mins >= active[i].minutes) current = active[i];
    if (mins < active[i].minutes) {
      next = active[i];
      break;
    }
  }

  return { current, next, mins };
}
