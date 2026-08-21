import { CheckCircle2, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { JOURNEY_STEPS, dateKey, getJourneyDayNumber, getJourneyStreak, markJourneyComplete, readJourneyHistory } from '../data/journey';

export default function Journey() {
  const [checked, setChecked] = useState<boolean[]>(JOURNEY_STEPS.map(() => false));
  const [history, setHistory] = useState(readJourneyHistory);
  const done = checked.filter(Boolean).length;
  const allDone = done === JOURNEY_STEPS.length;
  const today = dateKey();
  const streak = getJourneyStreak();
  const dayNumber = getJourneyDayNumber();

  useEffect(() => {
    const saved = localStorage.getItem(`noor-journey-${today}`);
    if (saved) {
      try {
        const values = JSON.parse(saved);
        if (Array.isArray(values)) setChecked(values.map(Boolean).slice(0, JOURNEY_STEPS.length));
      } catch { /* ignore malformed local data */ }
    }
    const sync = () => setHistory(readJourneyHistory());
    window.addEventListener('noor-journey-updated', sync);
    return () => window.removeEventListener('noor-journey-updated', sync);
  }, [today]);

  useEffect(() => {
    localStorage.setItem(`noor-journey-${today}`, JSON.stringify(checked));
    if (allDone && !history[today]) {
      markJourneyComplete();
      setHistory(readJourneyHistory());
    }
  }, [checked, allDone, today, history]);

  const status = useMemo(() => {
    if (allDone) return 'Day complete — MashaAllah! Come back tomorrow for the next step.';
    if (done === 0) return 'Begin with one sincere action today.';
    return `${JOURNEY_STEPS.length - done} small step${JOURNEY_STEPS.length - done === 1 ? '' : 's'} left for today.`;
  }, [allDone, done]);

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: '#061812' }}>
      <div className="py-14 text-center relative overflow-hidden" style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,.5)' }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-noor-gold text-xs tracking-[.25em] uppercase mb-3">Your Better Tomorrow</p>
          <h1 className="font-display text-noor-ivory text-4xl sm:text-5xl font-semibold mb-3">Small steps. A beautiful hereafter.</h1>
          <p className="text-noor-muted max-w-2xl mx-auto">A simple daily journey you can return to, one sincere step at a time.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-2xl p-4" style={{ background: '#103329', border: '1px solid rgba(26,64,53,.7)' }}><p className="text-noor-muted text-[10px] uppercase tracking-wider">Journey</p><p className="font-display text-noor-gold text-2xl font-semibold mt-1">Day {dayNumber}</p></div>
          <div className="rounded-2xl p-4" style={{ background: '#103329', border: '1px solid rgba(26,64,53,.7)' }}><p className="text-noor-muted text-[10px] uppercase tracking-wider">Completed days</p><p className="font-display text-noor-ivory text-2xl font-semibold mt-1">{Object.values(history).filter(Boolean).length}</p></div>
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#103329,#173f32)', border: '1px solid rgba(232,189,75,.22)' }}><div className="w-10 h-10 rounded-full flex items-center justify-center bg-noor-gold/10"><Flame size={18} className="text-noor-gold" /></div><div><p className="text-noor-muted text-[10px] uppercase tracking-wider">Current streak</p><p className="font-display text-noor-gold text-2xl font-semibold mt-1">{streak} day{streak === 1 ? '' : 's'}</p></div></div>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: '#103329', border: '1px solid rgba(26,64,53,.7)' }}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div><div className="flex items-center gap-2"><Sparkles size={15} className="text-noor-gold" /><h2 className="font-display text-noor-ivory text-2xl font-semibold">Today’s Noor Journey</h2></div><p className="text-noor-muted text-sm mt-1">{done} of {JOURNEY_STEPS.length} steps complete · {status}</p></div>
            <span className="hidden sm:inline-flex rounded-full px-4 py-2 text-xs font-semibold" style={{ background: allDone ? 'rgba(24,185,138,.14)' : 'rgba(232,189,75,.12)', color: allDone ? '#18B98A' : '#E8BD4B', border: `1px solid ${allDone ? 'rgba(24,185,138,.25)' : 'rgba(232,189,75,.25)'}` }}>{allDone ? 'Day Complete ✓' : `Day ${dayNumber}`}</span>
          </div>
          <div className="h-2 rounded-full bg-noor-bg overflow-hidden mb-6"><div className="h-full bg-noor-accent transition-all" style={{ width: `${(done / JOURNEY_STEPS.length) * 100}%` }} /></div>
          <div className="space-y-3">
            {JOURNEY_STEPS.map(([title, text], i) => <button key={title} onClick={() => setChecked((v) => v.map((x, j) => j === i ? !x : x))} className="w-full text-left rounded-xl p-4 flex items-start gap-4 hover:bg-white/5 transition-colors" style={{ border: '1px solid rgba(26,64,53,.55)', background: checked[i] ? 'rgba(24,185,138,.05)' : 'transparent' }}>
              <CheckCircle2 size={20} className={checked[i] ? 'text-noor-gold' : 'text-noor-muted'} />
              <span><span className="block text-noor-ivory font-medium">{title}</span><span className="block text-noor-muted text-sm mt-1">{text}</span></span>
            </button>)}
          </div>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-noor-gold hover:underline">Back to Noor Home <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
}
