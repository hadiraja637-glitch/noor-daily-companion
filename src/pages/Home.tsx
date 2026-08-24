import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import {
  BookOpen, MessageSquare, Heart, Compass, CalendarDays, DollarSign,
  RotateCcw, FileText, ArrowRight, Share2, MapPin,
  Plus, Minus, RefreshCw, Clock, Star, Sparkles, Check
} from 'lucide-react';
import { STORIES } from '../data/stories';
import {
  CITY_OPTIONS, DEFAULT_LOCATION, fetchPrayerData, getCurrentAndNextPrayer,
  getCityFromCoordinates, type PrayerData, type PrayerLocation,
} from '../services/prayer';
import { GLOBAL_LOCATIONS } from '../services/globalLocations';
import { getDailyHadith } from '../data/dailyHadith';

// Dynamic Verses List (Rotates Daily Based on Day of Year)
const DAILY_VERSES = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: '"Indeed, with hardship comes ease."',
    reference: "Qur'an 94:6",
    surahLink: "/quran"
  },
  {
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    english: '"And say: My Lord, increase me in knowledge."',
    reference: "Qur'an 20:114",
    surahLink: "/quran"
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    english: '"Indeed, Allah is with the patient."',
    reference: "Qur'an 2:153",
    surahLink: "/quran"
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    english: '"So remember Me; I will remember you."',
    reference: "Qur'an 2:152",
    surahLink: "/quran"
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    english: '"Sufficient for us is Allah, and He is the best Disposer of affairs."',
    reference: "Qur'an 3:173",
    surahLink: "/quran"
  },
  {
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    english: '"And He is with you wherever you are."',
    reference: "Qur'an 57:4",
    surahLink: "/quran"
  },
  {
    arabic: "لَئِن شَكَرْتُمْ لأَزِيدَنَّكُمْ",
    english: '"If you are grateful, I will surely increase you."',
    reference: "Qur'an 14:7",
    surahLink: "/quran"
  }
];

// ── helpers ──────────────────────────────────────────────────────────────────

function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
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
      setError('Prayer timings could not be refreshed right now. Showing default location.');
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
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        const cityName = await getCityFromCoordinates(lat, lon);
        
        const currentLoc: PrayerLocation = {
          name: cityName,
          country: cityName.split(',')[1]?.trim() || '',
          lat: lat,
          lon: lon,
        };
        
        setLocation(currentLoc);
        setLocationMode('current');
        try {
          const next = await fetchPrayerData(currentLoc);
          setData(next);
          localStorage.setItem('noor-prayer-location', JSON.stringify(currentLoc));
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15 * 60 * 1000 },
    );
  };

  useEffect(() => { load(); }, []);

  return (
    <PRAYER_CONTEXT.Provider value={{ data, location, loading, error, refresh: () => load(), setCity, useCurrentLocation, locationMode }}>
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
  const displayDate = data?.readableDate || new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const hijri = data?.hijriDate || 'Loading Hijri date…';

  return (
    <section
      className="relative min-h-[620px] lg:h-[420px] flex items-center overflow-hidden pt-8 pb-10 lg:py-0"
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
            'linear-gradient(to right, rgba(6,24,18,0.95) 0%, rgba(6,24,18,0.8) 55%, rgba(6,24,18,0.4) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(6,24,18,0.9) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 w-full">
          <div className="flex-1 max-w-2xl">
            <FadeIn delay={0.05}>
              <p className="text-noor-muted text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-3 sm:mb-5">
                GUIDANCE • PRAYER • BETTER YOU
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] text-noor-ivory mb-3 sm:mb-4">
                A Brighter Day <br />
                <span className="text-noor-gold italic">with Allah</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-noor-muted text-xs sm:text-base leading-relaxed mb-5 max-w-md">
                Qur'an in your heart, guidance in your life,<br className="hidden sm:block" />
                and barakah in every step.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <Link
                  to="/quran"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all hover:scale-105"
                  style={{ background: '#E8BD4B', color: '#061812' }}
                >
                  Read Qur'an <ArrowRight size={14} />
                </Link>
                <Link
                  to="/stories"
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border border-noor-ivory/30 text-noor-ivory hover:border-noor-gold/60 hover:text-noor-gold transition-all"
                >
                  Explore Islamic Stories
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} className="w-full sm:w-auto mt-2 lg:mt-0">
            <div
              className="hero-card-polish rounded-[20px] p-4 sm:p-5 w-full sm:w-80 lg:max-w-[300px]"
              style={{
                background: 'rgba(14,47,37,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(232,189,75,0.2)',
              }}
            >
              <div className="flex items-start gap-2 mb-3 pb-3 border-b border-noor-border/40">
                <CalendarDays size={16} className="text-noor-gold mt-0.5" />
                <div>
                  <p className="text-noor-ivory font-medium text-xs sm:text-sm">{displayDate}</p>
                  <p className="text-noor-muted text-[11px] mt-0.5">{hijri}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-noor-gold" />
                <span className="text-noor-ivory text-xs font-medium truncate">{loading ? 'Loading location…' : location.name}</span>
              </div>
              <Link
                to="/calendar"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium border border-noor-gold/30 text-noor-gold hover:bg-noor-gold/10 transition-colors mb-4"
              >
                Islamic Calendar <ArrowRight size={12} />
              </Link>

              <div className="text-center">
                <p
                  className="font-arabic text-noor-gold text-lg sm:text-xl leading-relaxed mb-1"
                  style={{ direction: 'rtl', fontFamily: 'Amiri, serif' }}
                >
                  وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
                </p>
                <p className="text-noor-ivory/70 text-[11px] italic">
                  "And my success is only by Allah."
                </p>
                <p className="text-noor-muted text-[10px] mt-0.5">— Qur'an 11:88</p>
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
  const timings = data?.timings ?? [];
  const [now, setNow] = useState(() => new Date());

  const dailyVerse = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  }, []);

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

  const allCities = [...CITY_OPTIONS, ...GLOBAL_LOCATIONS];

  return (
    <section className="py-8 sm:py-12" style={{ background: '#0B2820', borderTop: '1px solid rgba(26,64,53,0.5)' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={15} className="text-noor-gold" />
                    <h2 className="font-display text-noor-ivory text-lg sm:text-xl font-semibold">Today's Prayer Times</h2>
                  </div>
                  <p className="text-noor-muted text-xs">Stay connected with your Salah</p>
                  {error && <p className="text-noor-gold text-[10px] mt-1">{error}</p>}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-noor-ivory text-xs font-medium">
                    <MapPin size={13} className="text-noor-gold" /> 
                    {loading ? 'Loading location…' : location.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={useCurrentLocation} 
                      className="text-[11px] font-medium text-noor-gold hover:underline transition-all"
                    >
                      Use my location
                    </button>
                    <div className="relative">
                      <input
                        list="noor-global-locations"
                        value={location.name}
                        onChange={(e) => { 
                          const value = e.target.value; 
                          const city = allCities.find((c) => c.name.toLowerCase() === value.toLowerCase()); 
                          if (city) setCity(city); 
                        }}
                        placeholder="🌍 Search worldwide"
                        className="bg-[#072018] text-[11px] text-noor-ivory outline-none border border-noor-border rounded-lg px-2.5 py-1 w-[150px] sm:w-[180px] placeholder:text-noor-muted/60 focus:border-noor-gold/50 transition-colors"
                        aria-label="Search a country or city worldwide"
                      />
                      <datalist id="noor-global-locations">
                        {allCities.map((city, i) => <option key={`${city.name}-${i}`} value={city.name} />)}
                      </datalist>
                    </div>
                  </div>
                  <Link to="/calendar" className="mt-0.5 inline-flex items-center gap-1 text-xs text-noor-gold hover:underline">
                    View Calendar <ArrowRight size={11} />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 flex-1 w-full">
                  {(timings.length ? timings : [
                    { name: 'Fajr', time: '--:--', minutes: 0 }, 
                    { name: 'Sunrise', time: '--:--', minutes: 0 }, 
                    { name: 'Dhuhr', time: '--:--', minutes: 0 }, 
                    { name: 'Asr', time: '--:--', minutes: 0 }, 
                    { name: 'Maghrib', time: '--:--', minutes: 0 }, 
                    { name: 'Isha', time: '--:--', minutes: 0 },
                  ]).map((prayer) => {
                    const isActive = prayer.name === activePrayer?.name;
                    return (
                      <div key={prayer.name} className="flex flex-col items-center gap-1.5 px-1.5 py-2.5 sm:px-2 sm:py-3 rounded-xl transition-all min-w-[65px]" style={{ background: isActive ? 'rgba(232,189,75,0.12)' : 'rgba(6,24,18,0.4)', border: isActive ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.4)' }}>
                        <span className="text-base sm:text-lg leading-none">{prayer.name === 'Fajr' ? '🌙' : prayer.name === 'Sunrise' ? '🌅' : prayer.name === 'Dhuhr' ? '☀️' : prayer.name === 'Asr' ? '🌤️' : prayer.name === 'Maghrib' ? '🌇' : '🌃'}</span>
                        <span className={`text-[11px] sm:text-xs font-medium ${isActive ? 'text-noor-gold' : 'text-noor-muted'}`}>{prayer.name}</span>
                        <span className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-noor-gold' : 'text-noor-ivory'}`}>{prayer.time}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex-shrink-0 flex flex-col items-center mt-2 sm:mt-0">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                      <defs><linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#18B98A" /><stop offset="100%" stopColor="#E8BD4B" /></linearGradient></defs>
                      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(26,64,53,0.6)" strokeWidth="5" />
                      <circle cx="60" cy="60" r={r} fill="none" stroke="url(#cGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                    </svg>
                    <div className="text-center z-10">
                      <p className="text-noor-gold text-[10px] font-medium tracking-wider uppercase">{nextPrayer?.name ?? 'Prayer'}</p>
                      <p className="font-display text-noor-ivory text-base sm:text-lg font-bold tabular-nums">{fmtSeconds(countdown)}</p>
                      <p className="text-noor-muted text-[9px]">Time remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FadeIn className="xl:col-span-1">
            <div className="rounded-2xl overflow-hidden h-full flex flex-col shadow-lg" style={{ border: '1px solid rgba(232,189,75,0.3)', background: '#103329' }}>
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80" 
                  alt="Quran Holy Book" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  loading="lazy" 
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(16,51,41,0.25), rgba(16,51,41,0.95))' }} />
                <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold shadow-md backdrop-blur-md" style={{ background: 'rgba(232,189,75,0.25)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.4)' }}>
                  ✨ Daily Qur'an
                </span>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display text-noor-ivory text-base font-semibold mb-2 flex items-center gap-1.5">
                    Verse of the Day
                  </h3>
                  <p className="font-arabic text-noor-gold text-xl sm:text-2xl leading-loose mb-2 text-right" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
                    {dailyVerse.arabic}
                  </p>
                  <p className="text-noor-ivory/90 text-xs sm:text-sm italic mb-1 leading-relaxed">
                    {dailyVerse.english}
                  </p>
                  <p className="text-noor-muted text-xs font-medium">— {dailyVerse.reference}</p>
                </div>
                <Link to={dailyVerse.surahLink} className="flex items-center gap-2 text-xs sm:text-sm text-noor-gold hover:underline font-semibold pt-2 border-t border-[#1A4035]/60">
                  Read Full Surah <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: BookOpen, label: "Qur'an", sub: 'Read, Listen & Learn', to: '/quran' },
  { icon: MessageSquare, label: 'Hadith', sub: 'Authentic Sayings', to: '/hadith' },
  { icon: Sparkles, label: 'Sunnah Habits', sub: 'Daily Practices', to: '/sunnah-habits' },
  { icon: Heart, label: 'Duas', sub: 'For Every Moment', to: '/duas' },
  { icon: Compass, label: 'Qibla Finder', sub: 'Find Direction', to: '/qibla' },
  { icon: CalendarDays, label: 'Calendar', sub: 'Important Dates', to: '/calendar' },
  { icon: DollarSign, label: 'Zakat', sub: 'Calculate Ease', to: '/zakat' },
  { icon: RotateCcw, label: 'Tasbeeh', sub: 'Digital Counter', to: '/tasbeeh' },
  { icon: FileText, label: 'Islamic Blog', sub: 'Knowledge & Insights', to: '/blog' },
];

function FeatureCards() {
  return (
    <section className="py-6 sm:py-8" style={{ background: '#072018', borderTop: '1px solid rgba(26,64,53,0.4)' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.label} delay={i * 0.02}>
              <Link
                to={f.to}
                className="flex flex-col items-center gap-1.5 p-2.5 sm:p-4 rounded-xl group transition-all hover:scale-105 h-full"
                style={{
                  background: 'rgba(16,51,41,0.5)',
                  border: '1px solid rgba(26,64,53,0.5)',
                }}
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-6"
                  style={{ background: 'rgba(232,189,75,0.12)' }}
                >
                  <f.icon size={15} className="text-noor-gold" />
                </div>
                <div className="text-center">
                  <p className="text-noor-ivory text-[11px] sm:text-xs font-medium group-hover:text-noor-gold transition-colors leading-tight">
                    {f.label}
                  </p>
                  <p className="text-noor-muted text-[9px] sm:text-[10px] leading-tight mt-0.5 hidden sm:block">{f.sub}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function IslamicStories() {
  return (
    <section className="py-10 sm:py-14" style={{ background: '#0B2820' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} className="text-noor-gold" />
                <h2 className="font-display text-noor-ivory text-xl sm:text-3xl font-semibold">
                  Islamic Stories
                </h2>
              </div>
              <p className="text-noor-muted text-xs sm:text-sm">
                Inspiring stories from the lives of the Prophets, Sahaba and righteous people.
              </p>
            </div>
            <Link
              to="/stories"
              className="hidden sm:flex items-center gap-1.5 text-sm text-noor-gold border border-noor-gold/30 px-4 py-2 rounded-full hover:bg-noor-gold/10 transition-colors"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>

        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible"
          style={{ scrollbarWidth: 'none' }}
        >
          {STORIES.map((s, i) => (
            <FadeIn key={s.slug || i} delay={i * 0.05} className="flex-shrink-0 w-48 sm:w-auto">
              <Link
                to={`/stories/${s.slug}`}
                className="block rounded-xl overflow-hidden group transition-transform hover:-translate-y-1 h-full"
                style={{ border: '1px solid rgba(26,64,53,0.5)' }}
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-[#072018]">
                  <img
                    src={s.img}
                    alt={s.title || 'Islamic Story'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,24,18,0.95) 0%, rgba(6,24,18,0.2) 60%)' }}
                  />
                  <p className="absolute bottom-2.5 left-2.5 right-2.5 text-noor-ivory text-xs sm:text-sm font-medium leading-snug whitespace-pre-line group-hover:text-noor-gold transition-colors">
                    {s.title}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link to="/stories" className="text-xs text-noor-gold hover:underline inline-flex items-center gap-1">
            View All Stories <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

const DHIKR_OPTIONS = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'La ilaha illallah'];

const GUIDANCE_LINKS = [
  { label: 'Daily Sunnah Habits', to: '/sunnah-habits' },
  { label: 'Find Qibla Direction', to: '/qibla' },
  { label: 'Calculate Your Zakat', to: '/zakat' },
  { label: 'Daily Duas & Supplications', to: '/duas' },
];

function HadithDhikrCalendar() {
  const [count, setCount] = useState(0);
  const [dhikr, setDhikr] = useState('SubhanAllah');
  const [copied, setCopied] = useState(false);
  const dailyHadith = getDailyHadith();

  const handleShareHadith = async () => {
    const shareText = `"${dailyHadith.english}" — ${dailyHadith.source}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Hadith - Noor',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        /* User cancelled or share failed */
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-10 sm:py-14" style={{ background: '#072018' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Islamic Guidance Card */}
          <FadeIn>
            <div
              className="rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Compass size={18} className="text-noor-gold" />
                  <h3 className="font-display text-noor-ivory font-semibold text-lg sm:text-xl">Islamic Guidance</h3>
                </div>
                <p className="text-noor-muted text-xs mb-5">Quick access to essential Islamic tools</p>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {GUIDANCE_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center justify-between p-3 rounded-xl transition-all hover:border-noor-gold/50 group"
                      style={{
                        background: 'rgba(6,24,18,0.4)',
                        border: '1px solid rgba(26,64,53,0.5)',
                      }}
                    >
                      <span className="text-noor-ivory text-xs sm:text-sm font-medium group-hover:text-noor-gold transition-colors">
                        {item.label}
                      </span>
                      <ArrowRight size={13} className="text-noor-gold transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Daily Hadith */}
          <FadeIn delay={0.05}>
            <div
              className="rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={18} className="text-noor-gold" />
                  <h3 className="font-display text-noor-ivory font-semibold text-lg sm:text-xl">Daily Hadith</h3>
                </div>
                <p className="text-noor-muted text-xs mb-4">Today's guidance for a better tomorrow.</p>

                <p
                  className="font-arabic text-noor-gold text-lg sm:text-xl leading-loose mb-3 text-right"
                  style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                >
                  {dailyHadith.arabic}
                </p>
                <p className="text-noor-ivory/80 text-xs sm:text-sm italic mb-1">
                  "{dailyHadith.english}"
                </p>
                <p className="text-noor-muted text-xs mb-4">— {dailyHadith.source} · changes daily</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1A4035]">
                <button 
                  onClick={handleShareHadith}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-noor-muted border border-noor-border hover:border-noor-gold/40 hover:text-noor-gold transition-colors"
                >
                  {copied ? <Check size={12} className="text-noor-gold" /> : <Share2 size={12} />} 
                  {copied ? 'Copied!' : 'Share'}
                </button>
                <Link
                  to="/hadith"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs text-noor-gold border border-noor-gold/30 hover:bg-noor-gold/10 transition-colors"
                >
                  View More <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Dhikr Counter */}
          <FadeIn delay={0.1}>
            <div
              className="rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-noor-ivory font-semibold text-lg sm:text-xl">Dhikr Counter</h3>
                  </div>
                </div>
                <p className="text-noor-muted text-xs mb-5">Keep remembering Allah</p>

                <div className="flex items-center justify-center gap-5 sm:gap-6 mb-2">
                  <button
                    onClick={() => setCount((c) => Math.max(0, c - 1))}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-noor-border flex items-center justify-center text-noor-muted hover:border-noor-gold/50 hover:text-noor-gold transition-all"
                  >
                    <Minus size={15} />
                  </button>
                  <div className="text-center min-w-[90px]">
                    <p className="font-display text-noor-gold text-4xl sm:text-5xl font-bold">{count}</p>
                    <p className="text-noor-muted text-xs mt-0.5">{dhikr}</p>
                  </div>
                  <button
                    onClick={() => setCount((c) => c + 1)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-noor-deep font-bold transition-all hover:scale-110"
                    style={{ background: '#E8BD4B' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="flex gap-2 mb-4 mt-4">
                  <button
                    onClick={() => setCount(0)}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs border border-noor-border text-noor-muted hover:border-noor-gold/40 hover:text-noor-gold transition-colors"
                  >
                    <RefreshCw size={11} /> Reset
                  </button>
                  <button
                    onClick={() => setCount((c) => c + 33)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                    style={{ background: '#E8BD4B', color: '#061812' }}
                  >
                    +33
                  </button>
                </div>
              </div>

              <div>
                <p className="text-noor-muted text-[10px] uppercase tracking-wider mb-2">Popular Dhikr</p>
                <div className="flex flex-wrap gap-1.5">
                  {DHIKR_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDhikr(d); setCount(0); }}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] transition-colors"
                      style={{
                        background: dhikr === d ? 'rgba(232,189,75,0.15)' : 'rgba(6,24,18,0.5)',
                        border: dhikr === d ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.5)',
                        color: dhikr === d ? '#E8BD4B' : '#A9B8B1',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <PrayerProvider>
      <div className="min-h-screen bg-[#061812] text-noor-ivory">
        <Hero />
        <PrayerTimesSection />
        <FeatureCards />
        <IslamicStories />
        <HadithDhikrCalendar />
      </div>
    </PrayerProvider>
  );
}
