import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
  MessageSquare,
  Heart,
  Compass,
  CalendarDays,
  DollarSign,
  RotateCcw,
  FileText,
  ArrowRight,
  Share2,
  Settings,
  MapPin,
  Plus,
  Minus,
  RefreshCw,
  Clock,
  Star,
  Mail,
} from 'lucide-react';
import { STORIES } from '../data/stories';
import {
  CITY_OPTIONS,
  DEFAULT_LOCATION,
  fetchPrayerData,
  getCurrentAndNextPrayer,
  type PrayerData,
  type PrayerLocation,
} from '../services/prayer';
import { GLOBAL_LOCATIONS } from '../services/globalLocations';
import { getDailyHadith } from '../data/dailyHadith';
import { getJourneyDayNumber } from '../data/journey';
import { getTranslation, isRTL, LanguageCode, TranslationKeys } from '../locales/translations';

const SOCIAL_SVGS = [
  '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>',
  '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>',
  '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
];

function useLanguage(): { lang: LanguageCode; isRtl: boolean; t: (key: keyof TranslationKeys) => string } {
  const [lang, setLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('noor-language');
      if (saved) return saved as LanguageCode;
    } catch {}
    return 'en';
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('noor-language');
        if (saved) setLang(saved as LanguageCode);
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return {
    lang,
    isRtl: isRTL(lang),
    t: (key: keyof TranslationKeys) => getTranslation(lang, key),
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
  opacity: 1,
  transform: 'translateY(0)',
}}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-6 h-px bg-noor-gold/50" />
      <span className="text-noor-gold text-xs tracking-[0.2em] uppercase font-medium">{children}</span>
      <span className="w-6 h-px bg-noor-gold/50" />
    </div>
  );
}

// Prayer times state shared by the homepage hero + prayer section.
const PRAYER_CONTEXT = React.createContext<null | {
  data: PrayerData | null;
  location: PrayerLocation;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  setCity: (city: PrayerLocation) => Promise<void>;
  useCurrentLocation: () => void;
  locationMode: 'city' | 'current';
}>(null);

function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<PrayerLocation>(() => {
    try {
      const saved = localStorage.getItem('noor-prayer-location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });
  const [locationMode, setLocationMode] = useState<'city' | 'current'>('city');
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (nextLocation: PrayerLocation = location) => {
    setLoading(true);
    setError('');
    try {
      const next = await fetchPrayerData(nextLocation);
      setData(next);
      localStorage.setItem('noor-prayer-location', JSON.stringify(nextLocation));
    } catch {
      setError('Prayer timings could not be refreshed right now. Showing the last available location.');
      try {
        const fallback = await fetchPrayerData(DEFAULT_LOCATION);
        setData(fallback);
      } catch {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const setCity = async (city: PrayerLocation) => {
    setLocation(city);
    setLocationMode('city');
    setLoading(true);
    setError('');
    try {
      const next = await fetchPrayerData(city);
      setData(next);
      localStorage.setItem('noor-prayer-location', JSON.stringify(city));
    } catch {
      setError('Could not load timings for that city. Please try again.');
      await load(city);
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location services are not available in this browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const current: PrayerLocation = {
          name: 'Current location',
          country: '',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setLocation(current);
        setLocationMode('current');
        try {
          const next = await fetchPrayerData(current);
          setData(next);
          localStorage.setItem('noor-prayer-location', JSON.stringify(current));
        } catch {
          setError('Could not load prayer timings for your current location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Location permission was denied. Showing your saved city.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15 * 60 * 1000 }
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PRAYER_CONTEXT.Provider
      value={{ data, location, loading, error, refresh: () => load(), setCity, useCurrentLocation, locationMode }}
    >
      {children}
    </PRAYER_CONTEXT.Provider>
  );
}

function usePrayerContext() {
  const ctx = React.useContext(PRAYER_CONTEXT);
  if (!ctx) throw new Error('Prayer context is missing');
  return ctx;
}

function fmtSeconds(s: number) {
  const safe = Math.max(0, Math.floor(s));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const sec = safe % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ── sections ─────────────────────────────────────────────────────────────────
function Hero() {
  const { data, location, loading } = usePrayerContext();
  const { isRtl, t } = useLanguage();
  const displayDate =
    data?.readableDate ||
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  const hijri = data?.hijriDate || 'Loading Hijri date…';

  return (
    <section
      className="relative min-h-[850px] lg:min-h-0 lg:h-[420px] flex items-start lg:items-center overflow-visible lg:overflow-hidden pt-16 pb-8 lg:pb-0"
      style={{ background: '#072018' }}
    >
      <img
        src="/images/noor-hero-mosque.jpg"
        alt="Mosque at sunset"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 48%' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(6,24,18,0.93) 0%, rgba(6,24,18,0.75) 55%, rgba(6,24,18,0.35) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(6,24,18,0.85) 0%, transparent 60%)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
          <div className="flex-1 max-w-2xl">
            <FadeIn delay={0.05}>
              <p className="text-noor-muted text-xs tracking-[0.3em] uppercase mb-6">{t('heroSubheader')}</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] text-noor-ivory mb-4">
                {t('heroHeadingLine1')} <br />
                <span className="text-noor-gold italic">{t('heroHeadingLine2')}</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-noor-muted text-sm sm:text-base leading-relaxed mb-5 max-w-md">
                {t('heroDescription')}
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/quran"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: '#E8BD4B', color: '#061812' }}
                >
                  {t('readQuran')} <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </Link>
                <Link
                  to="/stories"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-noor-ivory/30 text-noor-ivory hover:border-noor-gold/60 hover:text-noor-gold transition-all"
                >
                  {t('exploreStories')}
                </Link>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.3} className="w-full sm:w-auto mt-4 lg:mt-0">
            <div
              className="hero-card-polish rounded-[22px] p-4 sm:p-5 w-full max-w-xs lg:max-w-[300px]"
              style={{
                background: 'rgba(14,47,37,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(232,189,75,0.2)',
              }}
            >
              <div className="flex items-start gap-2 mb-4 pb-4 border-b border-noor-border/40">
                <CalendarDays size={16} className="text-noor-gold mt-0.5" />
                <div>
                  <p className="text-noor-ivory font-medium text-sm">{displayDate}</p>
                  <p className="text-noor-muted text-xs mt-0.5">{hijri}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={13} className="text-noor-muted" />
                <span className="text-noor-muted text-xs">
                  {loading ? 'Loading location…' : location.name}
                </span>
              </div>
              <Link
                to="/calendar"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium border border-noor-gold/30 text-noor-gold hover:bg-noor-gold/10 transition-colors mb-5"
              >
                {t('islamicCalendar')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
              </Link>
              <div className="text-center">
                <p
                  className="font-arabic text-noor-gold text-xl leading-loose mb-2"
                  style={{ direction: 'rtl', fontFamily: 'Amiri, serif' }}
                >
                  وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
                </p>
                <p className="text-noor-ivory/70 text-xs italic">{t('heroVerseTranslation')}</p>
                <p className="text-noor-muted text-xs mt-1">{t('heroVerseRef')}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function PrayerTimesSection() {
  const { data, location, loading, error, setCity, useCurrentLocation } = usePrayerContext();
  const { isRtl, t } = useLanguage();
  const timings = data?.timings ?? [];
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { current: activePrayer, next: nextPrayer } = timings.length
    ? getCurrentAndNextPrayer(timings, now, data?.timezone)
    : { current: undefined, next: undefined };

  let countdown = 0;
  let totalWindow = 3600;
  if (activePrayer && nextPrayer) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    let nextMinutes = nextPrayer.minutes;
    if (nextMinutes <= nowMinutes) nextMinutes += 24 * 60;
    let currentMinutes = activePrayer.minutes;
    if (currentMinutes > nowMinutes) currentMinutes -= 24 * 60;
    countdown = Math.max(0, (nextMinutes - nowMinutes) * 60);
    totalWindow = Math.max(1, (nextMinutes - currentMinutes) * 60);
  }

  const progress = totalWindow > 0 ? 1 - countdown / totalWindow : 0;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(Math.max(progress, 0), 1));

  const prayerNameMap: Record<string, keyof TranslationKeys> = {
    Fajr: 'fajr',
    Sunrise: 'sunrise',
    Dhuhr: 'dhuhr',
    Asr: 'asr',
    Maghrib: 'maghrib',
    Isha: 'isha',
  };

  return (
    <section
      className="py-12"
      style={{ background: '#0B2820', borderTop: '1px solid rgba(26,64,53,0.5)' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div
              className="rounded-2xl p-5 sm:p-6 h-full"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={15} className="text-noor-accent" />
                    <h2 className="font-display text-noor-ivory text-xl font-semibold">
                      {t('todaysPrayerTimes')}
                    </h2>
                  </div>
                  <p className="text-noor-muted text-xs">{t('stayConnectedSalah')}</p>
                  {error && <p className="text-noor-gold text-[10px] mt-1">{error}</p>}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-noor-muted text-xs">
                    <MapPin size={11} /> {loading ? 'Loading location…' : location.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={useCurrentLocation} className="text-[10px] text-noor-gold hover:underline">
                      {t('useMyLocation')}
                    </button>
                    <div className="relative">
                      <input
                        list="noor-global-locations"
                        value={location.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          const city = [...CITY_OPTIONS, ...GLOBAL_LOCATIONS].find(
                            (c) => c.name.toLowerCase() === value.toLowerCase()
                          );
                          if (city) setCity(city);
                        }}
                        placeholder={t('searchWorldwide')}
                        className="bg-[#103329] text-[10px] text-noor-muted outline-none border border-noor-border rounded-lg px-2 py-1 w-[180px] placeholder:text-noor-muted/70"
                        aria-label="Search a country or city worldwide"
                      />
                      <datalist id="noor-global-locations">
                        {[...CITY_OPTIONS, ...GLOBAL_LOCATIONS].map((city, i) => (
                          <option key={`${city.name}-${i}`} value={city.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <Link
                    to="/calendar"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-noor-gold hover:underline"
                  >
                    {t('viewCalendar')} <ArrowRight size={11} className={isRtl ? 'rotate-180' : ''} />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 flex-1 w-full overflow-x-auto">
                  {(timings.length
                    ? timings
                    : [
                        { name: 'Fajr', time: '--:--', minutes: 0 },
                        { name: 'Sunrise', time: '--:--', minutes: 0 },
                        { name: 'Dhuhr', time: '--:--', minutes: 0 },
                        { name: 'Asr', time: '--:--', minutes: 0 },
                        { name: 'Maghrib', time: '--:--', minutes: 0 },
                        { name: 'Isha', time: '--:--', minutes: 0 },
                      ]
                  ).map((prayer) => {
                    const isActive = prayer.name === activePrayer?.name;
                    const nameKey = prayerNameMap[prayer.name];
                    const displayName = nameKey ? t(nameKey) : prayer.name;
                    return (
                      <div
                        key={prayer.name}
                        className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl transition-all min-w-[70px]"
                        style={{
                          background: isActive ? 'rgba(232,189,75,0.12)' : 'rgba(6,24,18,0.4)',
                          border: isActive
                            ? '1px solid rgba(232,189,75,0.35)'
                            : '1px solid rgba(26,64,53,0.4)',
                        }}
                      >
                        <span className="text-lg leading-none">
                          {prayer.name === 'Fajr'
                            ? '🌙'
                            : prayer.name === 'Sunrise'
                            ? '🌅'
                            : prayer.name === 'Dhuhr'
                            ? '☀️'
                            : prayer.name === 'Asr'
                            ? '🌤️'
                            : prayer.name === 'Maghrib'
                            ? '🌇'
                            : '🌃'}
                        </span>
                        <span className={`text-xs font-medium ${isActive ? 'text-noor-gold' : 'text-noor-muted'}`}>
                          {displayName}
                        </span>
                        <span className={`text-sm font-semibold ${isActive ? 'text-noor-gold' : 'text-noor-ivory'}`}>
                          {prayer.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                      <defs>
                        <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#18B98A" />
                          <stop offset="100%" stopColor="#E8BD4B" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(26,64,53,0.6)" strokeWidth="5" />
                      <circle
                        cx="60"
                        cy="60"
                        r={r}
                        fill="none"
                        stroke="url(#cGrad)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                      />
                    </svg>
                    <div className="text-center z-10">
                      <p className="text-noor-gold text-[10px] font-medium tracking-wider uppercase">
                        {nextPrayer
                          ? prayerNameMap[nextPrayer.name]
                            ? t(prayerNameMap[nextPrayer.name])
                            : nextPrayer.name
                          : 'Prayer'}
                      </p>
                      <p className="font-display text-noor-ivory text-lg font-bold tabular-nums">
                        {fmtSeconds(countdown)}
                      </p>
                      <p className="text-noor-muted text-[9px]">{t('timeRemaining')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FadeIn className="xl:col-span-1">
            <div className="rounded-2xl overflow-hidden h-full" style={{ border: '1px solid rgba(26,64,53,0.7)' }}>
              <div className="relative h-36 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=300&fit=crop&auto=format"
                  alt="Quran"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(16,51,41,0.2), rgba(16,51,41,0.7))',
                  }}
                />
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(232,189,75,0.2)',
                    color: '#E8BD4B',
                    border: '1px solid rgba(232,189,75,0.3)',
                  }}
                >
                  {t('quran')}
                </span>
              </div>
              <div className="p-5" style={{ background: '#103329' }}>
                <h3 className="font-display text-noor-ivory text-base font-semibold mb-3">{t('verseOfTheDay')}</h3>
                <p
                  className="font-arabic text-noor-gold text-xl leading-loose mb-3 text-right"
                  style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                >
                  فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-noor-ivory/80 text-sm italic mb-1">{t('dailyVerseTranslation')}</p>
                <p className="text-noor-muted text-xs mb-4">{t('dailyVerseRef')}</p>
                <Link
                  to="/quran"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-noor-gold hover:underline"
                >
                  {t('readQuran')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function HadithAndDuaSection() {
  const { isRtl, t } = useLanguage();
  const dailyHadith = getDailyHadith();

  return (
    <section className="py-12" style={{ background: '#061812' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <div
              className="rounded-2xl p-6 h-full flex flex-col justify-between"
              style={{
                background: '#103329',
                border: '1px solid rgba(232,189,75,0.2)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-noor-gold" />
                    <span className="text-noor-gold text-xs font-medium uppercase tracking-wider">
                      {t('hadithOfTheDay')}
                    </span>
                  </div>
                  <span className="text-noor-muted text-[10px] px-2 py-0.5 rounded-full bg-black/20 border border-noor-border">
                    Day {getJourneyDayNumber()}
                  </span>
                </div>
                <p
                  className="font-arabic text-noor-gold text-lg leading-loose mb-3 text-right"
                  style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                >
                  {dailyHadith.arabicText}
                </p>
                <p className="text-noor-ivory/90 text-sm leading-relaxed mb-2">"{dailyHadith.translation}"</p>
                <p className="text-noor-muted text-xs mb-4">— {dailyHadith.source}</p>
              </div>
              <Link
                to="/hadith"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-noor-gold hover:underline pt-2 border-t border-noor-border/40"
              >
                {t('dailyHadith')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div
              className="rounded-2xl p-6 h-full flex flex-col justify-between"
              style={{
                background: '#103329',
                border: '1px solid rgba(232,189,75,0.2)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-noor-accent" />
                    <span className="text-noor-accent text-xs font-medium uppercase tracking-wider">
                      {t('dailySupplication')}
                    </span>
                  </div>
                </div>
                <h3 className="text-noor-ivory font-medium text-base mb-3">{t('duaTitle')}</h3>
                <p
                  className="font-arabic text-noor-gold text-lg leading-loose mb-3 text-right"
                  style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                >
                  رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ
                </p>
                <p className="text-noor-ivory/90 text-sm leading-relaxed mb-2">{t('duaTranslation')}</p>
                <p className="text-noor-muted text-xs mb-1">{t('duaBenefit')}</p>
                <p className="text-noor-muted text-xs mb-4">{t('duaRef')}</p>
              </div>
              <Link
                to="/duas"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-noor-accent hover:underline pt-2 border-t border-noor-border/40"
              >
                {t('dailyDuas')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { isRtl, t } = useLanguage();
  const features = [
    {
      to: '/qibla',
      titleKey: 'qiblaFinder',
      descKey: 'qiblaDesc',
      icon: Compass,
      iconColor: '#E8BD4B',
    },
    {
      to: '/tasbeeh',
      titleKey: 'tasbeehDhikr',
      descKey: 'tasbeehDesc',
      icon: RotateCcw,
      iconColor: '#18B98A',
    },
    {
      to: '/calendar',
      titleKey: 'islamicCalendar',
      descKey: 'calendarDesc',
      icon: CalendarDays,
      iconColor: '#E8BD4B',
    },
    {
      to: '/zakat',
      titleKey: 'zakatCalculator',
      descKey: 'zakatDesc',
      icon: DollarSign,
      iconColor: '#18B98A',
    },
    {
      to: '/stories',
      titleKey: 'islamicStories',
      descKey: 'storiesDesc',
      icon: MessageSquare,
      iconColor: '#E8BD4B',
    },
    {
      to: '/blog',
      titleKey: 'islamicBlog',
      descKey: 'blogDesc',
      icon: FileText,
      iconColor: '#18B98A',
    },
  ];

  return (
    <section className="py-16" style={{ background: '#0B2820' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>{t('exploreFeatures')}</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-noor-ivory mb-3">
            {t('essentialCompanion')}
          </h2>
          <p className="text-noor-muted text-sm max-w-xl mx-auto">{t('featuresSubtext')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.to} delay={idx * 0.08}>
                <Link
                  to={item.to}
                  className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: '#103329',
                    border: '1px solid rgba(26,64,53,0.7)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(6,24,18,0.6)' }}
                    >
                      <Icon size={22} style={{ color: item.iconColor }} />
                    </div>
                    <span className="text-xs font-medium text-noor-muted group-hover:text-noor-gold flex items-center gap-1 transition-colors">
                      {t('open')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
                    </span>
                  </div>
                  <h3 className="font-display text-noor-ivory text-lg font-semibold mb-2 group-hover:text-noor-gold transition-colors">
                    {t(item.titleKey as keyof TranslationKeys)}
                  </h3>
                  <p className="text-noor-muted text-xs leading-relaxed">
                    {t(item.descKey as keyof TranslationKeys)}
                  </p>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuickStatsSection() {
  const { isRtl, t } = useLanguage();
  const stats = [
    { value: '114', labelKey: 'surahsInQuran' },
    { value: '100+', labelKey: 'dailyDuasAvailable' },
    { value: '30+', labelKey: 'storiesToExplore' },
    { value: '365', labelKey: 'hadithsCurated' },
  ];

  return (
    <section className="py-12 border-y border-noor-border/40" style={{ background: '#061812' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <SectionLabel>{t('quickStatsTitle')}</SectionLabel>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <FadeIn key={stat.labelKey} delay={idx * 0.1}>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold text-noor-gold mb-1">{stat.value}</p>
                <p className="text-noor-muted text-xs sm:text-sm">{t(stat.labelKey as keyof TranslationKeys)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStoriesSection() {
  const { isRtl, t } = useLanguage();
  const featured = STORIES.slice(0, 3);

  return (
    <section className="py-16" style={{ background: '#0B2820' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <SectionLabel>{t('stories')}</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-noor-ivory mb-1">
              {t('featuredStories')}
            </h2>
            <p className="text-noor-muted text-sm">{t('storiesSubtitle')}</p>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-noor-gold hover:underline"
          >
            {t('viewAllStories')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((story, idx) => (
            <FadeIn key={story.id} delay={idx * 0.1}>
              <Link
                to={`/stories?id=${story.id}`}
                className="group block rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium bg-black/60 text-noor-gold border border-noor-gold/30">
                    {story.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-noor-ivory text-base font-semibold mb-2 group-hover:text-noor-gold transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-noor-muted text-xs leading-relaxed line-clamp-3 mb-4">
                      {story.summary}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-noor-gold flex items-center gap-1">
                    {t('readMore')} <ArrowRight size={11} className={isRtl ? 'rotate-180' : ''} />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentBlogSection() {
  const { isRtl, t } = useLanguage();
  const samplePosts = [
    {
      id: '1',
      title: 'Building Consistency in Daily Adhkar & Remembrance',
      snippet:
        'Practical habits to keep your tongue moist with the remembrance of Allah throughout busy modern routines.',
      category: 'Spirituality',
      readTime: '4 min read',
    },
    {
      id: '2',
      title: 'Understanding the Wisdom Behind Zakat & Charity',
      snippet: 'How purifying wealth cleanses the heart and builds compassionate, resilient communities.',
      category: 'Practice',
      readTime: '6 min read',
    },
  ];

  return (
    <section className="py-16" style={{ background: '#061812' }} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <SectionLabel>{t('blog')}</SectionLabel>
            <h2 className="font-display text-3xl font-semibold text-noor-ivory mb-1">
              {t('recentBlogArticles')}
            </h2>
            <p className="text-noor-muted text-sm">{t('blogSubtitle')}</p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-noor-gold hover:underline"
          >
            {t('viewAllBlogPosts')} <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {samplePosts.map((post, idx) => (
            <FadeIn key={post.id} delay={idx * 0.1}>
              <Link
                to={`/blog?id=${post.id}`}
                className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-noor-gold/15 text-noor-gold border border-noor-gold/30">
                    {post.category}
                  </span>
                  <span className="text-noor-muted text-[10px]">{post.readTime}</span>
                </div>
                <h3 className="font-display text-noor-ivory text-lg font-semibold mb-2 group-hover:text-noor-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-noor-muted text-xs leading-relaxed mb-4">{post.snippet}</p>
                <span className="text-xs font-medium text-noor-gold flex items-center gap-1">
                  {t('readMore')} <ArrowRight size={11} className={isRtl ? 'rotate-180' : ''} />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <PrayerProvider>
      <div className="min-h-screen text-noor-ivory" style={{ background: '#061812' }}>
        <Hero />
        <PrayerTimesSection />
        <HadithAndDuaSection />
        <FeaturesSection />
        <QuickStatsSection />
        <FeaturedStoriesSection />
        <RecentBlogSection />
      </div>
    </PrayerProvider>
  );
}
