import { useState } from 'react';
import { Copy, Share2, Check } from 'lucide-react';

const CATEGORIES = ['Morning', 'Evening', 'After Prayer', 'Before Sleeping', 'Travel', 'Protection', 'Forgiveness', 'Rizq'];

const DUAS: Record<string, { arabic: string; translation: string; reference: string }[]> = {
  Morning: [
    {
      arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
      translation: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
      reference: 'Abu Dawud',
    },
    {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      translation: 'We have entered the morning and the dominion belongs to Allah.',
      reference: 'Muslim',
    },
  ],
  Evening: [
    {
      arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
      translation: 'O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the resurrection.',
      reference: 'Tirmidhi',
    },
    {
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
      translation: 'We have entered the evening and the dominion belongs to Allah.',
      reference: 'Muslim',
    },
  ],
  'After Prayer': [
    {
      arabic: 'أَسْتَغْفِرُ اللَّهَ',
      translation: 'I seek forgiveness from Allah.',
      reference: 'Muslim',
    },
    {
      arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      translation: 'O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor.',
      reference: 'Muslim',
    },
    {
      arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ',
      translation: 'Glory be to Allah, praise be to Allah, and Allah is the Greatest.',
      reference: 'Muslim',
    },
  ],
  'Before Sleeping': [
    {
      arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      translation: 'O Allah, in Your name I die and I live.',
      reference: 'Bukhari',
    },
  ],
  Travel: [
    {
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
      translation: 'Glory be to He who has subjected this to us, and we could not have otherwise subdued it. And indeed to our Lord we will return.',
      reference: "Qur'an 43:13–14",
    },
    {
      arabic: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
      translation: 'O Allah, make this journey easy for us and shorten its distance for us.',
      reference: 'Muslim',
    },
  ],
  Protection: [
    {
      arabic: 'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي',
      translation: 'O Allah, protect me from in front of me, from behind me, from my right and from my left.',
      reference: 'Abu Dawud',
    },
    {
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
      reference: 'Muslim',
    },
  ],
  Forgiveness: [
    {
      arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
      translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
      reference: "Qur'an 7:23",
    },
    {
      arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
      translation: 'My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of repentance, the Merciful.',
      reference: 'Tirmidhi',
    },
  ],
  Rizq: [
    {
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      translation: 'O Allah, suffice me with what You have made lawful against what You have made unlawful, and make me independent of all those besides You.',
      reference: 'Tirmidhi',
    },
    {
      arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
      translation: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
      reference: "Qur'an 28:24",
    },
  ],
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded-lg text-noor-muted hover:text-noor-gold transition-colors"
    >
      {copied ? <Check size={13} className="text-noor-accent" /> : <Copy size={13} />}
    </button>
  );
}

export default function Duas() {
  const [active, setActive] = useState('Morning');
  const duas = DUAS[active] ?? [];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div
        className="py-12 mb-6 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Duas</h1>
          <p className="text-noor-muted text-sm">Supplications for every moment of your day</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors font-medium"
              style={{
                background: active === cat ? 'rgba(232,189,75,0.15)' : 'rgba(16,51,41,0.5)',
                border: active === cat ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.5)',
                color: active === cat ? '#E8BD4B' : '#A9B8B1',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Duas */}
        <div className="space-y-4">
          {duas.length === 0 && (
            <div className="text-center py-12 text-noor-muted text-sm">No duas found for this category.</div>
          )}
          {duas.map((dua, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
            >
              <p
                className="font-arabic text-noor-gold text-xl leading-loose mb-4 text-right"
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {dua.arabic}
              </p>
              <p className="text-noor-ivory/80 text-sm italic mb-1 leading-relaxed">{dua.translation}</p>
              <p className="text-noor-muted text-xs mb-4">— {dua.reference}</p>
              <div className="flex items-center gap-2">
                <CopyButton text={`${dua.arabic}\n\n${dua.translation}\n— ${dua.reference}`} />
                <button className="p-1.5 rounded-lg text-noor-muted hover:text-noor-gold transition-colors">
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
