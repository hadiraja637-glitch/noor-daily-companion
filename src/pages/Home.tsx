import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  BookOpen, MessageSquare, Heart, Compass, CalendarDays, DollarSign,
  RotateCcw, FileText, ArrowRight, Share2, Settings, MapPin,
  Plus, Minus, RefreshCw, Clock, Star, Mail,
} from 'lucide-react';
import { STORIES } from '../data/stories';
import {
  CITY_OPTIONS, DEFAULT_LOCATION, fetchPrayerData, getCurrentAndNextPrayer,
  type PrayerData, type PrayerLocation,
} from '../services/prayer';
import { GLOBAL_LOCATIONS } from '../services/globalLocations';
import { getDailyHadith } from '../data/dailyHadith';

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
          name: 'Current location', country: '', lat: pos.coords.latitude, lon: pos.coords.longitude,
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
      () => { setLoading(false); setError('Location permission was denied. Showing your saved city.'); },
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
              <p className="text-noor-muted text-xs tracking-[0.3em] uppercase mb-6">
                GUIDANCE • PRAYER • BETTER YOU
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] text-noor-ivory mb-4">
                A Brighter Day <br />
                <span className="text-noor-gold italic">with Allah</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="text-noor-muted text-sm sm:text-base leading-relaxed mb-5 max-w-md">
                Qur'an in your heart, guidance in your life,<br className="hidden sm:block" />
                and barakah in every step.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/quran"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: '#E8BD4B', color: '#061812' }}
                >
                  Read Qur'an <ArrowRight size={14} />
                </Link>
                <Link
                  to="/stories"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-noor-ivory/30 text-noor-ivory hover:border-noor-gold/60 hover:text-noor-gold transition-all"
                >
                  Explore Islamic Stories
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
                <span className="text-noor-muted text-xs">{loading ? 'Loading location…' : location.name}</span>
              </div>
              <Link
                to="/calendar"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium border border-noor-gold/30 text-noor-gold hover:bg-noor-gold/10 transition-colors mb-5"
              >
                Islamic Calendar <ArrowRight size={12} />
              </Link>

              <div className="text-center">
                <p
                  className="font-arabic text-noor-gold text-xl leading-loose mb-2"
                  style={{ direction: 'rtl', fontFamily: 'Amiri, serif' }}
                >
                  وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
                </p>
                <p className="text-noor-ivory/70 text-xs italic">
                  "And my success is only by Allah."
                </p>
                <p className="text-noor-muted text-xs mt-1">— Qur'an 11:88</p>
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

  return (
    <section className="py-12" style={{ background: '#0B2820', borderTop: '1px solid rgba(26,64,53,0.5)' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="rounded-2xl p-5 sm:p-6 h-full" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={15} className="text-noor-accent" />
                    <h2 className="font-display text-noor-ivory text-xl font-semibold">Today's Prayer Times</h2>
                  </div>
                  <p className="text-noor-muted text-xs">Stay connected with your Salah</p>
                  {error && <p className="text-noor-gold text-[10px] mt-1">{error}</p>}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-noor-muted text-xs"><MapPin size={11} /> {loading ? 'Loading location…' : location.name}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={useCurrentLocation} className="text-[10px] text-noor-gold hover:underline">Use my location</button>
                    <div className="relative">
                      <input
                        list="noor-global-locations"
                        value={location.name}
                        onChange={(e) => { const value = e.target.value; const city = [...CITY_OPTIONS, ...GLOBAL_LOCATIONS].find((c) => c.name.toLowerCase() === value.toLowerCase()); if (city) setCity(city); }}
                        placeholder="🌍 Search worldwide"
                        className="bg-[#103329] text-[10px] text-noor-muted outline-none border border-noor-border rounded-lg px-2 py-1 w-[180px] placeholder:text-noor-muted/70"
                        aria-label="Search a country or city worldwide"
                      />
                      <datalist id="noor-global-locations">
                        {[...CITY_OPTIONS, ...GLOBAL_LOCATIONS].map((city, i) => <option key={`${city.name}-${i}`} value={city.name} />)}
                      </datalist>
                    </div>
                  </div>
                  <Link to="/calendar" className="mt-1 inline-flex items-center gap-1 text-xs text-noor-gold hover:underline">View Calendar <ArrowRight size={11} /></Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 flex-1 w-full overflow-x-auto">
                  {(timings.length ? timings : CITY_OPTIONS.length ? [
                    { name: 'Fajr', time: '--:--', minutes: 0 }, { name: 'Sunrise', time: '--:--', minutes: 0 }, { name: 'Dhuhr', time: '--:--', minutes: 0 }, { name: 'Asr', time: '--:--', minutes: 0 }, { name: 'Maghrib', time: '--:--', minutes: 0 }, { name: 'Isha', time: '--:--', minutes: 0 },
                  ] : []).map((prayer) => {
                    const isActive = prayer.name === activePrayer?.name;
                    return (
                      <div key={prayer.name} className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl transition-all min-w-[70px]" style={{ background: isActive ? 'rgba(232,189,75,0.12)' : 'rgba(6,24,18,0.4)', border: isActive ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.4)' }}>
                        <span className="text-lg leading-none">{prayer.name === 'Fajr' ? '🌙' : prayer.name === 'Sunrise' ? '🌅' : prayer.name === 'Dhuhr' ? '☀️' : prayer.name === 'Asr' ? '🌤️' : prayer.name === 'Maghrib' ? '🌇' : '🌃'}</span>
                        <span className={`text-xs font-medium ${isActive ? 'text-noor-gold' : 'text-noor-muted'}`}>{prayer.name}</span>
                        <span className={`text-sm font-semibold ${isActive ? 'text-noor-gold' : 'text-noor-ivory'}`}>{prayer.time}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                      <defs><linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#18B98A" /><stop offset="100%" stopColor="#E8BD4B" /></linearGradient></defs>
                      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(26,64,53,0.6)" strokeWidth="5" />
                      <circle cx="60" cy="60" r={r} fill="none" stroke="url(#cGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                    </svg>
                    <div className="text-center z-10">
                      <p className="text-noor-gold text-[10px] font-medium tracking-wider uppercase">{nextPrayer?.name ?? 'Prayer'}</p>
                      <p className="font-display text-noor-ivory text-lg font-bold tabular-nums">{fmtSeconds(countdown)}</p>
                      <p className="text-noor-muted text-[9px]">Time remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FadeIn className="xl:col-span-1">
            <div className="rounded-2xl overflow-hidden h-full" style={{ border: '1px solid rgba(26,64,53,0.7)' }}>
              <div className="relative h-36 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=300&fit=crop&auto=format" alt="Quran" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(16,51,41,0.2), rgba(16,51,41,0.7))' }} />
                <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(232,189,75,0.2)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.3)' }}>Qur'an</span>
              </div>
              <div className="p-5" style={{ background: '#103329' }}>
                <h3 className="font-display text-noor-ivory text-base font-semibold mb-3">Verse of the Day</h3>
                <p className="font-arabic text-noor-gold text-xl leading-loose mb-3 text-right" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>فَإِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
                <p className="text-noor-ivory/80 text-sm italic mb-1">"Indeed, with hardship comes ease."</p>
                <p className="text-noor-muted text-xs mb-4">— Qur'an 94:6</p>
                <Link to="/quran" className="flex items-center gap-2 text-sm text-noor-gold hover:underline">Read Full Surah <ArrowRight size={13} /></Link>
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
  { icon: Heart, label: 'Duas', sub: 'For Every Moment', to: '/duas' },
  { icon: Compass, label: 'Qibla Finder', sub: 'Find Qibla Direction', to: '/qibla' },
  { icon: CalendarDays, label: 'Islamic Calendar', sub: 'Important Dates', to: '/calendar' },
  { icon: DollarSign, label: 'Zakat Calculator', sub: 'Calculate with Ease', to: '/zakat' },
  { icon: RotateCcw, label: 'Tasbeeh', sub: 'Digital Counter', to: '/tasbeeh' },
  { icon: FileText, label: 'Islamic Blog', sub: 'Knowledge & Insights', to: '/blog' },
];

function FeatureCards() {
  return (
    <section className="py-8" style={{ background: '#072018', borderTop: '1px solid rgba(26,64,53,0.4)' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.label} delay={i * 0.04}>
              <Link
                to={f.to}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl group transition-all hover:scale-105"
                style={{
                  background: 'rgba(16,51,41,0.5)',
                  border: '1px solid rgba(26,64,53,0.5)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(232,189,75,0.12)' }}
                >
                  <f.icon size={16} className="text-noor-gold" />
                </div>
                <div className="text-center">
                  <p className="text-noor-ivory text-xs font-medium group-hover:text-noor-gold transition-colors">
                    {f.label}
                  </p>
                  <p className="text-noor-muted text-[10px] leading-tight mt-0.5">{f.sub}</p>
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
    <section className="py-14" style={{ background: '#0B2820' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Star size={14} className="text-noor-gold" />
                <h2 className="font-display text-noor-ivory text-2xl sm:text-3xl font-semibold">
                  Islamic Stories
                </h2>
              </div>
              <p className="text-noor-muted text-sm">
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
          className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible"
          style={{ scrollbarWidth: 'none' }}
        >
          {STORIES.map((s, i) => (
            <FadeIn key={s.slug} delay={i * 0.06} className="flex-shrink-0 w-56 sm:w-auto">
              <Link
                to={`/stories/${s.slug}`}
                className="block rounded-xl overflow-hidden group transition-transform hover:-translate-y-1"
                style={{ border: '1px solid rgba(26,64,53,0.5)' }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,24,18,0.9) 0%, rgba(6,24,18,0.1) 60%)' }}
                  />
                  <p className="absolute bottom-3 left-3 right-3 text-noor-ivory text-sm font-medium leading-snug whitespace-pre-line">
                    {s.title}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link to="/stories" className="text-sm text-noor-gold hover:underline">
            View All Stories →
          </Link>
        </div>
      </div>
    </section>
  );
}

const DHIKR_OPTIONS = ['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'La ilaha illallah'];

function HadithDhikrCalendar() {
  const [count, setCount] = useState(33);
  const [dhikr, setDhikr] = useState('SubhanAllah');
  const dailyHadith = getDailyHadith();

  return (
    <section className="py-14" style={{ background: '#072018' }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Hadith */}
          <FadeIn>
            <div
              className="rounded-2xl p-6 h-full flex flex-col"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={14} className="text-noor-gold" />
                <h3 className="font-display text-noor-ivory font-semibold text-lg">Daily Hadith</h3>
              </div>
              <p className="text-noor-muted text-xs mb-5">Today's guidance for a better tomorrow.</p>

              <p
                className="font-arabic text-noor-gold text-xl leading-loose mb-4 text-right flex-1"
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {dailyHadith.arabic}
              </p>
              <p className="text-noor-ivory/80 text-sm italic mb-1">
                "{dailyHadith.english}"
              </p>
              <p className="text-noor-muted text-xs mb-5">— {dailyHadith.source} · changes daily</p>

              <div className="flex items-center gap-3 mt-auto">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-noor-muted border border-noor-border hover:border-noor-gold/40 hover:text-noor-gold transition-colors">
                  <Share2 size={12} /> Share
                </button>
                <Link
                  to="/hadith"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-noor-gold border border-noor-gold/30 hover:bg-noor-gold/10 transition-colors"
                >
                  View More <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Dhikr Counter */}
          <FadeIn delay={0.1}>
            <div
              className="rounded-2xl p-6 h-full flex flex-col"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-noor-gold" />
                  <h3 className="font-display text-noor-ivory font-semibold text-lg">Dhikr Counter</h3>
                </div>
                <button className="text-noor-muted hover:text-noor-gold transition-colors">
                  <Settings size={14} />
                </button>
              </div>
              <p className="text-noor-muted text-xs mb-6">Keep remembering Allah</p>

              <div className="flex items-center justify-center gap-6 mb-2">
                <button
                  onClick={() => setCount((c) => Math.max(0, c - 1))}
                  className="w-10 h-10 rounded-full border border-noor-border flex items-center justify-center text-noor-muted hover:border-noor-gold/50 hover:text-noor-gold transition-all"
                >
                  <Minus size={16} />
                </button>
                <div className="text-center">
                  <p className="font-display text-noor-gold text-5xl font-bold">{count}</p>
                  <p className="text-noor-muted text-xs mt-1">{dhikr}</p>
                </div>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-noor-deep font-bold transition-all hover:scale-110"
                  style={{ background: '#E8BD4B' }}
                >
                  <Plus size={16} />
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

              <div>
                <p className="text-noor-muted text-[10px] uppercase tracking-wider mb-2">Popular Dhikr</p>
                <div className="flex flex-wrap gap-1.5">
                  {DHIKR_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDhikr(d); setCount(0); }}
                      className="px-2.5 py-1 rounded-full text-[10px] transition-colors"
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

          {/* Quick Islamic Features Card */}
          <FadeIn delay={0.2}>
            <div
              className="rounded-2xl p-6 h-full flex flex-col justify-between"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Compass size={14} className="text-noor-gold" />
                  <h3 className="font-display text-noor-ivory font-semibold text-lg">Islamic Guidance</h3>
                </div>
                <p className="text-noor-muted text-xs mb-5">Quick access to essential Islamic tools</p>
                
                <div className="space-y-3 mb-6">
                  <Link to="/qibla" className="flex items-center justify-between p-3 rounded-xl bg-[#072018]/60 border border-[#1A4035] hover:border-noor-gold/40 transition-colors">
                    <span className="text-noor-ivory text-xs font-medium">Find Qibla Direction</span>
                    <ArrowRight size={13} className="text-noor-gold" />
                  </Link>
                  <Link to="/zakat" className="flex items-center justify-between p-3 rounded-xl bg-[#072018]/60 border border-[#1A4035] hover:border-noor-gold/40 transition-colors">
                    <span className="text-noor-ivory text-xs font-medium">Calculate Your Zakat</span>
                    <ArrowRight size={13} className="text-noor-gold" />
                  </Link>
                  <Link to="/duas" className="flex items-center justify-between p-3 rounded-xl bg-[#072018]/60 border border-[#1A4035] hover:border-noor-gold/40 transition-colors">
                    <span className="text-noor-ivory text-xs font-medium">Daily Duas & Supplications</span>
                    <ArrowRight size={13} className="text-noor-gold" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-noor-border/40 text-center">
                <p className="text-noor-muted text-xs mb-2">Newsletter Subscription</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="bg-[#072018] text-xs text-noor-ivory border border-noor-border rounded-lg px-3 py-2 flex-1 outline-none"
                  />
                  <button className="px-3 py-2 bg-noor-gold text-noor-deep text-xs font-medium rounded-lg">
                    Join
                  </button>
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
      <div dir="ltr" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Hero />
        <PrayerTimesSection />
        <FeatureCards />
        <IslamicStories />
        <HadithDhikrCalendar />
      </div>
    </PrayerProvider>
  );
}
