import { useState } from 'react';
import { Calculator, RotateCcw, CheckCircle2 } from 'lucide-react';

type CurrencyCode = 'PKR' | 'USD' | 'SAR' | 'AED' | 'GBP';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  goldPerGram: number;
  silverPerGram: number;
}

interface Assets {
  cash: string;
  gold: string;
  silver: string;
  investments: string;
  business: string;
  debts: string;
}

const CURRENCIES: Currency[] = [
  // Approximate reference rates; update these when current local bullion rates change.
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', goldPerGram: 40900, silverPerGram: 605 },
  { code: 'USD', symbol: '$', name: 'US Dollar', goldPerGram: 146, silverPerGram: 2.15 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', goldPerGram: 547, silverPerGram: 8.06 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', goldPerGram: 535, silverPerGram: 7.89 },
  { code: 'GBP', symbol: '£', name: 'British Pound', goldPerGram: 109, silverPerGram: 1.60 },
];

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;

const initialAssets: Assets = {
  cash: '',
  gold: '',
  silver: '',
  investments: '',
  business: '',
  debts: '',
};

function parseNumber(value: string) {
  const cleaned = value.replace(/,/g, '').trim();
  const number = Number(cleaned);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function formatMoney(value: number, currency: Currency) {
  return `${currency.symbol} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function Zakat() {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('PKR');
  const [assets, setAssets] = useState<Assets>(initialAssets);
  const [submitted, setSubmitted] = useState(false);

  const currency =
    CURRENCIES.find((item) => item.code === currencyCode) ?? CURRENCIES[0];

  const setField =
    (field: keyof Assets) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAssets((current) => ({
        ...current,
        [field]: e.target.value,
      }));
      setSubmitted(false);
    };

  const calculate = () => {
    const cash = parseNumber(assets.cash);
    const goldGrams = parseNumber(assets.gold);
    const silverGrams = parseNumber(assets.silver);
    const investments = parseNumber(assets.investments);
    const business = parseNumber(assets.business);
    const debts = parseNumber(assets.debts);

    const goldValue = goldGrams * currency.goldPerGram;
    const silverValue = silverGrams * currency.silverPerGram;

    const totalAssets =
      cash + goldValue + silverValue + investments + business;

    const zakatableWealth = Math.max(0, totalAssets - debts);

    const goldNisabValue =
      GOLD_NISAB_GRAMS * currency.goldPerGram;
    const silverNisabValue =
      SILVER_NISAB_GRAMS * currency.silverPerGram;

    // The calculator shows both commonly used Nisab references.
    const eligibleByGold = zakatableWealth >= goldNisabValue;
    const eligibleBySilver = zakatableWealth >= silverNisabValue;

    return {
      zakatableWealth,
      goldNisabValue,
      silverNisabValue,
      eligibleByGold,
      eligibleBySilver,
      zakatAmount: zakatableWealth * ZAKAT_RATE,
    };
  };

  const result = submitted ? calculate() : null;

  const reset = () => {
    setAssets(initialAssets);
    setSubmitted(false);
  };

  const Field = ({
    label,
    field,
    unit = currency.symbol,
    help,
  }: {
    label: string;
    field: keyof Assets;
    unit?: string;
    help?: string;
  }) => (
    <div>
      <label
        htmlFor={`zakat-${field}`}
        className="text-noor-muted text-xs mb-1.5 block"
      >
        {label}
      </label>

      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors focus-within:border-noor-gold/50"
        style={{
          background: '#072018',
          border: '1px solid rgba(26,64,53,0.7)',
        }}
      >
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

      {help && (
        <p className="text-[10px] text-noor-muted mt-1">
          {help}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen pt-20 pb-24 lg:pb-8"
      style={{ background: '#072018' }}
    >
      <div
        className="py-12 mb-8 text-center relative overflow-hidden"
        style={{
          background: '#0B2820',
          borderBottom: '1px solid rgba(26,64,53,0.5)',
        }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />

        <div className="relative px-4">
          <p className="text-noor-gold text-[10px] tracking-[.28em] uppercase mb-2">
            Give with sincerity
          </p>

          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">
            Zakat Calculator
          </h1>

          <p className="text-noor-muted text-sm">
            Estimate your annual Zakat obligation in your preferred currency.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Currency */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: '#103329',
            border: '1px solid rgba(26,64,53,0.6)',
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h2 className="font-display text-noor-ivory font-semibold text-xl">
                Currency
              </h2>
              <p className="text-noor-muted text-xs mt-1">
                Choose the currency you use for your wealth.
              </p>
            </div>

            <Calculator size={18} className="text-noor-gold" />
          </div>

          <select
            value={currencyCode}
            onChange={(e) => {
              setCurrencyCode(e.target.value as CurrencyCode);
              setSubmitted(false);
            }}
            className="w-full bg-[#072018] text-noor-ivory border border-noor-border rounded-xl px-3 py-3 text-sm outline-none focus:border-noor-gold/50"
          >
            {CURRENCIES.map((item) => (
              <option
                key={item.code}
                value={item.code}
                className="bg-[#0B2820] text-noor-ivory"
              >
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </div>

        {/* Assets */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            background: '#103329',
            border: '1px solid rgba(26,64,53,0.6)',
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display text-noor-ivory font-semibold text-xl">
              Your Assets
            </h2>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-noor-muted hover:text-noor-gold"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Cash & Bank Balance"
              field="cash"
            />

            <Field
              label="Gold"
              field="gold"
              unit="g"
              help="Enter the weight of your gold in grams."
            />

            <Field
              label="Silver"
              field="silver"
              unit="g"
              help="Enter the weight of your silver in grams."
            />

            <Field
              label="Investments & Stocks"
              field="investments"
            />

            <Field
              label="Business Assets"
              field="business"
            />
          </div>
        </div>

        {/* Debts */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            background: '#103329',
            border: '1px solid rgba(26,64,53,0.6)',
          }}
        >
          <h2 className="font-display text-noor-ivory font-semibold text-xl mb-4">
            Your Debts
          </h2>

          <Field
            label="Outstanding Debts"
            field="debts"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="w-full rounded-xl py-3.5 font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{
            background: '#E8BD4B',
            color: '#071F18',
            boxShadow: '0 10px 28px rgba(232,189,75,0.12)',
          }}
        >
          Calculate Zakat
        </button>

        {/* Result only appears after submit */}
        {result && (
          <div
            className="rounded-2xl p-6 mt-5"
            style={{
              background: result.eligibleByGold
                ? 'rgba(232,189,75,0.08)'
                : '#103329',
              border: result.eligibleByGold
                ? '1px solid rgba(232,189,75,0.3)'
                : '1px solid rgba(26,64,53,0.6)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: result.eligibleByGold
                    ? 'rgba(232,189,75,0.15)'
                    : 'rgba(26,64,53,0.5)',
                }}
              >
                <CheckCircle2
                  size={18}
                  className={
                    result.eligibleByGold
                      ? 'text-noor-gold'
                      : 'text-noor-muted'
                  }
                />
              </div>

              <div>
                <h3 className="font-display text-noor-ivory font-semibold text-lg">
                  Zakat Result
                </h3>

                <p className="text-noor-muted text-xs">
                  Based on the values you entered.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(6,24,18,0.4)' }}
              >
                <p className="text-noor-muted text-xs mb-1">
                  Zakatable Wealth
                </p>

                <p className="font-display text-noor-ivory text-xl font-bold">
                  {formatMoney(result.zakatableWealth, currency)}
                </p>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(6,24,18,0.4)' }}
              >
                <p className="text-noor-muted text-xs mb-1">
                  Zakat Eligible?
                </p>

                <p
                  className={`font-display text-xl font-bold ${
                    result.eligibleByGold
                      ? 'text-noor-gold'
                      : 'text-noor-muted'
                  }`}
                >
                  {result.eligibleByGold ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-5 text-center"
              style={{ background: 'rgba(6,24,18,0.4)' }}
            >
              <p className="text-noor-muted text-sm mb-1">
                Estimated Zakat Due (2.5%)
              </p>

              <p
                className={`font-display text-3xl font-bold ${
                  result.eligibleByGold
                    ? 'text-noor-gold'
                    : 'text-noor-muted'
                }`}
              >
                {formatMoney(
                  result.eligibleByGold ? result.zakatAmount : 0,
                  currency
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(6,24,18,0.3)' }}
              >
                <p className="text-noor-muted text-[10px] mb-1">
                  Gold Nisab (85g)
                </p>
                <p className="text-noor-ivory text-sm font-semibold">
                  {formatMoney(result.goldNisabValue, currency)}
                </p>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(6,24,18,0.3)' }}
              >
                <p className="text-noor-muted text-[10px] mb-1">
                  Silver Nisab (595g)
                </p>
                <p className="text-noor-ivory text-sm font-semibold">
                  {formatMoney(result.silverNisabValue, currency)}
                </p>
              </div>
            </div>

            {result.eligibleByGold && (
              <p className="text-noor-muted text-xs text-center mt-4">
                May Allah accept your Zakat and multiply your blessings. 🤲
              </p>
            )}
          </div>
        )}

        <p className="text-noor-muted text-xs text-center mt-4 leading-relaxed">
          Gold and silver reference prices are approximate and should be
          updated according to your local market before using this for an
          actual Zakat calculation. Zakat rulings can vary; consult a
          qualified scholar for your personal situation.
        </p>
      </div>
    </div>
  );
}
