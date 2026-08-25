import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Clock, RefreshCw } from 'lucide-react';

const ISLAMIC_MONTHS = [
  'Muharram', "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
];

interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  designation?: { abbreviated: string };
}

interface GregorianDate {
  date: string;
  day: string;
  weekday: { en: string };
  month: { en: string };
  year: string;
}

interface DateData {
  hijri: HijriDate;
  gregorian: GregorianDate;
}

interface EventItem {
  name: string;
  month: number;
  day: number;
  color: string;
  gregorianDate?: string;
}

const BASE_EVENTS: EventItem[] = [
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
  const [eventsList, setEventsList] = useState<EventItem[]>(BASE_EVENTS);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [monthDaysCount, setMonthDaysCount] = useState<number>(30); // Dynamic days count

  // Fetch Current Islamic Date & Month Length helper if needed
  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/gToH');
        const json = await res.json();
        if (json.data) {
          setTodayData(json.data);
          const hMonth = json.data.hijri.month.number;
          const hYear = parseInt(json.data.hijri.year, 10);
          const hDay = parseInt(json.data.hijri.day, 10);
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

  // Fetch Gregorian dates for Islamic Occasions when Year changes
  useEffect(() => {
    const fetchEventGregorianDates = async () => {
      setLoadingEvents(true);
      try {
        const updatedEvents = await Promise.all(
          BASE_EVENTS.map(async (ev) => {
            const formattedDay = String(ev.day).padStart(2, '0');
            const formattedMonth = String(ev.month).padStart(2, '0');
            const url = `https://api.aladhan.com/v1/hToG/${formattedDay}-${formattedMonth}-${currentHijriYear}`;
            
            const res = await fetch(url);
            const json = await res.json();
            
            if (json.data && json.data.gregorian) {
              const g = json.data.gregorian;
              return {
                ...ev,
                gregorianDate: `${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`,
              };
            }
            return ev;
          })
        );
        setEventsList(updatedEvents);
      } catch (err) {
        console.error('Failed to fetch Gregorian event dates', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (currentHijriYear) {
      fetchEventGregorianDates();
    }
  }, [currentHijriYear]);

  // Dynamically determine days in current Hijri month (Standard Islamic months alternate 30/29 or check via API/approximation)
  // Most standard calculation or fallback: odd months 30 days, even months 29 days (except Dhu al-Hijjah in leap years)
  useEffect(() => {
    // Standard approximation for Islamic months length
    const isEvenMonth = currentHijriMonth % 2 === 0;
    // Dhu al-Hijjah (month 12) can have 30 days in leap years, otherwise 29. 
    // Let's use a safe standard fallback: 30 for odd, 29 for even, with Dhu al-Hijjah checked or defaulted to 29/30.
    const days = currentHijriMonth === 12 ? 30 : isEvenMonth ? 29 : 30;
    setMonthDaysCount(days);
    
    // Reset selected day if it exceeds the new month's total days
    if (selectedDay && selectedDay > days) {
      setSelectedDay(days);
    }
  }, [currentHijriMonth, currentHijriYear]);

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

  const isCurrentMonth =
    todayData &&
    todayData.hijri.month.number === currentHijriMonth &&
    parseInt(todayData.hijri.year, 10) === currentHijriYear;

  const monthEvents = eventsList.filter((e) => e.month === currentHijriMonth);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-8 sm:py-10 mb-6 sm:mb-8 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <Sparkles size={13} /> Live Hijri & Gregorian Sync
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Islamic Calendar</h1>
          <p className="text-noor-muted text-xs sm:text-sm">Accurate Hijri dates and scientific calendar occasions</p>

          {loading ? (
            <div className="pt-2 text-noor-muted text-xs animate-pulse">Syncing dates...</div>
          ) : todayData ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 text-noor-gold font-display font-semibold text-base sm:text-lg">
                <CalendarIcon size={16} />
                <span>{todayData.hijri.day} {todayData.hijri.month.en} {todayData.hijri.year} AH</span>
              </div>
              <span className="hidden sm:inline text-noor-muted/40">•</span>
              <div className="flex items-center gap-1.5 text-noor-muted text-xs sm:text-sm">
                <Clock size={13} />
                <span>{todayData.gregorian.weekday.en}, {todayData.gregorian.month.en} {todayData.gregorian.day}, {todayData.gregorian.year}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Month Navigator & Grid */}
        <div className="rounded-2xl p-4 sm:p-6 bg-[#103329] border border-[#1A4035]/70 shadow-xl">
          {/* Controls */}
          <div className="flex items-center justify-between mb-5 border-b border-[#1A4035]/50 pb-3.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 sm:p-2.5 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#E8BD4B]/10 border border-transparent hover:border-[#E8BD4B]/20 transition-all flex items-center gap-1 text-xs sm:text-sm"
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-center">
              <h2 className="font-display text-lg sm:text-2xl font-bold text-noor-ivory">
                {ISLAMIC_MONTHS[currentHijriMonth - 1]}
              </h2>
              <p className="text-noor-gold/90 text-xs sm:text-sm font-medium mt-0.5">
                {currentHijriYear} AH
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 sm:p-2.5 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#E8BD4B]/10 border border-transparent hover:border-[#E8BD4B]/20 transition-all flex items-center gap-1 text-xs sm:text-sm"
              aria-label="Next Month"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-noor-muted/80 text-[11px] sm:text-xs py-1.5 font-semibold uppercase tracking-wider">
                {d}
              </div>
            ))}

            {Array.from({ length: monthDaysCount }, (_, i) => {
              const dayNum = i + 1;
              const isToday = isCurrentMonth && parseInt(todayData?.hijri.day || '0', 10) === dayNum;
              const isSelected = selectedDay === dayNum;
              const hasEvent = eventsList.some((e) => e.month === currentHijriMonth && e.day === dayNum);

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className="relative group py-2 sm:py-3 text-xs sm:text-sm rounded-xl transition-all flex flex-col items-center justify-center min-h-[40px] sm:min-h-[48px]"
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
                      className="w-1.5 h-1.5 rounded-full absolute bottom-1"
                      style={{ background: isToday ? '#061812' : '#E8BD4B' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Month's Events */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg sm:text-xl font-bold text-noor-ivory">
              Occasions in {ISLAMIC_MONTHS[currentHijriMonth - 1]}
            </h3>
            <span className="text-xs text-noor-muted bg-[#103329] px-2.5 py-1 rounded-full border border-[#1A4035]">
              {monthEvents.length} Event{monthEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {monthEvents.length === 0 ? (
            <div className="p-5 rounded-xl bg-[#103329]/50 border border-[#1A4035]/50 text-center text-noor-muted text-xs">
              No major Islamic occasion listed for this month.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monthEvents.map((ev) => (
                <div
                  key={ev.name}
                  className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#103329] border border-[#1A4035]/60 space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ev.color }} />
                    <p className="text-noor-ivory text-sm font-semibold truncate">{ev.name}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1A4035]/40">
                    <span className="text-noor-gold font-medium">
                      {ev.day} {ISLAMIC_MONTHS[ev.month - 1]} {currentHijriYear} AH
                    </span>
                    <span className="text-noor-muted font-mono">
                      {ev.gregorianDate || 'Calculating...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key Islamic Occasions Reference Table with Scientific/Gregorian Dates */}
        <div className="space-y-3 sm:space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-noor-ivory">
                Islamic Occasions Reference ({currentHijriYear} AH)
              </h3>
              <p className="text-noor-muted text-xs">Hijri and Scientific (Gregorian) dates calculated live</p>
            </div>
            {loadingEvents && <RefreshCw size={15} className="animate-spin text-noor-gold" />}
          </div>

          <div className="space-y-2">
            {eventsList.map((ev) => (
              <div
                key={ev.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 sm:py-3 rounded-xl bg-[#103329]/60 border border-[#1A4035]/40 gap-1.5 sm:gap-4 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.color }} />
                  <span className="text-noor-ivory font-medium">{ev.name}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-4 sm:pl-0 text-xs">
                  <span className="text-noor-gold font-mono">
                    {ev.day} {ISLAMIC_MONTHS[ev.month - 1]}
                  </span>
                  <span className="text-noor-muted/60 hidden sm:inline">•</span>
                  <span className="text-noor-muted font-medium bg-[#061812]/50 px-2 py-0.5 rounded border border-[#1A4035]/50">
                    {ev.gregorianDate || 'Loading...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
