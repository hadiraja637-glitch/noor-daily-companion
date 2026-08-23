import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flame } from 'lucide-react';

/**
 * SunnahHabits page
 * Dark emerald + gold theme (matches the Zakat calculator design).
 * Colors are applied via inline styles / hex values rather than the
 * project's `noor-*` Tailwind tokens, so the look is guaranteed
 * regardless of Tailwind theme/build configuration.
 */

const THEME = {
  bgPage: '#061812',
  bgHero: '#0B2820',
  bgPanel: '#103329',
  bgPanelAlt: '#173f32',
  bgTrack: '#0b2419',
  border: 'rgba(26,64,53,.7)',
  borderSoft: 'rgba(26,64,53,.55)',
  gold: '#E8BD4B',
  goldSoft: 'rgba(232,189,75,.22)',
  goldDim: '#8a6a1f',
  goldMid: '#C99B32',
  cream: '#F7F0DE',
  creamMuted: '#A9B8B1',
  deep: '#071F18',
};

type Habit = { id: string; title: string; category: string };

const SUNNAH_HABITS: Habit[] = [
  { id: 'prayers', title: '5 Daily Prayers on Time', category: 'Obligatory' },
  { id: 'tahajjud', title: 'Tahajjud / Night Prayer', category: 'Sunnah' },
  { id: 'quran_reading', title: 'Daily Quran Recitation (At least 1 Page)', category: 'Quran' },
  { id: 'morning_azkar', title: 'Morning Azkar (Sabah)', category: 'Azkar' },
  { id: 'evening_azkar', title: 'Evening Azkar (Masaa)', category: 'Azkar' },
  { id: 'durood', title: 'Recite Durood Sharif 100 Times', category: 'Dhikr' },
  { id: 'astaghfar', title: 'Recite Astaghfar 100 Times', category: 'Dhikr' },
  { id: 'miswak', title: 'Use Miswak Before Prayers', category: 'Sunnah' },
  { id: 'sadaqah', title: 'Give Small Sadaqah / Act of Kindness', category: 'Sunnah' },
  { id: 'surah_mulk', title: 'Recite Surah Al-Mulk Before Sleep', category: 'Night Routine' },
  { id: 'wudu_sleep', title: 'Perform Wudu Before Going to Sleep', category: 'Night Routine' },
  { id: 'smile_sunnah', title: 'Smile & Speak Kind Words to Others', category: 'Sunnah' },
];

const STREAK_THRESHOLD = 70;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const KEYS = {
  daily: (dateKey: string) => `noor_habits_${dateKey}`,
  streak: 'noor_user_streak',
  lastStreakDate: 'noor_last_streak_date',
  monthly: 'noor_monthly_records',
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function colorForScore(score: number) {
  if (score >= 80) return THEME.gold;
  if (score >= 50) return THEME.goldMid;
  if (score > 0) return THEME.goldDim;
  return THEME.bgPanelAlt;
}

function MonthGrid({
  year,
  monthIndex,
  monthlyRecord,
  isCurrentMonth,
}: {
  year: number;
  monthIndex: number;
  monthlyRecord: Record<string, number>;
  isCurrentMonth: boolean;
}) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="rounded-2xl p-3"
      style={{ background: THEME.bgPanel, border: `1px solid ${isCurrentMonth ? THEME.gold : THEME.border}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: THEME.cream }}>
          {MONTH_NAMES[monthIndex]}
        </span>
        {isCurrentMonth && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ background: THEME.gold, color: THEME.deep }}
          >
            NOW
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-[3px] mb-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={`${w}-${i}`} className="text-[8px] text-center font-mono" style={{ color: THEME.creamMuted }}>
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`b-${idx}`} />;
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const score = monthlyRecord[dateStr] || 0;
          const bg = colorForScore(score);
          const textDark = score >= 50;
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${score}% completed`}
              className="aspect-square rounded-[4px] flex items-center justify-center"
              style={{ background: bg }}
            >
              <span className="text-[7px] font-mono" style={{ color: textDark ? THEME.deep : THEME.creamMuted }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SunnahHabits() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [monthlyRecord, setMonthlyRecord] = useState<Record<string, number>>({});

  useEffect(() => {
    const today = todayKey();
    setCompleted(readJSON(KEYS.daily(today), {}));
    setStreak(parseInt(localStorage.getItem(KEYS.streak) || '0', 10));
    setMonthlyRecord(readJSON(KEYS.monthly, {}));
  }, []);

  const toggleHabit = useCallback(
    (id: string) => {
      const today = todayKey();
      const updated = { ...completed, [id]: !completed[id] };
      setCompleted(updated);
      writeJSON(KEYS.daily(today), updated);

      const completedCount = Object.values(updated).filter(Boolean).length;
      const progressPercent = Math.round((completedCount / SUNNAH_HABITS.length) * 100);

      const updatedMonthly = { ...monthlyRecord, [today]: progressPercent };
      setMonthlyRecord(updatedMonthly);
      writeJSON(KEYS.monthly, updatedMonthly);

      if (progressPercent >= STREAK_THRESHOLD) {
        const lastStreakDate = localStorage.getItem(KEYS.lastStreakDate);
        if (lastStreakDate !== today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem(KEYS.streak, String(newStreak));
          localStorage.setItem(KEYS.lastStreakDate, today);
        }
      }
    },
    [completed, monthlyRecord, streak]
  );

  const progressPercent = useMemo(() => {
    const completedCount = Object.values(completed).filter(Boolean).length;
    return Math.round((completedCount / SUNNAH_HABITS.length) * 100);
  }, [completed]);

  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: THEME.bgPage }}>
      <div className="py-14 text-center relative overflow-hidden" style={{ background: THEME.bgHero, borderBottom: `1px solid ${THEME.border}` }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-xs tracking-[.25em] uppercase mb-3" style={{ color: THEME.gold }}>
            Daily Practice
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-3" style={{ color: THEME.cream }}>
            Sunnah & Daily Habits
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: THEME.creamMuted }}>
            Track your daily acts of worship & Sunnahs, one habit at a time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: THEME.creamMuted }}>
              Today's Progress
            </p>
            <p className="font-display text-2xl font-semibold mt-1" style={{ color: THEME.cream }}>
              {progressPercent}%
            </p>
            <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: THEME.bgTrack }}>
              <div className="h-full transition-all" style={{ width: `${progressPercent}%`, background: THEME.gold }} />
            </div>
          </div>
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg,${THEME.bgPanel},${THEME.bgPanelAlt})`, border: `1px solid ${THEME.goldSoft}` }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,189,75,.10)' }}>
              <Flame size={18} style={{ color: THEME.gold }} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: THEME.creamMuted }}>
                Current streak
              </p>
              <p className="font-display text-2xl font-semibold mt-1" style={{ color: THEME.gold }}>
                {streak} day{streak === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUNNAH_HABITS.map((habit) => {
              const checked = !!completed[habit.id];
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  aria-pressed={checked}
                  className="w-full text-left rounded-xl p-3 flex items-center justify-between transition-colors hover:bg-white/5"
                  style={{ border: `1px solid ${THEME.borderSoft}`, background: checked ? 'rgba(232,189,75,.06)' : 'transparent' }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center border flex-shrink-0"
                      style={{ background: checked ? THEME.gold : 'transparent', borderColor: checked ? THEME.gold : THEME.creamMuted }}
                    >
                      {checked && (
                        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill={THEME.deep}>
                          <path d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z" />
                        </svg>
                      )}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: checked ? THEME.creamMuted : THEME.cream, textDecoration: checked ? 'line-through' : 'none' }}
                    >
                      {habit.title}
                    </span>
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ml-2"
                    style={{ borderColor: THEME.border, color: THEME.creamMuted }}
                  >
                    {habit.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold" style={{ color: THEME.cream }}>
              {year} Activity Calendar
            </h2>
            <div className="flex items-center gap-1.5 text-[9px]" style={{ color: THEME.creamMuted }}>
              <span>Less</span>
              {[THEME.bgPanelAlt, THEME.goldDim, THEME.goldMid, THEME.gold].map((c) => (
                <span key={c} className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
              ))}
              <span>More</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MONTH_NAMES.map((_, monthIndex) => (
              <MonthGrid key={monthIndex} year={year} monthIndex={monthIndex} monthlyRecord={monthlyRecord} isCurrentMonth={monthIndex === currentMonth} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
