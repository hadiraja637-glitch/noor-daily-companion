import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Minus, Plus, Target, Sparkles, Flame } from 'lucide-react';

const DHIKRS = [
  { name: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah', target: 33 },
  { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'All praise is for Allah', target: 33 },
  { name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest', target: 33 },
  { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'There is no deity except Allah', target: 100 },
  { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek forgiveness from Allah', target: 100 },
  { name: 'La hawla wa la quwwata illallah', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', meaning: 'There is no power nor strength except by Allah', target: 33 },
  { name: 'Salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', meaning: 'Send blessings upon Muhammad ﷺ', target: 100 },
];

export default function Tasbeeh() {
  const [selected, setSelected] = useState(() => localStorage.getItem('noor-tasbeeh-name') || DHIKRS[0].name);
  const [count, setCount] = useState(() => Number(localStorage.getItem('noor-tasbeeh-count') || 0));
  const [completed, setCompleted] = useState(() => Number(localStorage.getItem('noor-tasbeeh-completed-days') || 0));
  const item = useMemo(() => DHIKRS.find((d) => d.name === selected) ?? DHIKRS[0], [selected]);
  const progress = Math.min(count / item.target, 1);

  useEffect(() => {
    localStorage.setItem('noor-tasbeeh-count', String(count));
    localStorage.setItem('noor-tasbeeh-name', selected);
    if (count >= item.target && Number(localStorage.getItem('noor-tasbeeh-last-complete') || 0) !== new Date().setHours(0, 0, 0, 0)) {
      const next = completed + 1;
      localStorage.setItem('noor-tasbeeh-last-complete', String(new Date().setHours(0, 0, 0, 0)));
      localStorage.setItem('noor-tasbeeh-completed-days', String(next));
      setCompleted(next);
    }
  }, [count, selected, item.target, completed]);

  function reset() { setCount(0); }
  function add(step = 1) { setCount((v) => v + step); }

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#061812' }}>
      <div className="py-12 mb-8 text-center relative overflow-hidden" style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative px-4">
          <p className="text-noor-gold text-[10px] tracking-[.28em] uppercase mb-2">Quiet moments • constant remembrance</p>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Tasbeeh &amp; Dhikr</h1>
          <p className="text-noor-muted text-sm">Keep your heart connected to Allah throughout the day.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-6">
          <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#103329,#0b2921)', border: '1px solid rgba(26,64,53,0.7)' }}>
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-noor-gold/5 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7 relative">
              <div>
                <p className="text-noor-muted text-xs mb-1">Selected Dhikr</p>
                <h2 className="font-display text-noor-ivory text-2xl font-semibold">{item.name}</h2>
              </div>
              <button onClick={reset} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-noor-gold border border-noor-gold/30 hover:bg-noor-gold/10"><RotateCcw size={13} /> Reset</button>
            </div>

            <div className="text-center rounded-3xl p-7 sm:p-10 relative" style={{ background: 'rgba(6,24,18,0.58)', border: '1px solid rgba(26,64,53,0.5)' }}>
              <div className="mx-auto mb-5 w-24 h-24 rounded-full p-1" style={{ background: `conic-gradient(#E8BD4B ${progress * 360}deg, rgba(26,64,53,.65) 0deg)` }}>
                <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: '#0a241c' }}><Sparkles size={19} className="text-noor-gold" /></div>
              </div>
              <p className="font-arabic text-noor-gold text-3xl sm:text-4xl leading-loose mb-2" style={{ direction: 'rtl', fontFamily: 'Amiri, serif' }}>{item.arabic}</p>
              <p className="text-noor-muted text-sm mb-7">{item.meaning}</p>
              <div className="flex items-center justify-center gap-6">
                <button aria-label="Decrease count" onClick={() => setCount((v) => Math.max(0, v - 1))} className="w-12 h-12 rounded-full border border-noor-border text-noor-muted hover:text-noor-gold hover:border-noor-gold/40"><Minus size={18} className="mx-auto" /></button>
                <div className="min-w-[150px]"><p className="font-display text-noor-gold text-6xl font-bold tabular-nums">{count}</p><p className="text-noor-muted text-xs mt-1">Target {item.target}</p></div>
                <button aria-label="Increase count" onClick={() => add(1)} className="w-12 h-12 rounded-full flex items-center justify-center text-noor-deep" style={{ background: '#E8BD4B' }}><Plus size={20} /></button>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-7">
                {[1, 10, 33, item.target].map((value) => <button key={value} onClick={() => add(value)} className="py-2.5 rounded-xl text-xs font-semibold border border-noor-border text-noor-muted hover:text-noor-gold hover:border-noor-gold/40 transition-colors">+{value}</button>)}
              </div>
              <div className="mt-7">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,64,53,0.7)' }}><div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg,#18B98A,#E8BD4B)' }} /></div>
                <div className="flex justify-between text-[11px] mt-2"><span className="text-noor-muted">{Math.round(progress * 100)}% complete</span><span className="text-noor-gold">{Math.max(0, item.target - count)} remaining</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
            <div className="flex items-center justify-between gap-3 mb-4"><div className="flex items-center gap-2"><Target size={15} className="text-noor-gold" /><h3 className="font-display text-noor-ivory text-xl font-semibold">Choose a Dhikr</h3></div><div className="flex items-center gap-1 text-[10px] text-noor-muted"><Flame size={12} className="text-noor-gold" /> {completed} goals</div></div>
            <p className="text-noor-muted text-xs mb-4">Choose one and make a little room for remembrance.</p>
            <div className="space-y-2">
              {DHIKRS.map((d) => (
                <button key={d.name} onClick={() => { setSelected(d.name); setCount(0); }} className="w-full text-left rounded-xl p-3 transition-all hover:-translate-y-0.5" style={{ background: selected === d.name ? 'rgba(232,189,75,0.12)' : 'rgba(6,24,18,0.35)', border: selected === d.name ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.5)' }}>
                  <div className="flex items-center justify-between gap-3"><div><p className="text-noor-ivory text-sm font-medium">{d.name}</p><p className="font-arabic text-noor-gold text-base mt-1" style={{ direction: 'rtl', fontFamily: 'Amiri, serif' }}>{d.arabic}</p></div><span className="text-noor-muted text-[10px] whitespace-nowrap">{d.target}</span></div>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(232,189,75,.09),rgba(24,185,138,.05))', border: '1px solid rgba(232,189,75,.16)' }}>
              <p className="text-noor-gold text-xs font-semibold mb-1">A gentle reminder</p>
              <p className="text-noor-muted text-xs leading-relaxed">Consistency is the beauty of a small habit. Come back tomorrow and keep the light going.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
