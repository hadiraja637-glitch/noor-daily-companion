import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react';

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
const WEEKDAY_LABELS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

const KEYS = {
  daily: (dateKey: string) => `noor_habits_${dateKey}`,
  streak: 'noor_user_streak',
  lastStreakDate: 'noor_last_streak_date',
  monthly: 'noor_monthly_records',
  totalAchieved: 'noor_total_achieved_days',
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
    /* ignore */
  }
}

function todayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get past 7 days keys and labels for the modern recent view
function getRecentDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayLabel = WEEKDAY_LABELS[d.getDay()];
    days.push({ dateStr, dayLabel, dayNum: d.getDate() });
  }
  return days;
}

export default function SunnahHabits() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [monthlyRecord, setMonthlyRecord] = useState<Record<string, number>>({});
  const [totalAchieved, setTotalAchieved] = useState(0);

  const recentDays = useMemo(() => getRecentDays(), []);

  useEffect(() => {
    const today = todayKey();
    setCompleted(readJSON(KEYS.daily(today), {}));
    setStreak(parseInt(localStorage.getItem(KEYS.streak) || '0', 10));
    setMonthlyRecord(readJSON(KEYS.monthly, {}));
    setTotalAchieved(parseInt(localStorage.getItem(KEYS.totalAchieved) || '0', 10));
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

      // Check if today crossed threshold for the first time today
      if (progressPercent >= STREAK_THRESHOLD) {
        const lastStreakDate = localStorage.getItem(KEYS.lastStreakDate);
        if (lastStreakDate !== today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem(KEYS.streak, String(newStreak));
          localStorage.setItem(KEYS.lastStreakDate, today);

          const newTotal = totalAchieved + 1;
          setTotalAchieved(newTotal);
          localStorage.setItem(KEYS.totalAchieved, String(newTotal));
        }
      }
    },
    [completed, monthlyRecord, streak, totalAchieved]
  );

  const progressPercent = useMemo(() => {
    const completedCount = Object.values(completed).filter(Boolean).length;
    return Math.round((completedCount / SUNNAH_HABITS.length) * 100);
  }, [completed]);

  // Badge progress calculation (Target: e.g. 30 days milestone)
  const badgeTarget = 30;
  const badgeProgress = Math.min(totalAchieved, badgeTarget);
  const badgePercent = Math.round((badgeProgress / badgeTarget) * 100);

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: THEME.bgPage }}>
      {/* Header */}
      <div className="py-12 text-center relative overflow-hidden" style={{ background: THEME.bgHero, borderBottom: `1px solid ${THEME.border}` }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-xs tracking-[.25em] uppercase mb-2" style={{ color: THEME.gold }}>
            Daily Practice
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ color: THEME.cream }}>
            Sunnah & Daily Habits
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: THEME.creamMuted }}>
            Build consistent acts of worship with a clean, peaceful daily routine.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Top Stats Cards: Today Progress & Streak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
            <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: THEME.creamMuted }}>
              Today's Progress
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-semibold" style={{ color: THEME.cream }}>
                {progressPercent}%
              </p>
              <span className="text-xs" style={{ color: progressPercent >= 70 ? THEME.gold : THEME.creamMuted }}>
                {progressPercent >= 70 ? 'Target Met ✨' : 'Keep Going'}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: THEME.bgTrack }}>
              <div className="h-full transition-all duration-300" style={{ width: `${progressPercent}%`, background: THEME.gold }} />
            </div>
          </div>

          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg,${THEME.bgPanel},${THEME.bgPanelAlt})`, border: `1px solid ${THEME.goldSoft}` }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,189,75,.12)' }}>
              <Flame size={22} style={{ color: THEME.gold }} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: THEME.creamMuted }}>
                Current Streak
              </p>
              <p className="text-2xl font-semibold mt-0.5" style={{ color: THEME.gold }}>
                {streak} day{streak === 1 ? '' : 's'} 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Modern Recent Days & Milestone Bar (Inspired by your reference) */}
        <div className="rounded-2xl p-5 mb-6 shadow-lg" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold tracking-wider uppercase" style={{ color: THEME.gold }}>
              Recent Days & Milestones
            </h3>
            <span className="text-[10px]" style={{ color: THEME.creamMuted }}>
              Tap habits below to log today
            </span>
          </div>

          {/* Recent 7 Days Squares */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {recentDays.map((d) => {
              const score = monthlyRecord[d.dateStr] || 0;
              const isToday = d.dateStr === todayKey();
              const isCompletedGood = score >= 70;
              
              let bgCol = THEME.bgTrack;
              let textCol = THEME.creamMuted;
              if (score >= 80) { bgCol = THEME.gold; textCol = THEME.deep; }
              else if (score >= 40) { bgCol = THEME.goldMid; textCol = THEME.deep; }
              else if (score > 0) { bgCol = THEME.goldDim; textCol = THEME.cream; }

              return (
                <div
                  key={d.dateStr}
                  className="flex flex-col items-center justify-center p-2 rounded-xl transition-all"
                  style={{ 
                    background: isToday ? THEME.bgPanelAlt : 'transparent',
                    border: isToday ? `1px solid ${THEME.gold}` : `1px solid ${THEME.borderSoft}`
                  }}
                >
                  <span className="text-[10px] font-medium mb-1" style={{ color: isToday ? THEME.gold : THEME.creamMuted }}>
                    {d.dayLabel}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shadow-sm"
                    style={{ background: bgCol, color: textCol }}
                    title={`${d.dateStr}: ${score}%`}
                  >
                    {isCompletedGood ? <CheckCircle2 size={14} /> : d.dayNum}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone Progress Bar */}
          <div className="pt-4 border-t" style={{ borderColor: THEME.borderSoft }}>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg" style={{ background: 'rgba(232,189,75,.1)', color: THEME.gold }}>
                  <Trophy size={16} />
                </span>
                <span className="font-semibold" style={{ color: THEME.cream }}>
                  {totalAchieved} Total Days Achieved
                </span>
              </div>
              <span className="font-mono text-[11px]" style={{ color: THEME.gold }}>
                {badgeProgress} of {badgeTarget} days
              </span>
            </div>

            {/* Custom Sleek Progress Bar */}
            <div className="h-3 rounded-full overflow-hidden p-0.5 relative" style={{ background: THEME.bgTrack, border: `1px solid ${THEME.border}` }}>
              <div
                className="h-full rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${badgePercent}%`, background: `linear-gradient(90deg, ${THEME.goldMid}, ${THEME.gold})` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px]" style={{ color: THEME.creamMuted }}>
                Current Badge Progress (Consistent Habit Seeker)
              </span>
              <span className="text-[10px] font-semibold" style={{ color: THEME.cream }}>
                0 Badges Earned
              </span>
            </div>
          </div>
        </div>

        {/* Habit Checklist */}
        <div className="rounded-2xl p-5" style={{ background: THEME.bgPanel, border: `1px solid ${THEME.border}` }}>
          <h3 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: THEME.gold }}>
            Today's Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUNNAH_HABITS.map((habit) => {
              const checked = !!completed[habit.id];
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  aria-pressed={checked}
                  className="w-full text-left rounded-xl p-3 flex items-center justify-between transition-all hover:translate-y-[-1px]"
                  style={{
                    border: `1px solid ${checked ? THEME.goldSoft : THEME.borderSoft}`,
                    background: checked ? 'rgba(232,189,75,.05)' : 'transparent',
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-colors"
                      style={{
                        background: checked ? THEME.gold : 'transparent',
                        borderColor: checked ? THEME.gold : THEME.creamMuted,
                      }}
                    >
                      {checked && (
                        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill={THEME.deep}>
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
                    style={{ borderColor: THEME.border, color: THEME.creamMuted }}
                  >
                    {habit.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
