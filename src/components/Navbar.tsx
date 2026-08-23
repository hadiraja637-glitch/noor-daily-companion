import { useEffect, useMemo, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { Search, Sun, Moon, User, Menu, X, ChevronDown, LogOut, UserRound, House, Languages, Check } from 'lucide-react';
import NoorLogo from './NoorLogo';
import { getTranslation, LanguageCode, TranslationKeys } from '../locales/translations';

interface NavItem {
  to: string;
  key: keyof TranslationKeys;
  end?: boolean;
}

const navLinks: NavItem[] = [
  { to: '/', key: 'home', end: true },
  { to: '/quran', key: 'quran' },
  { to: '/hadith', key: 'hadith' },
  { to: '/duas', key: 'duas' },
  { to: '/calendar', key: 'islamicCalendar' },
  { to: '/zakat', key: 'zakat' },
  { to: '/stories', key: 'stories' },
  { to: '/blog', key: 'blog' },
];

const moreLinks: NavItem[] = [
  { to: '/qibla', key: 'qiblaFinder' },
  { to: '/sunnah-habits', key: 'sunnahHabits' },
  { to: '/tasbeeh', key: 'tasbeehDhikr' },
  { to: '/calendar', key: 'islamicCalendar' },
  { to: '/zakat', key: 'zakatCalculator' },
  { to: '/stories', key: 'islamicStories' },
  { to: '/blog', key: 'islamicBlog' },
];

const languages: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ur', name: 'اردو' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'fa', name: 'فارسی' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

interface SearchableItem {
  to: string;
  key: keyof TranslationKeys;
  keywords: string;
}

const searchable: SearchableItem[] = [
  ...navLinks.map(({ to, key }) => ({ to, key, keywords: key.toLowerCase() })),
  ...moreLinks.map(({ to, key }) => ({ to, key, keywords: key.toLowerCase() })),
  { to: '/quran', key: 'readQuran', keywords: 'quran qur an surah ayah verses' },
  { to: '/hadith', key: 'dailyHadith', keywords: 'hadith bukhari sunnah sayings' },
  { to: '/duas', key: 'dailyDuas', keywords: 'dua duas supplication prayer' },
];

type Profile = { email: string; name: string };

function readProfile(): Profile | null {
  try {
    const raw = localStorage.getItem('noorProfile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem('noor-language');
    if (saved && languages.some((l) => l.code === saved)) {
      return saved as LanguageCode;
    }
  } catch {
    // Fallback to default
  }
  return 'en';
}

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(readInitialLanguage);
  const [profile, setProfile] = useState<Profile | null>(readProfile);

  const t = (key: keyof TranslationKeys) => getTranslation(selectedLanguage, key);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 20);
  const sync = () => setProfile(readProfile());

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('noor-profile-updated', sync);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('noor-profile-updated', sync);
  };
}, []);

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
    try {
      localStorage.setItem('noor-language', selectedLanguage);
    } catch {
      // Ignore storage errors
    }
  }, [selectedLanguage]);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return searchable
      .map((item) => ({ ...item, label: t(item.key) }))
      .filter((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q))
      .slice(0, 5);
  }, [search, selectedLanguage]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return;
    const result = searchable
      .map((item) => ({ ...item, label: t(item.key) }))
      .find((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q));
    if (result) {
      navigate(result.to);
      setSearch('');
    }
  };

  const signOut = () => {
    localStorage.removeItem('noorProfile');
    setProfile(null);
    setProfileOpen(false);
    window.dispatchEvent(new Event('noor-profile-updated'));
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    setSelectedLanguage(code);
    setLangOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(6,24,18,0.97)' : 'rgba(6,24,18,0.90)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(26,64,53,0.45)',
          boxShadow: '0 1px 0 rgba(232,189,75,0.18)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-5 flex items-center h-[58px] gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <NoorLogo size={36} />
            <div className="leading-none">
              <div className="flex items-end gap-2 leading-none">
                <div>
                  <div className="font-display text-noor-ivory font-semibold text-[24px] tracking-wide leading-none">
                    Noor
                  </div>
                </div>
                <div className="hidden xl:block text-noor-muted text-[8px] leading-tight max-w-[155px] pb-0.5">
                  {t('tagline')}
                </div>
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 ml-2 xl:ml-4 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-md text-[11px] xl:text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-noor-ivory bg-[#0f7658] shadow-[0_6px_18px_rgba(24,185,138,.12)]'
                      : 'text-noor-muted hover:text-noor-ivory hover:bg-white/5'
                  }`
                }
              >
                <span className="inline-flex items-center gap-1.5">
                  {link.to === '/' && <House size={12} strokeWidth={2.4} />} {t(link.key)}
                </span>
              </NavLink>
            ))}

            <div className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="px-2.5 xl:px-3 py-1.5 rounded-md text-[11px] xl:text-xs text-noor-muted hover:text-noor-ivory hover:bg-white/5 flex items-center gap-1 transition-colors"
              >
                {t('more')}{' '}
                <ChevronDown size={12} className={moreOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              {moreOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl p-2 shadow-2xl"
                  style={{ background: '#0B2820', border: '1px solid rgba(232,189,75,0.22)' }}
                >
                  {moreLinks.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      onClick={() => setMoreOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-noor-muted hover:text-noor-gold hover:bg-white/5"
                    >
                      {item.to === '/sunnah-habits' ? 'Sunnah Habits' : t(item.key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <div className="relative hidden sm:block">
              <form onSubmit={submitSearch} className="flex items-center gap-2 bg-[#102f27]/90 border border-[#2b4d43] rounded-full px-3 py-1.5">
                <Search size={14} className="text-noor-muted shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchAnything')}
                  aria-label="Search Noor"
                  className="bg-transparent text-sm text-noor-ivory placeholder:text-noor-muted outline-none w-28 xl:w-40"
                />
              </form>

              {suggestions.length > 0 && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl p-2 shadow-2xl"
                  style={{ background: '#0B2820', border: '1px solid rgba(232,189,75,0.22)' }}
                >
                  {suggestions.map((item) => (
                    <button
                      key={`${item.to}-${item.key}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        navigate(item.to);
                        setSearch('');
                      }}
                      className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-noor-muted hover:text-noor-gold hover:bg-white/5"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t('selectLanguage')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-noor-gold bg-white/5 border border-noor-border hover:border-noor-gold/50 transition-colors"
              >
                <Languages size={15} />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl p-1.5 shadow-2xl max-h-80 overflow-y-auto"
                  style={{ background: '#0B2820', border: '1px solid rgba(232,189,75,0.22)' }}
                >
                  {languages.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? 'text-noor-gold bg-noor-gold/10 font-medium'
                            : 'text-noor-muted hover:text-noor-gold hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {isSelected && <Check size={14} className="text-noor-gold ml-2 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-label={t('profile')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-noor-gold bg-white/5 border border-noor-border hover:border-noor-gold/50 transition-colors overflow-hidden"
              >
                {profile ? (
                  <span className="font-semibold text-xs">
                    {profile.name
                      .split(/\s+/)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </span>
                ) : (
                  <User size={16} />
                )}
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl p-4 shadow-2xl"
                  style={{ background: '#0B2820', border: '1px solid rgba(232,189,75,0.22)' }}
                >
                  {profile ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-noor-gold/15 text-noor-gold">
                          <UserRound size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-noor-ivory font-medium truncate">{profile.name}</p>
                          <p className="text-noor-muted text-xs truncate">{profile.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-noor-border py-2 text-xs text-noor-muted hover:text-noor-gold"
                      >
                        <LogOut size={13} /> {t('signOut')}
                      </button>
                    </>
                  ) : (
                    <div>
                      <p className="text-noor-ivory font-medium mb-1">{t('createYourNoorProfile')}</p>
                      <p className="text-noor-muted text-xs leading-relaxed mb-3">
                        Enter your email in the Stay Connected section below to save a profile on this device.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg text-noor-muted hover:text-noor-ivory hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-noor-border px-4 pb-4 pt-2" style={{ background: 'rgba(6,24,18,0.98)' }}>
            <form onSubmit={submitSearch} className="flex items-center gap-2 bg-noor-card border border-noor-border rounded-lg px-3 py-2 mb-2">
              <Search size={14} className="text-noor-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchNoor')}
                className="flex-1 bg-transparent outline-none text-sm text-noor-ivory"
              />
            </form>

            <div className="mb-3 border-b border-noor-border pb-3 pt-1">
              <label className="text-xs text-noor-muted mb-1.5 flex items-center gap-1.5 px-1">
                <Languages size={14} className="text-noor-gold" /> {t('selectLanguage')}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleSelectLanguage(e.target.value as LanguageCode)}
                className="w-full bg-[#0B2820] text-noor-ivory border border-noor-border rounded-lg px-3 py-2 text-sm outline-none focus:border-noor-gold/50"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#0B2820] text-noor-ivory">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              {[...navLinks, ...moreLinks.filter((m) => !navLinks.some((n) => n.to === m.to))].map((link) => (
                <NavLink
                  key={link.key}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm ${
                      isActive ? 'text-noor-gold bg-noor-gold/10' : 'text-noor-muted hover:text-noor-ivory hover:bg-white/5'
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-noor-border"
        style={{ background: 'rgba(6,24,18,0.97)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center justify-around py-2">
          {[
            { to: '/', key: 'home' as keyof TranslationKeys, end: true },
            { to: '/quran', key: 'quran' as keyof TranslationKeys },
            { to: '/duas', key: 'duas' as keyof TranslationKeys },
            { to: '/qibla', key: 'qiblaFinder' as keyof TranslationKeys },
            { to: '/blog', key: 'more' as keyof TranslationKeys },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${
                  isActive ? 'text-noor-gold' : 'text-noor-muted'
                }`
              }
            >
              <span className="text-base leading-none">
                {link.to === '/' ? '🏠' : link.to === '/quran' ? '📖' : link.to === '/duas' ? '🤲' : link.to === '/qibla' ? '🧭' : '⋯'}
              </span>
              {t(link.key)}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
