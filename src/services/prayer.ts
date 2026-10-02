import {
  PrayerTimes,
  Coordinates,
  CalculationMethod,
  Madhab,
} from 'adhan';

export type PrayerName =
  | 'Fajr'
  | 'Sunrise'
  | 'Dhuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha';

export type CalculationMethodId =
  | 'MWL'
  | 'ISNA'
  | 'Egyptian'
  | 'UmmAlQura'
  | 'Karachi'
  | 'Tehran'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'Singapore'
  | 'MoonsightingCommittee';

export type AsrMethod = 'Hanafi' | 'Shafi';

export interface PrayerLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  timezone?: string;
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

export interface PrayerSettings {
  calculationMethod: CalculationMethodId;
  asrMethod: AsrMethod;
}

export const DEFAULT_LOCATION: PrayerLocation = {
  name: 'Islamabad, Pakistan',
  country: 'Pakistan',
  lat: 33.6844,
  lon: 73.0479,
};

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  calculationMethod: 'MWL',
  asrMethod: 'Hanafi',
};

const LOCATION_CONFIRMED_KEY = 'noor-prayer-location-confirmed-v1';

export interface SmartPrayerDefaults {
  location: PrayerLocation;
  settings: PrayerSettings;
  timezone: string;
}

const SMART_TIMEZONE_DEFAULTS: Array<{
  match: (timeZone: string) => boolean;
  location: PrayerLocation;
  calculationMethod: CalculationMethodId;
}> = [
  {
    match: (tz) => tz === 'Asia/Riyadh' || tz === 'Asia/Jeddah',
    location: { name: 'Riyadh, Saudi Arabia', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },
    calculationMethod: 'UmmAlQura',
  },
  {
    match: (tz) => tz === 'Asia/Dubai',
    location: { name: 'Dubai, United Arab Emirates', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
    calculationMethod: 'Dubai',
  },
  {
    match: (tz) => tz === 'Asia/Qatar',
    location: { name: 'Doha, Qatar', country: 'Qatar', lat: 25.2854, lon: 51.5310 },
    calculationMethod: 'Qatar',
  },
  {
    match: (tz) => tz === 'Asia/Kuwait',
    location: { name: 'Kuwait City, Kuwait', country: 'Kuwait', lat: 29.3759, lon: 47.9774 },
    calculationMethod: 'Kuwait',
  },
  {
    match: (tz) => tz === 'Asia/Singapore',
    location: { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
    calculationMethod: 'Singapore',
  },
  {
    match: (tz) => tz === 'Asia/Tehran',
    location: { name: 'Tehran, Iran', country: 'Iran', lat: 35.6892, lon: 51.3890 },
    calculationMethod: 'Tehran',
  },
  {
    match: (tz) => tz === 'Africa/Cairo',
    location: { name: 'Cairo, Egypt', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
    calculationMethod: 'Egyptian',
  },
  {
    match: (tz) => tz === 'America/New_York' || tz === 'America/Toronto',
    location: { name: 'New York, United States', country: 'United States', lat: 40.7128, lon: -74.0060 },
    calculationMethod: 'ISNA',
  },
  {
    match: (tz) => tz === 'America/Chicago',
    location: { name: 'Chicago, United States', country: 'United States', lat: 41.8781, lon: -87.6298 },
    calculationMethod: 'ISNA',
  },
  {
    match: (tz) => tz === 'America/Denver',
    location: { name: 'Denver, United States', country: 'United States', lat: 39.7392, lon: -104.9903 },
    calculationMethod: 'ISNA',
  },
  {
    match: (tz) => tz === 'America/Los_Angeles' || tz === 'America/Vancouver',
    location: { name: 'Los Angeles, United States', country: 'United States', lat: 34.0522, lon: -118.2437 },
    calculationMethod: 'ISNA',
  },
  {
    match: (tz) => tz === 'Europe/London',
    location: { name: 'London, United Kingdom', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    calculationMethod: 'MWL',
  },
  {
    match: (tz) => tz === 'Europe/Paris',
    location: { name: 'Paris, France', country: 'France', lat: 48.8566, lon: 2.3522 },
    calculationMethod: 'MWL',
  },
  {
    match: (tz) => tz === 'Europe/Berlin',
    location: { name: 'Berlin, Germany', country: 'Germany', lat: 52.5200, lon: 13.4050 },
    calculationMethod: 'MWL',
  },
];

export function getSmartPrayerDefaults(timeZone?: string): SmartPrayerDefaults {
  const resolvedTimeZone =
    timeZone ||
    (isBrowser() ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC');

  const match = SMART_TIMEZONE_DEFAULTS.find((item) => item.match(resolvedTimeZone));

  if (!match) {
    return {
      timezone: resolvedTimeZone,
      location: { ...DEFAULT_LOCATION, timezone: resolvedTimeZone },
      settings: { ...DEFAULT_PRAYER_SETTINGS },
    };
  }

  return {
    timezone: resolvedTimeZone,
    location: { ...match.location, timezone: resolvedTimeZone },
    settings: {
      calculationMethod: match.calculationMethod,
      asrMethod: DEFAULT_PRAYER_SETTINGS.asrMethod,
    },
  };
}

export const CITY_OPTIONS: PrayerLocation[] = [
  DEFAULT_LOCATION,
  { name: 'Lahore, Pakistan', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi, Pakistan', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
  { name: 'Rawalpindi, Pakistan', country: 'Pakistan', lat: 33.5651, lon: 73.0169 },
  { name: 'Faisalabad, Pakistan', country: 'Pakistan', lat: 31.4504, lon: 73.135 },
  { name: 'Gujrat, Pakistan', country: 'Pakistan', lat: 32.5739, lon: 74.0796 },
  { name: 'Multan, Pakistan', country: 'Pakistan', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar, Pakistan', country: 'Pakistan', lat: 34.0151, lon: 71.5805 },
  { name: 'Sialkot, Pakistan', country: 'Pakistan', lat: 32.4945, lon: 74.5229 },
  { name: 'Quetta, Pakistan', country: 'Pakistan', lat: 30.1798, lon: 66.975 },
];

export const CALCULATION_METHOD_OPTIONS: Array<{
  id: CalculationMethodId;
  label: string;
}> = [
  { id: 'MWL', label: 'Muslim World League (MWL)' },
  { id: 'UmmAlQura', label: 'Umm al-Qura (Makkah)' },
  { id: 'ISNA', label: 'ISNA (North America)' },
  { id: 'Egyptian', label: 'Egyptian General Authority' },
  { id: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'Kuwait', label: 'Kuwait' },
  { id: 'Singapore', label: 'Singapore' },
  { id: 'Tehran', label: 'Tehran' },
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
];

export const ASR_METHOD_OPTIONS: Array<{
  id: AsrMethod;
  label: string;
}> = [
  { id: 'Hanafi', label: 'Hanafi' },
  { id: 'Shafi', label: "Shafi'i" },
];

const SETTINGS_KEY = 'noor-prayer-settings-v2';
const LOCATION_KEY = 'noor-prayer-location';
const DATA_KEY = 'noor-prayer-data-v2';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getPrayerSettings(): PrayerSettings {
  if (!isBrowser()) return DEFAULT_PRAYER_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return getSmartPrayerDefaults().settings;
    const parsed = JSON.parse(raw);

    const method = CALCULATION_METHOD_OPTIONS.some((x) => x.id === parsed?.calculationMethod)
      ? parsed.calculationMethod
      : DEFAULT_PRAYER_SETTINGS.calculationMethod;

    const asr = ASR_METHOD_OPTIONS.some((x) => x.id === parsed?.asrMethod)
      ? parsed.asrMethod
      : DEFAULT_PRAYER_SETTINGS.asrMethod;

    return { calculationMethod: method, asrMethod: asr };
  } catch {
    return DEFAULT_PRAYER_SETTINGS;
  }
}

export function updatePrayerSettings(
  patch: Partial<PrayerSettings>,
): PrayerSettings {
  const next = { ...getPrayerSettings(), ...patch };
  if (isBrowser()) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }
  return next;
}

function getCalculationParameters(settings: PrayerSettings) {
  let params;

  switch (settings.calculationMethod) {
    case 'ISNA':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'Tehran':
      params = CalculationMethod.Tehran();
      break;
    case 'Dubai':
      params = CalculationMethod.Dubai();
      break;
    case 'Qatar':
      params = CalculationMethod.Qatar();
      break;
    case 'Kuwait':
      params = CalculationMethod.Kuwait();
      break;
    case 'Singapore':
      params = CalculationMethod.Singapore();
      break;
    case 'MoonsightingCommittee':
      params = CalculationMethod.MoonsightingCommittee();
      break;
    case 'MWL':
    default:
      params = CalculationMethod.MuslimWorldLeague();
      break;
  }

  params.madhab = settings.asrMethod === 'Hanafi'
    ? Madhab.Hanafi
    : Madhab.Shafi;

  return params;
}

function getTimeZone(location: PrayerLocation): string {
  return (
    location.timezone ||
    (isBrowser()
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC')
  );
}

function formatTime(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}

function timeToMinutes(value: string): number {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'AM' && hour === 12) hour = 0;
  if (period === 'PM' && hour !== 12) hour += 12;

  return hour * 60 + minute;
}

/**
 * PRIMARY prayer calculation.
 * This runs locally in the browser/device; it does not need the prayer API.
 */
export function getLocalPrayerTimings(
  location: PrayerLocation,
  settings: PrayerSettings = getPrayerSettings(),
  date = new Date(),
): PrayerTiming[] {
  const coordinates = new Coordinates(location.lat, location.lon);
  const params = getCalculationParameters(settings);
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const timeZone = getTimeZone(location);

  const values: Array<[PrayerName, Date]> = [
    ['Fajr', prayerTimes.fajr],
    ['Sunrise', prayerTimes.sunrise],
    ['Dhuhr', prayerTimes.dhuhr],
    ['Asr', prayerTimes.asr],
    ['Maghrib', prayerTimes.maghrib],
    ['Isha', prayerTimes.isha],
  ];

  return values.map(([name, dateValue]) => {
    const time = formatTime(dateValue, timeZone);
    return { name, time, minutes: timeToMinutes(time) };
  });
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

function getCachedData(location: PrayerLocation): PrayerData | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PrayerData;
    if (data?.location?.lat !== location.lat || data?.location?.lon !== location.lon) return null;
    return data;
  } catch {
    return null;
  }
}

function saveCachedData(data: PrayerData) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch {
    // Storage may be unavailable; local calculation still works.
  }
}

/**
 * Builds today's prayer data locally. The network is only used below for
 * optional Hijri/timezone metadata; prayer times themselves are local.
 */
export function buildLocalPrayerData(
  location: PrayerLocation,
  settings: PrayerSettings = getPrayerSettings(),
  date = new Date(),
): PrayerData {
  const timezone = getTimeZone(location);
  const timings = getLocalPrayerTimings(location, settings, date);

  const cached = getCachedData(location);

  return {
    location: { ...location, timezone },
    timings,
    hijriDate: cached?.hijriDate ?? '',
    readableDate: cached?.readableDate ?? date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    timezone,
  };
}

/**
 * Optional metadata refresh. Prayer times are ALWAYS calculated locally first.
 * If the API is unavailable, cached/default date metadata is retained.
 */
function getAladhanMethodId(method: CalculationMethodId): string {
  const ids: Record<CalculationMethodId, string> = {
    MWL: '3',
    ISNA: '2',
    Egyptian: '5',
    UmmAlQura: '4',
    Karachi: '1',
    Tehran: '7',
    Dubai: '16',
    Qatar: '10',
    Kuwait: '9',
    Singapore: '11',
    MoonsightingCommittee: '15',
  };

  return ids[method];
}

export async function fetchPrayerData(
  location: PrayerLocation,
  settings: PrayerSettings = getPrayerSettings(),
): Promise<PrayerData> {
  let local = buildLocalPrayerData(location, settings);

  try {
    const url = new URL(`https://api.aladhan.com/v1/timings/${dateParam()}`);
    url.searchParams.set('latitude', String(location.lat));
    url.searchParams.set('longitude', String(location.lon));
    url.searchParams.set('method', getAladhanMethodId(settings.calculationMethod));
    url.searchParams.set('school', settings.asrMethod === 'Hanafi' ? '1' : '0');
    url.searchParams.set('iso8601', 'false');

    const response = await fetch(url.toString());
    if (response.ok) {
      const json = await response.json();
      if (json?.code === 200) {
        const apiData = json.data;
        local = {
          ...local,
          location: {
            ...location,
            timezone: apiData?.meta?.timezone || local.timezone,
          },
          timezone: apiData?.meta?.timezone || local.timezone,
          hijriDate: hijriLabel(apiData?.date?.hijri) || local.hijriDate,
          readableDate: apiData?.date?.readable || local.readableDate,
        };

        // Rebuild once if the API supplied a better IANA timezone.
        if (local.timezone && local.timezone !== location.timezone) {
          const correctedLocation = { ...location, timezone: local.timezone };
          local = {
            ...local,
            location: correctedLocation,
            timings: getLocalPrayerTimings(correctedLocation, settings),
          };
        }
      }
    }
  } catch {
    // Offline/weak connection: local calculation remains fully usable.
  }

  saveCachedData(local);
  return local;
}

export async function getCityFromCoordinates(
  lat: number,
  lon: number,
): Promise<PrayerLocation> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}&zoom=10&addressdetails=1`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Location service unavailable');

    const data = await response.json();
    const address = data.address || {};
    const city =
      address.city || address.town || address.village ||
      address.municipality || address.county || address.state_district ||
      address.state || 'Current Location';
    const country = address.country || '';

    return {
      name: country ? `${city}, ${country}` : city,
      country,
      lat,
      lon,
      timezone: isBrowser()
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : undefined,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      name: 'Current Location',
      lat,
      lon,
      timezone: isBrowser()
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : undefined,
    };
  }
}

export function getCurrentAndNextPrayer(
  timings: PrayerTiming[],
  now = new Date(),
  timeZone?: string,
) {
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
      // Device local time fallback.
    }
  }

  const active = timings.filter((p) => p.name !== 'Sunrise');

  if (!active.length) return { current: undefined, next: undefined, mins };

  for (let i = 0; i < active.length; i += 1) {
    if (mins < active[i].minutes) {
      return {
        current: i === 0 ? active[active.length - 1] : active[i - 1],
        next: active[i],
        mins,
      };
    }
  }

  return {
    current: active[active.length - 1],
    next: active[0],
    mins,
  };
}

export function getSavedLocation(): PrayerLocation {
  if (!isBrowser()) return DEFAULT_LOCATION;

  try {
    const raw = localStorage.getItem(LOCATION_KEY);

    if (!raw) {
      return getSmartPrayerDefaults().location;
    }

    const saved = JSON.parse(raw) as PrayerLocation;
    const confirmed = localStorage.getItem(LOCATION_CONFIRMED_KEY) === 'true';

    // Older Noor installs may have Islamabad saved only because it was the
    // previous hard-coded default. Let the device timezone improve that first visit.
    if (
      !confirmed &&
      saved?.lat === DEFAULT_LOCATION.lat &&
      saved?.lon === DEFAULT_LOCATION.lon
    ) {
      return getSmartPrayerDefaults().location;
    }

    return saved;
  } catch {
    return getSmartPrayerDefaults().location;
  }
}

export function saveLocation(location: PrayerLocation) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    localStorage.setItem(LOCATION_CONFIRMED_KEY, 'true');
  } catch {
    // Ignore storage errors.
  }
}
