import { useState } from 'react';
import { Search, Share2, ArrowRight } from 'lucide-react';
import { getDailyHadith } from '../data/dailyHadith';

const HADITHS = [
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: 'The best among you are those who learn the Qur\'an and teach it.',
    source: 'Bukhari',
    category: "Qur'an",
  },
  {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    english: 'Actions are but by intentions.',
    source: 'Bukhari & Muslim',
    category: 'Intentions',
  },
  {
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    english: 'A Muslim is one from whose tongue and hand the Muslims are safe.',
    source: 'Bukhari',
    category: 'Character',
  },
  {
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english: 'None of you truly believes until he loves for his brother what he loves for himself.',
    source: 'Bukhari & Muslim',
    category: 'Brotherhood',
  },
  {
    arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
    english: 'The most complete of the believers in faith is the one with the best character.',
    source: 'Abu Dawud',
    category: 'Character',
  },
  {
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    source: 'Bukhari & Muslim',
    category: 'Speech',
  },
  {
    arabic: 'الدِّينُ النَّصِيحَةُ',
    english: 'The religion is sincere advice.',
    source: 'Muslim',
    category: 'Sincerity',
  },
  {
    arabic: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ',
    english: 'Whoever does not show mercy will not be shown mercy.',
    source: 'Bukhari & Muslim',
    category: 'Mercy',
  },
  {
    arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    english: 'Whoever guides to a good deed will have a reward like that of its doer.',
    source: 'Muslim',
    category: 'Good Deeds',
  },
  {
    arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ',
    english: 'There should be neither harm nor reciprocating harm.',
    source: 'Ibn Majah',
    category: 'Conduct',
  },
  {
    arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
    english: 'Whoever deceives us is not one of us.',
    source: 'Muslim',
    category: 'Honesty',
  },
  {
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    english: 'Purification is half of faith.',
    source: 'Muslim',
    category: 'Purification',
  },
];

const COLLECTIONS = ['All', 'Bukhari', 'Muslim', 'Abu Dawud', 'Tirmidhi', 'Nasai', 'Ibn Majah'];

export default function Hadith() {
  const dailyHadith = getDailyHadith();
  const [query, setQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = HADITHS.filter((h) => {
    const matchesQuery =
      h.english.toLowerCase().includes(query.toLowerCase()) ||
      h.arabic.includes(query) ||
      h.category.toLowerCase().includes(query.toLowerCase());
    const matchesCollection =
      activeCollection === 'All' || h.source.includes(activeCollection);
    return matchesQuery && matchesCollection;
  });

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div
        className="py-12 mb-6 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Hadith Collection</h1>
          <p className="text-noor-muted text-sm">Authentic sayings and teachings of the Prophet ﷺ</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
          style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
        >
          <Search size={16} className="text-noor-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hadiths..."
            className="flex-1 bg-transparent text-noor-ivory text-sm placeholder:text-noor-muted outline-none"
          />
        </div>

        {/* Collections */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {COLLECTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCollection(c)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors"
              style={{
                background: activeCollection === c ? 'rgba(232,189,75,0.15)' : 'rgba(16,51,41,0.6)',
                border: activeCollection === c ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.5)',
                color: activeCollection === c ? '#E8BD4B' : '#A9B8B1',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Daily Hadith highlight */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#103329', border: '1px solid rgba(232,189,75,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-noor-gold text-xs tracking-wider uppercase font-medium">Daily Hadith</span>
          </div>
          <p
            className="font-arabic text-noor-gold text-2xl leading-loose mb-4 text-right"
            style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
          >
            {dailyHadith.arabic}
          </p>
          <p className="text-noor-ivory/85 text-base italic mb-2">"{dailyHadith.english}"</p>
          <p className="text-noor-muted text-sm">— {dailyHadith.source} · changes daily</p>
          <div className="flex items-center gap-3 mt-4">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs border border-noor-border text-noor-muted hover:border-noor-gold/40 hover:text-noor-gold transition-colors">
              <Share2 size={12} /> Share
            </button>
          </div>
        </div>

        {/* Hadith list */}
        <div className="space-y-3">
          {filtered.slice(1, visibleCount).map((h, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.5)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(24,185,138,0.12)', color: '#18B98A', border: '1px solid rgba(24,185,138,0.2)' }}
                >
                  {h.category}
                </span>
                <button className="text-noor-muted hover:text-noor-gold transition-colors">
                  <Share2 size={13} />
                </button>
              </div>
              <p
                className="font-arabic text-noor-gold text-lg leading-loose mb-3 text-right"
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {h.arabic}
              </p>
              <p className="text-noor-ivory/80 text-sm italic mb-1">"{h.english}"</p>
              <p className="text-noor-muted text-xs">— {h.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          {visibleCount - 1 < filtered.length && (
            <button onClick={() => setVisibleCount((n) => n + 5)} className="flex items-center gap-2 mx-auto text-sm text-noor-gold border border-noor-gold/30 px-5 py-2.5 rounded-full hover:bg-noor-gold/10 transition-colors">
              Load More <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
