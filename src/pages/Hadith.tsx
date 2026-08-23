import { useEffect, useState } from 'react';
import { Search, Share2, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { getDailyHadith } from '../data/dailyHadith';

type HadithItem = {
  arabic: string;
  english: string;
  source: string;
  category: string;
};

const STATIC_HADITHS: HadithItem[] = [
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

const COLLECTIONS = [
  { id: 'All', name: 'All' },
  { id: 'bukhari', name: 'Bukhari' },
  { id: 'muslim', name: 'Muslim' },
  { id: 'abudawud', name: 'Abu Dawud' },
  { id: 'tirmidhi', name: 'Tirmidhi' },
  { id: 'nasai', name: 'Nasai' },
  { id: 'ibnmajah', name: 'Ibn Majah' },
];

export default function Hadith() {
  const dailyHadith = getDailyHadith();
  const [query, setQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState('All');
  const [hadiths, setHadiths] = useState<HadithItem[]>(STATIC_HADITHS);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch Hadiths dynamically when changing collections
  useEffect(() => {
    if (activeCollection === 'All') {
      setHadiths(STATIC_HADITHS);
      return;
    }

    setLoading(true);
    const collectionKey = activeCollection;

    Promise.all([
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collectionKey}.json`).then((r) => r.json()),
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${collectionKey}.json`).then((r) => r.json()),
    ])
      .then(([arabicRes, engRes]) => {
        const arabicList = arabicRes?.hadiths || [];
        const engList = engRes?.hadiths || [];

        const merged: HadithItem[] = [];
        const maxItems = Math.min(arabicList.length, engList.length, 30);

        for (let i = 0; i < maxItems; i += 2) {
          const ar = arabicList[i];
          const en = engList[i];
          if (ar?.text && en?.text) {
            merged.push({
              arabic: ar.text,
              english: en.text,
              source: COLLECTIONS.find((c) => c.id === collectionKey)?.name || collectionKey,
              category: 'Sunnah',
            });
          }
        }

        if (merged.length > 0) {
          setHadiths(merged);
        } else {
          setHadiths(STATIC_HADITHS.filter((h) => h.source.toLowerCase().includes(collectionKey)));
        }
      })
      .catch(() => {
        setHadiths(STATIC_HADITHS.filter((h) => h.source.toLowerCase().includes(collectionKey)));
      })
      .finally(() => setLoading(false));
  }, [activeCollection]);

  // Handle Share / Copy function
  const handleShare = async (textToShare: string, id: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hadith - Noor Daily Companion',
          text: textToShare,
        });
        return;
      } catch {
        // Fallback to clipboard if share was canceled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const filtered = hadiths.filter((h) => {
    const q = query.toLowerCase();
    return (
      h.english.toLowerCase().includes(q) ||
      h.arabic.includes(query) ||
      h.category.toLowerCase().includes(q) ||
      h.source.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      {/* Top Banner Header */}
      <div
        className="py-10 mb-6 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="relative px-4">
          <h1 className="font-display text-noor-ivory text-3xl sm:text-4xl font-semibold mb-2">
            Hadith Collection
          </h1>
          <p className="text-noor-muted text-xs sm:text-sm">
            Authentic sayings and teachings of the Prophet ﷺ
          </p>
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
            placeholder="Search hadiths by keyword or source..."
            className="flex-1 bg-transparent text-noor-ivory text-sm placeholder:text-noor-muted outline-none"
          />
        </div>

        {/* Collections Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCollection(c.id);
                setVisibleCount(6);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: activeCollection === c.id ? '#E8BD4B' : 'rgba(16,51,41,0.8)',
                border: activeCollection === c.id ? '1px solid #E8BD4B' : '1px solid rgba(26,64,53,0.7)',
                color: activeCollection === c.id ? '#061812' : '#A9B8B1',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Daily Hadith Highlight */}
        <div
          className="rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #103329 0%, #0B2820 100%)',
            border: '1px solid rgba(232,189,75,0.3)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 text-noor-gold text-xs tracking-wider uppercase font-semibold">
              <Sparkles size={13} /> Daily Hadith
            </span>
          </div>
          <p
            className="font-arabic text-noor-gold text-2xl sm:text-3xl leading-loose mb-4 text-right"
            style={{ fontFamily: 'Amiri, serif' }}
            dir="rtl"
          >
            {dailyHadith.arabic}
          </p>
          <p className="text-noor-ivory/90 text-sm sm:text-base italic mb-2 leading-relaxed">
            "{dailyHadith.english}"
          </p>
          <p className="text-noor-muted text-xs">— {dailyHadith.source} · Updated Daily</p>

          <div className="flex items-center gap-3 mt-5 pt-3 border-t border-[#1A4035]">
            <button
              onClick={() =>
                handleShare(
                  `Daily Hadith:\n\n${dailyHadith.arabic}\n\n"${dailyHadith.english}"\n— ${dailyHadith.source}`,
                  'daily'
                )
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-noor-gold/30 text-noor-gold hover:bg-noor-gold/10 transition-colors"
            >
              {copiedId === 'daily' ? (
                <>
                  <Check size={13} className="text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Share2 size={13} /> Share Hadith
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hadith List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-noor-muted text-sm gap-2">
            <Loader2 size={22} className="animate-spin text-noor-gold" />
            <span>Fetching Hadith collection...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.slice(0, visibleCount).map((h, i) => {
              const itemKey = `hadith-${i}`;
              return (
                <article
                  key={i}
                  className="rounded-xl p-5 sm:p-6 transition-all hover:border-noor-gold/30"
                  style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'rgba(24,185,138,0.12)',
                        color: '#18B98A',
                        border: '1px solid rgba(24,185,138,0.25)',
                      }}
                    >
                      {h.category}
                    </span>
                    <button
                      onClick={() =>
                        handleShare(
                          `${h.arabic}\n\n"${h.english}"\n— ${h.source}`,
                          itemKey
                        )
                      }
                      className="text-noor-muted hover:text-noor-gold transition-colors flex items-center gap-1 text-xs"
                      title="Share Hadith"
                    >
                      {copiedId === itemKey ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <Check size={12} /> Copied
                        </span>
                      ) : (
                        <Share2 size={14} />
                      )}
                    </button>
                  </div>

                  <p
                    className="font-arabic text-noor-gold text-xl sm:text-2xl leading-loose mb-3 text-right"
                    style={{ fontFamily: 'Amiri, serif' }}
                    dir="rtl"
                  >
                    {h.arabic}
                  </p>

                  <p className="text-noor-ivory/85 text-sm italic mb-2 leading-relaxed">
                    "{h.english}"
                  </p>

                  <p className="text-noor-muted text-xs font-medium">— {h.source}</p>
                </article>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-noor-muted text-sm">
                No hadiths found matching your query.
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && visibleCount < filtered.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((n) => n + 6)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-noor-gold border border-noor-gold/40 px-6 py-2.5 rounded-full hover:bg-noor-gold/10 transition-colors"
            >
              Load More <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
