import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Clock, MapPin } from 'lucide-react';

const ISLAMIC_MONTHS = [
  'Muharram', "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
];

interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { expanded: string };
}

interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
}

interface DateData {
  hijri: HijriDate;
  gregorian: GregorianDate;
}

const IMPORTANT_EVENTS = [
  { name: 'Islamic New Year', month: 1, day: 1, color: '#18B98A' },
  { name: 'Ashura', month: 1, day: 10, color: '#E8BD4B' },
  { name: "Mawlid an-Nabi ﷺ", month: 3, day: 12, color: '#E8BD4B' },
  { name: "Laylat al-Mi'raj", month: 7, day: 27, color: '#A9B8B1' },
  { name: "Laylat al-Bara'ah", month: 8, day: 15, color: '#A9B8B1' },
  { name: 'First Day of Ramadan', month: 9, day: 1, color: '#18B98A' },
  { name: 'Laylat al-Qadr (Est.)', month: 9, day: 27, color: '#E8BD4B' },
  { name: 'Eid al-Fitr', month: 10, day: 1, color: '#E8BD4B' },
  { name: 'Waqfat Arafah', month: 12, day: 9, color: '#18B98A' },
  { name: 'Eid al-Adha', month: 12, day: 10, color: '#E8BD4B' },
];

export default function Calendar() {
  const [todayData, setTodayData] = useState<DateData | null>(null);
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(1);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1448);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Current Islamic Date from Free Aladhan API
  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/gToH');
        const json = await res.json();
        if (json.data) {
          setTodayData(json.data);
          const hMonth = json.data.hijri.month.number;
          const hYear = parseInt(json.data.hijri.year);
          const hDay = parseInt(json.data.hijri.day);
          setCurrentHijriMonth(hMonth);
          setCurrentHijriYear(hYear);
          setSelectedDay(hDay);
        }
      } catch (err) {
        console.error('Failed to fetch Islamic date', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDate();
  }, []);

  const handlePrevMonth = () => {
    if (currentHijriMonth === 1) {
      setCurrentHijriMonth(12);
      setCurrentHijriYear((y) => y - 1);
    } else {
      setCurrentHijriMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentHijriMonth === 12) {
      setCurrentHijriMonth(1);
      setCurrentHijriYear((y) => y + 1);
    } else {
      setCurrentHijriMonth((m) => m + 1);
    }
  };

  const isCurrentMonth = todayData && 
    todayData.hijri.month.number === currentHijriMonth && 
    parseInt(todayData.hijri.year) === currentHijriYear;

  const monthEvents = IMPORTANT_EVENTS.filter((e) => e.month === currentHijriMonth);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-10 mb-8 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <Sparkles size={13} /> Live Hijri Sync
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide">Islamic Calendar</h1>
          <p className="text-noor-muted text-xs sm:text-sm">Accurate Hijri date conversion & sacred occasions</p>
          
          {loading ? (
            <div className="pt-2 text-noor-muted text-xs animate-pulse">Syncing with live API...</div>
          ) : todayData ? (
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 text-noor-gold font-display font-semibold text-lg sm:text-xl">
                <CalendarIcon size={18} />
                <span>{todayData.hijri.day} {todayData.hijri.month.en} {todayData.hijri.year} AH</span>
              </div>
              <span className="hidden sm:inline text-noor-muted/40">•</span>
              <div className="flex items-center gap-1.5 text-noor-muted text-xs sm:text-sm">
                <Clock size={14} />
                <span>{todayData.gregorian.weekday.en}, {todayData.gregorian.month.en} {todayData.gregorian.day}, {todayData.gregorian.year}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Month Navigator & Calendar Grid */}
        <div className="rounded-2xl p-5 sm:p-7 bg-[#103329] border border-[#1A4035]/70 shadow-xl">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 border-b border-[#1A4035]/50 pb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#E8BD4B]/10 border border-transparent hover:border-[#E8BD4B]/20 transition-all flex items-center gap-1 text-xs sm:text-sm"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-center">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-noor-ivory">
                {ISLAMIC_MONTHS[currentHijriMonth - 1]}
              </h2>
              <p className="text-noor-gold/90 text-xs sm:text-sm font-medium mt-0.5">
                {currentHijriYear} AH
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#E8BD4B]/10 border border-transparent hover:border-[#E8BD4B]/20 transition-all flex items-center gap-1 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-noor-muted/80 text-xs py-2 font-semibold uppercase tracking-wider">
                {d}
              </div>
            ))}

            {Array.from({ length: 30 }, (_, i) => {
              const dayNum = i + 1;
              const isToday = isCurrentMonth && parseInt(todayData?.hijri.day || '0') === dayNum;
              const isSelected = selectedDay === dayNum;
              const hasEvent = IMPORTANT_EVENTS.some((e) => e.month === currentHijriMonth && e.day === dayNum);

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className="relative group py-2.5 sm:py-3.5 text-xs sm:text-sm rounded-xl transition-all flex flex-col items-center justify-center min-h-[44px]"
                  style={{
                    background: isToday ? '#E8BD4B' : isSelected ? 'rgba(232, 189, 75, 0.15)' : 'rgba(6, 24, 18, 0.3)',
                    color: isToday ? '#061812' : isSelected ? '#E8BD4B' : '#F7F0DE',
                    border: isToday ? '1px solid #E8BD4B' : isSelected ? '1px solid rgba(232, 189, 75, 0.4)' : '1px solid rgba(26, 64, 53, 0.3)',
                    fontWeight: isToday || isSelected ? 700 : 500,
                  }}
                >
                  <span>{dayNum}</span>
                  {hasEvent && (
                    <span
                      className="w-1.5 h-1.5 rounded-full absolute bottom-1.5"
                      style={{ background: isToday ? '#061812' : '#E8BD4B' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Month's Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-noor-ivory">
              Occasions in {ISLAMIC_MONTHS[currentHijriMonth - 1]}
            </h3>
            <span className="text-xs text-noor-muted bg-[#103329] px-3 py-1 rounded-full border border-[#1A4035]">
              {monthEvents.length} Event{monthEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {monthEvents.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#103329]/50 border border-[#1A4035]/50 text-center text-noor-muted text-xs">
              No major Islamic occasion listed for this month.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monthEvents.map((ev) => (
                <div
                  key={ev.name}
                  className="flex items-center gap-3.5 p-4 rounded-xl bg-[#103329] border border-[#1A4035]/60 hover:border-[#E8BD4B]/30 transition-all"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-noor-ivory text-sm font-semibold truncate">{ev.name}</p>
                    <p className="text-noor-muted text-xs">
                      {ev.day} {ISLAMIC_MONTHS[ev.month - 1]} {currentHijriYear} AH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Major Islamic Dates Quick Reference */}
        <div className="space-y-4 pt-2">
          <h3 className="font-display text-xl font-bold text-noor-ivory">
            Key Islamic Occasions Reference
          </h3>
          <div className="space-y-2.5">
            {IMPORTANT_EVENTS.map((ev) => (
              <div
                key={ev.name}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#103329]/60 border border-[#1A4035]/40 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: ev.color }} />
                  <span className="text-noor-ivory font-medium">{ev.name}</span>
                </div>
                <span className="text-noor-gold font-mono">
                  {ev.day} {ISLAMIC_MONTHS[ev.month - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
