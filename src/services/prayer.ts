import {
  PrayerTimes,
  Coordinates,
  CalculationMethod,
  Madhab,
  CalculationParameters,
} from 'adhan';

/* =========================================================
   TYPES
========================================================= */

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

export type AsrMethod =
  | 'Hanafi'
  | 'Shafi';

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

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerSettings {
  calculationMethod: CalculationMethodId;
  asrMethod: AsrMethod;
}

/* =========================================================
   DEFAULTS
========================================================= */

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

export const CITY_OPTIONS: PrayerLocation[] = [
  DEFAULT_LOCATION,

  {
    name: 'Lahore, Pakistan',
    country: 'Pakistan',
    lat: 31.5204,
    lon: 74.3587,
  },

  {
    name: 'Karachi, Pakistan',
    country: 'Pakistan',
    lat: 24.8607,
    lon: 67.0011,
  },

  {
    name: 'Rawalpindi, Pakistan',
    country: 'Pakistan',
    lat: 33.5651,
    lon: 73.0169,
  },

  {
    name: 'Faisalabad, Pakistan',
    country: 'Pakistan',
    lat: 31.4504,
    lon: 73.135,
  },

  {
    name: 'Gujrat, Pakistan',
    country: 'Pakistan',
    lat: 32.5739,
    lon: 74.0796,
  },

  {
    name: 'Multan, Pakistan',
    country: 'Pakistan',
    lat: 30.1575,
    lon: 71.5249,
  },

  {
    name: 'Peshawar, Pakistan',
    country: 'Pakistan',
    lat: 34.0151,
    lon: 71.5805,
  },

  {
    name: 'Sialkot, Pakistan',
    country: 'Pakistan',
    lat: 32.4945,
    lon: 74.5229,
  },

  {
    name: 'Quetta, Pakistan',
    country: 'Pakistan',
    lat: 30.1798,
    lon: 66.975,
  },
];

const MAIN_PRAYERS: PrayerName[] = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];

/* =========================================================
   CALCULATION METHOD LABELS
========================================================= */

export const CALCULATION_METHOD_OPTIONS: {
  id: CalculationMethodId;
  label: string;
  description: string;
}[] = [
  {
    id: 'MWL',
    label: 'Muslim World League',
    description: 'Common international calculation method',
  },

  {
    id: 'ISNA',
    label: 'ISNA',
    description: 'Islamic Society of North America',
  },

  {
    id: 'Egyptian',
    label: 'Egyptian General Authority',
    description: 'Egyptian calculation method',
  },

  {
    id: 'UmmAlQura',
    label: 'Umm al-Qura',
    description: 'Umm al-Qura University, Makkah',
  },

  {
    id: 'Karachi',
    label: 'University of Islamic Sciences, Karachi',
    description: 'Commonly used in South Asia',
  },

  {
    id: 'Tehran',
    label: 'Tehran',
    description: 'Institute of Geophysics, University of Tehran',
  },

  {
    id: 'Dubai',
    label: 'Dubai',
    description: 'Dubai calculation method',
  },

  {
    id: 'Qatar',
    label: 'Qatar',
    description: 'Qatar calculation method',
  },

  {
    id: 'Kuwait',
    label: 'Kuwait',
    description: 'Kuwait calculation method',
  },

  {
    id: 'Singapore',
    label: 'Singapore',
    description: 'Singapore calculation method',
  },

  {
    id: 'MoonsightingCommittee',
    label: 'Moonsighting Committee',
    description: 'Seasonal moonsighting-based method',
  },
];

export const ASR_METHOD_OPTIONS: {
  id: AsrMethod;
  label: string;
  description: string;
}[] = [
  {
    id: 'Shafi',
    label: "Shafi'i",
    description: 'Standard shadow-length calculation',
  },

  {
    id: 'Hanafi',
    label: 'Hanafi',
    description: 'Hanafi shadow-length calculation',
  },
];

/* =========================================================
   SETTINGS STORAGE
========================================================= */

const SETTINGS_KEY = 'noor-prayer-settings';

export function getPrayerSettings(): PrayerSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_PRAYER_SETTINGS;
  }

  try {
    const stored =
      window.localStorage.getItem(SETTINGS_KEY);

    if (!stored) {
      return DEFAULT_PRAYER_SETTINGS;
    }

    const parsed = JSON.parse(stored);

    return {
      calculationMethod:
        parsed.calculationMethod ??
        DEFAULT_PRAYER_SETTINGS.calculationMethod,

      asrMethod:
        parsed.asrMethod ??
        DEFAULT_PRAYER_SETTINGS.asrMethod,
    };
  } catch {
    return DEFAULT_PRAYER_SETTINGS;
  }
}

export function savePrayerSettings(
  settings: PrayerSettings
): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error(
      'Could not save prayer settings:',
      error
    );
  }
}

export function updatePrayerSettings(
  settings: Partial<PrayerSettings>
): PrayerSettings {
  const current = getPrayerSettings();

  const updated: PrayerSettings = {
    ...current,
    ...settings,
  };

  savePrayerSettings(updated);

  return updated;
}

/* =========================================================
   ADHAN CALCULATION PARAMETERS
========================================================= */

function getCalculationParameters(
  method: CalculationMethodId,
  asrMethod: AsrMethod
): CalculationParameters {
  let params: CalculationParameters;

  switch (method) {
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
      params =
        CalculationMethod.MoonsightingCommittee();
      break;

    case 'MWL':
    default:
      params =
        CalculationMethod.MuslimWorldLeague();
      break;
  }

  params.madhab =
    asrMethod === 'Hanafi'
      ? Madhab.Hanafi
      : Madhab.Shafi;

  return params;
}

/* =========================================================
   TIMEZONE FORMATTER
========================================================= */

function formatPrayerTime(
  date: Date,
  timeZone?: string
): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone:
        timeZone ||
        Intl.DateTimeFormat().resolvedOptions()
          .timeZone,
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

/* =========================================================
   TIME -> MINUTES
========================================================= */

function timeToMinutes(
  value: string
): number {
  const match = value.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!match) {
    const twentyFour =
      value.match(/(\d{1,2}):(\d{2})/);

    if (!twentyFour) return 0;

    return (
      Number(twentyFour[1]) * 60 +
      Number(twentyFour[2])
    );
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minute;
}

/* =========================================================
   DEVICE-SIDE PRAYER CALCULATION
========================================================= */

/**
 * MAIN FUNCTION
 *
 * Calculates prayer times directly on the device.
 *
 * No prayer-time API request is required.
 */
export function getPrayerTimes(
  latitude?: number,
  longitude?: number,
  settings?: Partial<PrayerSettings>,
  date: Date = new Date(),
  timeZone?: string
): PrayerTimesResult {
  const lat =
    latitude ?? DEFAULT_LOCATION.lat;

  const lng =
    longitude ?? DEFAULT_LOCATION.lon;

  const savedSettings =
    getPrayerSettings();

  const finalSettings: PrayerSettings = {
    ...savedSettings,
    ...settings,
  };

  const coordinates = new Coordinates(
    lat,
    lng
  );

  const params =
    getCalculationParameters(
      finalSettings.calculationMethod,
      finalSettings.asrMethod
    );

  const prayerTimes = new PrayerTimes(
    coordinates,
    date,
    params
  );

  return {
    fajr: formatPrayerTime(
      prayerTimes.fajr,
      timeZone
    ),

    sunrise: formatPrayerTime(
      prayerTimes.sunrise,
      timeZone
    ),

    dhuhr: formatPrayerTime(
      prayerTimes.dhuhr,
      timeZone
    ),

    asr: formatPrayerTime(
      prayerTimes.asr,
      timeZone
    ),

    maghrib: formatPrayerTime(
      prayerTimes.maghrib,
      timeZone
    ),

    isha: formatPrayerTime(
      prayerTimes.isha,
      timeZone
    ),
  };
}

/* =========================================================
   DEVICE PRAYER TIMES -> APP FORMAT
========================================================= */

export function getLocalPrayerTimings(
  location: PrayerLocation,
  settings?: Partial<PrayerSettings>,
  date: Date = new Date()
): PrayerTiming[] {
  const times = getPrayerTimes(
    location.lat,
    location.lon,
    settings,
    date,
    location.timezone
  );

  const result: {
    name: PrayerName;
    time: string;
  }[] = [
    {
      name: 'Fajr',
      time: times.fajr,
    },
    {
      name: 'Sunrise',
      time: times.sunrise,
    },
    {
      name: 'Dhuhr',
      time: times.dhuhr,
    },
    {
      name: 'Asr',
      time: times.asr,
    },
    {
      name: 'Maghrib',
      time: times.maghrib,
    },
    {
      name: 'Isha',
      time: times.isha,
    },
  ];

  return result.map(
    ({ name, time }) => ({
      name,
      time,
      minutes: timeToMinutes(time),
    })
  );
}

/* =========================================================
   BASIC TIME HELPERS FOR API FALLBACK
========================================================= */

function normalizeTime(
  value: string
): string {
  const match =
    value.match(/(\d{1,2}):(\d{2})/);

  if (!match) return value;

  return (
    String(Number(match[1])).padStart(2, '0') +
    ':' +
    match[2]
  );
}

function formatDisplayTime(
  time: string
): string {
  const [h, m] =
    time.split(':').map(Number);

  const suffix =
    h >= 12 ? 'PM' : 'AM';

  const hour =
    h % 12 || 12;

  return `${hour}:${String(m).padStart(
    2,
    '0'
  )} ${suffix}`;
}

function dateParam(
  date = new Date()
): string {
  const dd = String(
    date.getDate()
  ).padStart(2, '0');

  const mm = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const yyyy =
    date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

function hijriLabel(
  hijri: any
): string {
  if (!hijri) return '';

  const month =
    hijri.month?.en ?? '';

  return `${hijri.day} ${month} ${
    hijri.year
  } ${
    hijri.designation?.abbreviated ??
    'AH'
  }`;
}

/* =========================================================
   ALADHAN API
   KEPT FOR HIJRI / FALLBACK / SERVER DATA
========================================================= */

async function requestJson(
  url: string
) {
  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Prayer API request failed (${response.status})`
    );
  }

  const json =
    await response.json();

  if (json?.code !== 200) {
    throw new Error(
      json?.status ||
        'Prayer API returned an error'
    );
  }

  return json.data;
}

/* =========================================================
   REVERSE GEOCODING
========================================================= */

export async function getCityFromCoordinates(
  lat: number,
  lon: number
): Promise<PrayerLocation> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=10` +
      `&addressdetails=1`;

    const response =
      await fetch(url, {
        headers: {
          Accept:
            'application/json',
        },
      });

    if (!response.ok) {
      throw new Error(
        'Location service unavailable'
      );
    }

    const data =
      await response.json();

    const address =
      data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state ||
      'Current Location';

    const country =
      address.country || '';

    return {
      name: country
        ? `${city}, ${country}`
        : city,

      country,
      lat,
      lon,
    };
  } catch (error) {
    console.error(
      'Reverse geocoding error:',
      error
    );

    return {
      name: 'Current Location',
      lat,
      lon,
    };
  }
}

/* =========================================================
   WORLDWIDE LOCATION SEARCH
========================================================= */

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

    const response =
      await fetch(url, {
        headers: {
          Accept:
            'application/json',
        },
      });

    if (!response.ok) {
      throw new Error(
        'Worldwide location search failed'
      );
    }

    const results =
      await response.json();

    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {
      return null;
    }

    const result =
      results[0];

    const address =
      result.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state ||
      result.display_name ||
      query;

    const country =
      address.country || '';

    return {
      name: country
        ? `${city}, ${country}`
        : city,

      country,

      lat: Number(result.lat),

      lon: Number(result.lon),
    };
  } catch (error) {
    console.error(
      'Worldwide location search error:',
      error
    );

    return null;
  }
}

/* =========================================================
   ALADHAN DATA
========================================================= */

export async function fetchPrayerData(
  location: PrayerLocation
): Promise<PrayerData> {
  const date =
    dateParam();

  const url =
    new URL(
      `https://api.aladhan.com/v1/timings/${date}`
    );

  url.searchParams.set(
    'latitude',
    String(location.lat)
  );

  url.searchParams.set(
    'longitude',
    String(location.lon)
  );

  /*
   * API fallback currently uses MWL.
   *
   * The PRIMARY prayer calculation for Noor
   * should use getLocalPrayerTimings().
   */
  url.searchParams.set(
    'method',
    '3'
  );

  url.searchParams.set(
    'school',
    '1'
  );

  url.searchParams.set(
    'iso8601',
    'false'
  );

  const data =
    await requestJson(
      url.toString()
    );

  const timings =
    MAIN_PRAYERS.map(
      (name) => {
        const normalized =
          normalizeTime(
            data.timings[name]
          );

        return {
          name,

          time:
            formatDisplayTime(
              normalized
            ),

          minutes:
            timeToMinutes(
              formatDisplayTime(
                normalized
              )
            ),
        };
      }
    );

  return {
    location,

    timings,

    hijriDate:
      hijriLabel(
        data.date?.hijri
      ),

    readableDate:
      data.date?.readable ??
      new Date().toLocaleDateString(
        'en-US',
        {
          dateStyle: 'long',
        }
      ),

    timezone:
      data.meta?.timezone ||
      location.timezone ||
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone,
  };
}

/* =========================================================
   CURRENT + NEXT PRAYER
========================================================= */

export function getCurrentAndNextPrayer(
  timings: PrayerTiming[],
  now = new Date(),
  timeZone?: string
) {
  let mins =
    now.getHours() * 60 +
    now.getMinutes() +
    now.getSeconds() / 60;

  if (timeZone) {
    try {
      const parts =
        new Intl.DateTimeFormat(
          'en-GB',
          {
            timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        ).formatToParts(now);

      const hour =
        Number(
          parts.find(
            (p) =>
              p.type === 'hour'
          )?.value ?? 0
        );

      const minute =
        Number(
          parts.find(
            (p) =>
              p.type === 'minute'
          )?.value ?? 0
        );

      const second =
        Number(
          parts.find(
            (p) =>
              p.type === 'second'
          )?.value ?? 0
        );

      mins =
        hour * 60 +
        minute +
        second / 60;
    } catch {
      // Local browser time fallback
    }
  }

  const active =
    timings.filter(
      (p) =>
        p.name !== 'Sunrise'
    );

  if (!active.length) {
    return {
      current: undefined,
      next: undefined,
      mins,
    };
  }

  let current =
    active[
      active.length - 1
    ];

  let next =
    active[0];

  for (
    let i = 0;
    i < active.length;
    i++
  ) {
    if (
      mins <
      active[i].minutes
    ) {
      next =
        active[i];

      current =
        i === 0
          ? active[
              active.length - 1
            ]
          : active[i - 1];

      return {
        current,
        next,
        mins,
      };
    }
  }

  current =
    active[
      active.length - 1
    ];

  next =
    active[0];

  return {
    current,
    next,
    mins,
  };
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export async function setupPrayerNotifications(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window)
  ) {
    return false;
  }

  if (
    Notification.permission ===
    'granted'
  ) {
    return true;
  }

  if (
    Notification.permission ===
    'denied'
  ) {
    return false;
  }

  const permission =
    await Notification.requestPermission();

  return (
    permission === 'granted'
  );
}

/* =========================================================
   PRAYER NOTIFICATION
========================================================= */

export function showPrayerNotification(
  prayerName: PrayerName
) {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window)
  ) {
    return;
  }

  if (
    Notification.permission !==
    'granted'
  ) {
    return;
  }

  if (
    prayerName === 'Sunrise'
  ) {
    return;
  }

  new Notification(
    `${prayerName} Time 🕌`,
    {
      body:
        `It is time for ${prayerName} prayer.`,
      icon: '/favicon.png',
      tag:
        `prayer-${prayerName}`,
    }
  );
}

/* =========================================================
   AZAN AUDIO
========================================================= */

let azanAudio:
  HTMLAudioElement | null =
  null;

export function playAzanAudio() {
  try {
    if (!azanAudio) {
      azanAudio =
        new Audio(
          'https://islamicfinder.org/audio/adhan.mp3'
        );

      azanAudio.preload =
        'auto';
    }

    azanAudio.currentTime = 0;

    azanAudio
      .play()
      .catch((error) => {
        console.log(
          'Audio play blocked:',
          error
        );
      });
  } catch (error) {
    console.error(
      'Azan audio error:',
      error
    );
  }
}

/* =========================================================
   PRAYER ALERT
========================================================= */

export function triggerPrayerAlert(
  prayerName: PrayerName
) {
  if (
    prayerName === 'Sunrise'
  ) {
    return;
  }

  showPrayerNotification(
    prayerName
  );

  playAzanAudio();
}
