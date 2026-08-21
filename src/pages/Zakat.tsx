import { useMemo, useState } from 'react';
import { DollarSign, RotateCcw } from 'lucide-react';

const GOLD_NISAB = 85; // grams
const GOLD_PRICE_PER_GRAM = 95; // USD demo rate; replace with a trusted live rate later
const SILVER_PRICE_PER_GRAM = 0.8; // USD demo rate; replace later
const ZAKAT_RATE = 0.025;

interface Assets {
  cash: string;
  gold: string;
  silver: string;
  investments: string;
  business: string;
  debts: string;
}

const initialAssets: Assets = { cash: '', gold: '', silver: '', investments: '', business: '', debts: '' };

export default function Zakat() {
  const [assets, setAssets] = useState<Assets>(initialAssets);
  const setField = (field: keyof Assets) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setAssets((current) => ({ ...current, [field]: next }));
  };
  const parse = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const result = useMemo(() => {
    const cash = parse(assets.cash);
    const gold = parse(assets.gold) * GOLD_PRICE_PER_GRAM;
    const silver = parse(assets.silver) * SILVER_PRICE_PER_GRAM;
    const investments = parse(assets.investments);
    const business = parse(assets.business);
    const debts = parse(assets.debts);
    const totalAssets = cash + gold + silver + investments + business;
    const zakatable = Math.max(0, totalAssets - debts);
    const nisabValue = GOLD_NISAB * GOLD_PRICE_PER_GRAM;
    const eligible = zakatable >= nisabValue;
    return { zakatable, nisabValue, eligible, zakatAmount: eligible ? zakatable * ZAKAT_RATE : 0 };
  }, [assets]);

  const Field = ({ label, field, unit = '$' }: { label: string; field: keyof Assets; unit?: string }) => (
    <div>
      <label htmlFor={`zakat-${field}`} className="text-noor-muted text-xs mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#072018', border: '1px solid rgba(26,64,53,0.7)' }}>
        <span className="text-noor-muted text-sm shrink-0">{unit}</span>
        <input
          id={`zakat-${field}`}
          name={field}
          type="number"
          min="0"
          step="any"
          value={assets[field]}
          onChange={setField(field)}
          placeholder="0"
          inputMode="decimal"
          className="flex-1 bg-transparent text-noor-ivory text-sm outline-none min-w-0"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div className="py-12 mb-8 text-center relative overflow-hidden" style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Zakat Calculator</h1>
          <p className="text-noor-muted text-sm">Calculate your annual Zakat obligation</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="rounded-2xl p-6 mb-5" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-noor-ivory font-semibold text-xl">Your Assets</h2>
            <button type="button" onClick={() => setAssets(initialAssets)} className="inline-flex items-center gap-1.5 text-xs text-noor-muted hover:text-noor-gold"><RotateCcw size={13}/> Reset</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Cash & Bank Balance" field="cash" />
            <Field label="Gold (grams)" field="gold" unit="g" />
            <Field label="Silver (grams)" field="silver" unit="g" />
            <Field label="Investments & Stocks" field="investments" />
            <Field label="Business Assets" field="business" />
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-5" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
          <h2 className="font-display text-noor-ivory font-semibold text-xl mb-4">Your Debts</h2>
          <Field label="Outstanding Debts" field="debts" />
        </div>

        <div className="rounded-2xl p-6" style={{ background: result.eligible ? 'rgba(232,189,75,0.08)' : '#103329', border: result.eligible ? '1px solid rgba(232,189,75,0.3)' : '1px solid rgba(26,64,53,0.6)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: result.eligible ? 'rgba(232,189,75,0.15)' : 'rgba(26,64,53,0.5)' }}>
              <DollarSign size={18} className={result.eligible ? 'text-noor-gold' : 'text-noor-muted'} />
            </div>
            <div>
              <h3 className="font-display text-noor-ivory font-semibold text-lg">Zakat Result</h3>
              <p className="text-noor-muted text-xs">Nisab threshold: ~${result.nisabValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl p-3" style={{ background: 'rgba(6,24,18,0.4)' }}><p className="text-noor-muted text-xs mb-1">Zakatable Wealth</p><p className="font-display text-noor-ivory text-xl font-bold">${result.zakatable.toLocaleString('en', { maximumFractionDigits: 2 })}</p></div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(6,24,18,0.4)' }}><p className="text-noor-muted text-xs mb-1">Zakat Eligible?</p><p className={`font-display text-xl font-bold ${result.eligible ? 'text-noor-gold' : 'text-noor-muted'}`}>{result.eligible ? 'Yes' : 'No'}</p></div>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(6,24,18,0.4)' }}>
            <p className="text-noor-muted text-sm mb-1">Estimated Zakat Due (2.5%)</p>
            <p className={`font-display text-3xl font-bold ${result.eligible ? 'text-noor-gold' : 'text-noor-muted'}`}>${result.zakatAmount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          {result.eligible && <p className="text-noor-muted text-xs text-center mt-3">May Allah accept your Zakat and multiply your blessings. 🤲</p>}
        </div>

        <p className="text-noor-muted text-xs text-center mt-4 leading-relaxed">Gold and silver prices in this demo are approximate. Replace them with a trusted live price source before using this as a real financial tool. Consult a qualified scholar for personal Zakat rulings.</p>
      </div>
    </div>
  );
}
