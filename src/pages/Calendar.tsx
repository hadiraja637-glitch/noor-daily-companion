import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ISLAMIC_MONTHS = [
  'Muharram', "Safar", "Rabi' al-awwal", "Rabi' al-Thani",
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
];

const IMPORTANT_DATES = [
  { name: 'Islamic New Year', hijri: '1 Muharram 1449', gregorian: 'Jul 7, 2027', color: '#18B98A' },
  { name: 'Ashura', hijri: '10 Muharram 1449', gregorian: 'Jul 16, 2027', color: '#E8BD4B' },
  { name: "Mawlid an-Nabi ﷺ", hijri: "12 Rabi' al-awwal 1448", gregorian: 'Sep 4, 2026', color: '#E8BD4B' },
  { name: "Laylat al-Mi'raj", hijri: "27 Rajab 1448", gregorian: 'Feb 14, 2027', color: '#A9B8B1' },
  { name: "Laylat al-Bara'ah", hijri: "15 Sha'ban 1448", gregorian: 'Mar 6, 2027', color: '#A9B8B1' },
  { name: 'First Day of Ramadan', hijri: '1 Ramadan 1448', gregorian: 'Mar 20, 2027', color: '#18B98A' },
  { name: 'Laylat al-Qadr (Est.)', hijri: '27 Ramadan 1448', gregorian: 'Apr 15, 2027', color: '#E8BD4B' },
  { name: 'Eid al-Fitr', hijri: '1 Shawwal 1448', gregorian: 'Apr 19, 2027', color: '#E8BD4B' },
  { name: 'Eid al-Adha', hijri: '10 Dhul Hijjah 1448', gregorian: 'Jun 26, 2027', color: '#E8BD4B' },
];

export default function Calendar() {
  const [month, setMonth] = useState(2); // Rabi' al-awwal index

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#061812' }}>
      <div
        className="py-12 mb-8 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Islamic Calendar</h1>
          <p className="text-noor-muted text-sm">Hijri dates and important Islamic occasions</p>
          <div className="mt-4">
            <p className="text-noor-gold font-display text-xl">8 Rabi' al-awwal 1448 AH</p>
            <p className="text-noor-muted text-sm">Friday, August 21, 2026</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Month navigator */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setMonth((m) => (m - 1 + 12) % 12)}
              className="p-2 rounded-lg text-noor-muted hover:text-noor-gold hover:bg-noor-gold/10 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h2 className="font-display text-noor-ivory text-2xl font-semibold">{ISLAMIC_MONTHS[month]}</h2>
              <p className="text-noor-muted text-sm">1448 AH</p>
            </div>
            <button
              onClick={() => setMonth((m) => (m + 1) % 12)}
              className="p-2 rounded-lg text-noor-muted hover:text-noor-gold hover:bg-noor-gold/10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Mini calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-noor-muted text-xs py-1 font-medium">{d}</div>
            ))}
            {/* Offset + days */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: 29 }, (_, i) => {
              const day = i + 1;
              const isToday = month === 2 && day === 8;
              return (
                <button
                  key={day}
                  className="py-1.5 text-xs rounded-lg transition-colors"
                  style={{
                    background: isToday ? '#E8BD4B' : 'transparent',
                    color: isToday ? '#061812' : day === 8 ? '#F7F0DE' : '#A9B8B1',
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Important dates */}
        <h2 className="font-display text-noor-ivory text-2xl font-semibold mb-4">
          Important Islamic Dates
        </h2>
        <div className="space-y-3">
          {IMPORTANT_DATES.map((ev) => (
            <div
              key={ev.name}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.5)' }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.color }} />
              <div className="flex-1">
                <p className="text-noor-ivory text-sm font-medium">{ev.name}</p>
                <p className="text-noor-muted text-xs">{ev.hijri}</p>
              </div>
              <span className="text-noor-muted text-xs">{ev.gregorian}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
