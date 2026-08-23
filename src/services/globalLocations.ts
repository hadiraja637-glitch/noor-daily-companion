import type { PrayerLocation } from '../services/prayer';

// Expanded Global Locations (Capitals + Major Cities for Accurate Local Times)
export const GLOBAL_LOCATIONS: PrayerLocation[] = [
  // --- PAKISTAN CITIES ---
  { name: 'Islamabad, Pakistan', country: 'Pakistan', lat: 33.693812, lon: 73.065151 },
  { name: 'Gujrat, Pakistan', country: 'Pakistan', lat: 32.5742, lon: 74.0754 },
  { name: 'Lahore, Pakistan', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi, Pakistan', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
  { name: 'Faisalabad, Pakistan', country: 'Pakistan', lat: 31.4504, lon: 73.1350 },
  { name: 'Rawalpindi, Pakistan', country: 'Pakistan', lat: 33.5651, lon: 73.0169 },
  { name: 'Multan, Pakistan', country: 'Pakistan', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar, Pakistan', country: 'Pakistan', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta, Pakistan', country: 'Pakistan', lat: 30.1798, lon: 66.9750 },
  { name: 'Sialkot, Pakistan', country: 'Pakistan', lat: 32.4945, lon: 74.5229 },
  { name: 'Gujranwala, Pakistan', country: 'Pakistan', lat: 32.1877, lon: 74.1945 },

  // --- GERMANY (DEUTSCHLAND) ---
  { name: 'Berlin, Germany', country: 'Germany', lat: 52.5200, lon: 13.4050 },
  { name: 'Albbruck, Germany', country: 'Germany', lat: 47.5894, lon: 8.1311 },

  // --- SWITZERLAND ---
  { name: 'Bern, Switzerland', country: 'Switzerland', lat: 46.9480, lon: 7.4474 },
  { name: 'Zurich, Switzerland', country: 'Switzerland', lat: 47.3769, lon: 8.5417 },

  // --- UNITED KINGDOM / BRITAIN ---
  { name: 'London, United Kingdom', country: 'United Kingdom', lat: 51.507322, lon: -0.127647 },
  { name: 'Birmingham, United Kingdom', country: 'United Kingdom', lat: 52.4862, lon: -1.8904 },
  { name: 'Manchester, United Kingdom', country: 'United Kingdom', lat: 53.4808, lon: -2.2426 },

  // --- MIDDLE EAST & MAJOR MUSLIM CITIES ---
  { name: 'Makkah, Saudi Arabia', country: 'Saudi Arabia', lat: 21.3891, lon: 39.8579 },
  { name: 'Madinah, Saudi Arabia', country: 'Saudi Arabia', lat: 24.5247, lon: 39.5692 },
  { name: 'Riyadh, Saudi Arabia', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },
  { name: 'Dubai, United Arab Emirates', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'Abu Dhabi, United Arab Emirates', country: 'United Arab Emirates', lat: 24.474796, lon: 54.370576 },
  { name: 'Istanbul, Türkiye', country: 'Türkiye', lat: 41.0082, lon: 28.9784 },
  { name: 'Ankara, Türkiye', country: 'Türkiye', lat: 39.920777, lon: 32.854067 },
  { name: 'Doha, Qatar', country: 'Qatar', lat: 25.285633, lon: 51.526416 },
  { name: 'Kuwait City, Kuwait', country: 'Kuwait', lat: 29.379709, lon: 47.973563 },
  { name: 'Cairo, Egypt', country: 'Egypt', lat: 30.048819, lon: 31.243666 },
  { name: 'Dhaka, Bangladesh', country: 'Bangladesh', lat: 23.759357, lon: 90.378814 },
  { name: 'Kuala Lumpur, Malaysia', country: 'Malaysia', lat: 3.151696, lon: 101.694237 },
  { name: 'Jakarta, Indonesia', country: 'Indonesia', lat: -6.175394, lon: 106.827183 },

  // --- OTHER GLOBAL CITIES ---
  { name: 'Kabul, Afghanistan', country: 'Afghanistan', lat: 34.526011, lon: 69.177684 },
  { name: 'New York, United States', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Washington D.C., United States', country: 'United States', lat: 38.894986, lon: -77.036571 },
  { name: 'Toronto, Canada', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { name: 'Sydney, Australia', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];
