import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * SunnahHabitsTracker
 * A daily habit tracker for Sunnah & Islamic daily practices.
 * Theme: dark forest green + gold, matching the Zakat calculator design.
 * Persists data in localStorage and displays a full-year calendar heatmap.
 */

// ---------------------------------------------------------------------------
// Theme colors
// ---------------------------------------------------------------------------
const THEME = {
  bgOuter: '#0b2419',
  bgPanel: '#123321',
  bgPanelAlt: '#173a28',
  border: '#c9a227',
  borderSoft: 'rgba(201,162,39,0.35)',
  gold: '#c9a227',
  goldBright: '#e8c14a',
  goldDim: '#8a6a1f',
  cream: '#e7ede7',
  creamMuted: '#9db3a4',
};

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const SUNNAH_HABITS = [
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
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_LABELS = ['S','M','T','W','T','F','S'];

const STORAGE_KEYS = {
  dailyHabits: (dateKey) => `noor_habits_${dateKey}`,
  streak: 'noor_user_streak',
  lastStreakDate: 'noor_last_streak_date',
  monthlyRecords: 'noor_monthly_records',
};

// ---------------------------------------------------------------------------
// Small localStorage helpers (defensive against corrupted / missing data)
// ---------------------------------------------------------------------------
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to write localStorage key "${key}":`, err);
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Presentational sub-components
// ---------------------------------------------------------------------------
function StreakBadge({ streak }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl border"
      style={{ backgroundColor: THEME.bgPanelAlt, borderColor: THEME.borderSoft }}
    >
      <span className="text-2xl" aria-hidden="true">🔥</span>
      <div>
        <div className="text-xs font-semibold tracking-wide" style={{ color: THEME.gold }}>
          STREAK
        </div>
        <div className="text-lg font-bold" style={{ color: THEME.cream }}>
          {streak} {streak === 1 ? 'Day' : 'Days'}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="mb-6">
      <div
        className="flex justify-between text-sm font-semibold mb-1"
        style={{ color: THEME.creamMuted }}
      >
        <span>Today's Progress</span>
        <span style={{ color: THEME.gold }}>{percent}%</span>
      </div>
      <div
        className="w-full rounded-full h-3 overflow-hidden"
        style={{ backgroundColor: THEME.bgOuter }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: THEME.gold }}
        />
      </div>
    </div>
  );
}

function HabitItem({ habit, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(habit.id)}
      aria-pressed={checked}
      className="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between focus:outline-none"
      style={{
        backgroundColor: checked ? THEME.bgPanelAlt : THEME.bgPanel,
        borderColor: checked ? THEME.gold : THEME.borderSoft,
      }}
    >
      <span className="flex items-center gap-3">
        <span
          className="w-5 h-5 rounded flex items-center justify-center border flex-shrink-0"
          style={{
            backgroundColor: checked ? THEME.gold : 'transparent',
            borderColor: checked ? THEME.gold : THEME.creamMuted,
          }}
        >
          {checked && (
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill={THEME.bgOuter}>
              <path d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.6 3.6 6.7-6.7a1 1 0 011.4 0z" />
            </svg>
          )}
        </span>
        <span
          className="text-sm font-medium"
          style={{
            color: checked ? THEME.creamMuted : THEME.cream,
            textDecoration: checked ? 'line-through' : 'none',
          }}
        >
          {habit.title}
        </span>
      </span>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ml-2"
        style={{ backgroundColor: THEME.bgOuter, borderColor: THEME.borderSoft, color: THEME.creamMuted }}
      >
        {habit.category}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Full-year calendar heatmap (replaces the old 30-day strip)
// ---------------------------------------------------------------------------
function colorForScore(score) {
  if (score >= 80) return THEME.goldBright;
  if (score >= 50) return THEME.gold;
  if (score > 0) return THEME.goldDim;
  return THEME.bgPanelAlt;
}

function MonthGrid({ year, monthIndex, monthlyRecord, isCurrentMonth }) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        backgroundColor: THEME.bgPanel,
        borderColor: isCurrentMonth ? THEME.gold : THEME.borderSoft,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-wide" style={{ color: THEME.cream }}>
          {MONTH_NAMES[monthIndex]}
        </span>
        {isCurrentMonth && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: THEME.gold, color: THEME.bgOuter }}
          >
            NOW
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-[3px] mb-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-[8px] text-center font-mono"
            style={{ color: THEME.creamMuted }}
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} />;
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const score = monthlyRecord[dateStr] || 0;
          const bg = colorForScore(score);
          const textDark = score >= 50;

          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${score}% completed`}
              className="aspect-square rounded-[4px] flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <span
                className="text-[7px] font-mono"
                style={{ color: textDark ? THEME.bgOuter : THEME.creamMuted }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearCalendar({ monthlyRecord }) {
  const today = new Date();
  const year = today.getFullYear();
  const currentMonth = today.getMonth();

  return (
    <div className="border-t pt-4" style={{ borderColor: THEME.borderSoft }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold" style={{ color: THEME.cream }}>
          {year} Activity Calendar
        </h3>
        <div className="flex items-center gap-1.5 text-[9px]" style={{ color: THEME.creamMuted }}>
          <span>Less</span>
          {[THEME.bgPanelAlt, THEME.goldDim, THEME.gold, THEME.goldBright].map((c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {MONTH_NAMES.map((_, monthIndex) => (
          <MonthGrid
            key={monthIndex}
            year={year}
            monthIndex={monthIndex}
            monthlyRecord={monthlyRecord}
            isCurrentMonth={monthIndex === currentMonth}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SunnahHabitsTracker() {
  const [completed, setCompleted] = useState({});
  const [streak, setStreak] = useState(0);
  const [monthlyRecord, setMonthlyRecord] = useState({});

  useEffect(() => {
    const today = getTodayKey();
    setCompleted(readJSON(STORAGE_KEYS.dailyHabits(today), {}));
    setStreak(parseInt(localStorage.getItem(STORAGE_KEYS.streak) || '0', 10));
    setMonthlyRecord(readJSON(STORAGE_KEYS.monthlyRecords, {}));
  }, []);

  const toggleHabit = useCallback(
    (id) => {
      const today = getTodayKey();
      const updated = { ...completed, [id]: !completed[id] };
      setCompleted(updated);
      writeJSON(STORAGE_KEYS.dailyHabits(today), updated);

      const completedCount = Object.values(updated).filter(Boolean).length;
      const progressPercent = Math.round((completedCount / SUNNAH_HABITS.length) * 100);

      const updatedMonthly = { ...monthlyRecord, [today]: progressPercent };
      setMonthlyRecord(updatedMonthly);
      writeJSON(STORAGE_KEYS.monthlyRecords, updatedMonthly);

      if (progressPercent >= STREAK_THRESHOLD) {
        const lastStreakDate = localStorage.getItem(STORAGE_KEYS.lastStreakDate);
        if (lastStreakDate !== today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem(STORAGE_KEYS.streak, String(newStreak));
          localStorage.setItem(STORAGE_KEYS.lastStreakDate, today);
        }
      }
    },
    [completed, monthlyRecord, streak]
  );

  const progressPercent = useMemo(() => {
    const completedCount = Object.values(completed).filter(Boolean).length;
    return Math.round((completedCount / SUNNAH_HABITS.length) * 100);
  }, [completed]);

  return (
    <div
      className="max-w-4xl mx-auto p-6 rounded-2xl shadow-lg border my-6"
      style={{ backgroundColor: THEME.bgOuter, borderColor: THEME.borderSoft }}
    >
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif" style={{ color: THEME.cream }}>
            Sunnah &amp; Daily Habits
          </h2>
          <p className="text-xs" style={{ color: THEME.creamMuted }}>
            Track your daily acts of worship &amp; Sunnahs
          </p>
        </div>
        <StreakBadge streak={streak} />
      </header>

      <ProgressBar percent={progressPercent} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {SUNNAH_HABITS.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            checked={!!completed[habit.id]}
            onToggle={toggleHabit}
          />
        ))}
      </div>

      <YearCalendar monthlyRecord={monthlyRecord} />
    </div>
  );
}
