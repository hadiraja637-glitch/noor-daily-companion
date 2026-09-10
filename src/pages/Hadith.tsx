import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Share2,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Library,
} from 'lucide-react';
import { getDailyHadith } from '../data/dailyHadith';

type HadithItem = {
  id: string;
  arabic: string;
  english: string;
  source: string;
  reference: string;
  category: string;
  significance: string;
};

const STATIC_HADITHS: HadithItem[] = [
  {
    id: 'bukhari-5027',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    english: "The best among you are those who learn the Qur'an and teach it.",
    source: 'Sahih al-Bukhari',
    reference: '5027',
    category: "Qur'an",
    significance: 'A concise reminder of the virtue of learning the Qur’an and passing its knowledge on to others.',
  },
  {
    id: 'bukhari-1',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    english: 'Actions are but by intentions.',
    source: 'Sahih al-Bukhari',
    reference: '1',
    category: 'Intentions',
    significance: 'Our intentions matter in how our deeds are understood and valued.',
  },
  {
    id: 'bukhari-10',
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    english: 'A Muslim is one from whose tongue and hand the Muslims are safe.',
    source: 'Sahih al-Bukhari',
    reference: '10',
    category: 'Character',
    significance: 'Faith is reflected in how safely and respectfully we treat other people.',
  },
  {
    id: 'bukhari-13',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    english: 'None of you truly believes until he loves for his brother what he loves for himself.',
    source: 'Sahih al-Bukhari',
    reference: '13',
    category: 'Brotherhood',
    significance: 'It encourages sincere goodwill and fairness toward fellow believers.',
  },
  {
    id: 'abudawud-4682',
    arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
    english: 'The most complete of the believers in faith are those with the best character.',
    source: 'Sunan Abi Dawud',
    reference: '4682',
    category: 'Character',
    significance: 'Good character is presented as an important expression of complete faith.',
  },
  {
    id: 'bukhari-6018',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    source: 'Sahih al-Bukhari',
    reference: '6018',
    category: 'Speech',
    significance: 'A practical rule for guarding the tongue: speak beneficially, or choose silence.',
  },
  {
    id: 'muslim-55',
    arabic: 'الدِّينُ النَّصِيحَةُ',
    english: 'The religion is sincere advice.',
    source: 'Sahih Muslim',
    reference: '55',
    category: 'Sincerity',
    significance: 'The hadith highlights sincere concern and goodwill as central to religious life.',
  },
  {
    id: 'bukhari-5997',
    arabic: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ',
    english: 'Whoever does not show mercy will not be shown mercy.',
    source: 'Sahih al-Bukhari',
    reference: '5997',
    category: 'Mercy',
    significance: 'It calls believers to show mercy rather than treating kindness as weakness.',
  },
  {
    id: 'muslim-1893',
    arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ',
    english: 'Whoever guides to a good deed will have a reward like that of its doer.',
    source: 'Sahih Muslim',
    reference: '1893',
    category: 'Good Deeds',
    significance: 'Encouraging someone toward a good action is itself described as a rewarded act.',
  },
  {
    id: 'ibnmajah-2340',
    arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ',
    english: 'There should be neither harming nor reciprocating harm.',
    source: 'Sunan Ibn Majah',
    reference: '2340',
    category: 'Conduct',
    significance: 'A foundational principle emphasizing that harm should not be inflicted or returned with harm.',
  },
  {
    id: 'muslim-101',
    arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
    english: 'Whoever deceives us is not one of us.',
    source: 'Sahih Muslim',
    reference: '101',
    category: 'Honesty',
    significance: 'The Prophet ﷺ strongly warned against deception and dishonest dealings.',
  },
  {
    id: 'muslim-223',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    english: 'Purification is half of faith.',
    source: 'Sahih Muslim',
    reference: '223',
    category: 'Purification',
    significance: 'Purification is given a central place in the life of a believer.',
  },
  {
    id: 'bukhari-6464',
    arabic: 'وَأَحَبُّ الأَعْمَالِ أَدْوَمُهَا إِلَى اللَّهِ وَإِنْ قَلَّ',
    english: 'The most beloved deeds to Allah are those that are most regular and constant, even if they are few.',
    source: 'Sahih al-Bukhari',
    reference: '6464',
    category: 'Worship',
    significance: 'Steady, sustainable worship is better than taking on more than one can consistently maintain.',
  },
  {
    id: 'muslim-2588',
    arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
    english: 'Charity does not decrease wealth.',
    source: 'Sahih Muslim',
    reference: '2588',
    category: 'Charity',
    significance: 'The hadith encourages generosity and also praises forgiveness and humility.',
  },
  {
    id: 'bukhari-6138',
    arabic: 'فَلْيَصِلْ رَحِمَهُ ... فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    english: 'Whoever believes in Allah and the Last Day should maintain family ties and speak good or remain silent.',
    source: 'Sahih al-Bukhari',
    reference: '6138',
    category: 'Family',
    significance: 'Faith is connected here with maintaining family relationships, honoring guests, and guarding speech.',
  },
];

const COLLECTIONS = [
  { id: 'All', name: 'All' },
  { id: 'bukhari', name: 'Bukhari' },
  { id: 'muslim', name: 'Muslim' },
  { id: 'abudawud', name: 'Abu Dawud' },
  { id: 'tirmidhi', name: 'Tirmidhi' },
  { id: 'nasai', name: "An-Nasa'i" },
  { id: 'ibnmajah', name: 'Ibn Majah' },
];

const TOPICS = [
  'All Topics',
  "Qur'an",
  'Character',
  'Worship',
  'Family',
  'Charity',
  'Intentions',
  'Speech',
  'Mercy',
  'Honesty',
  'Good Deeds',
];

export default function Hadith() {
  const dailyHadith = getDailyHadith();
  const [query, setQuery] = useState('');
  const [activeCollection, setActiveCollection] = useState('All');
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [hadiths, setHadiths] = useState<HadithItem[]>(STATIC_HADITHS);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setVisibleCount(8);
    setExpandedId(null);

    if (activeCollection === 'All') {
      setHadiths(STATIC_HADITHS);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const collectionKey = activeCollection;

    setLoading(true);

    Promise.all([
      fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collectionKey}.json`,
        { signal: controller.signal }
      ).then((r) => {
        if (!r.ok) throw new Error('Arabic collection request failed');
        return r.json();
      }),
      fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${collectionKey}.json`,
        { signal: controller.signal }
      ).then((r) => {
        if (!r.ok) throw new Error('English collection request failed');
        return r.json();
      }),
    ])
      .then(([arabicRes, engRes]) => {
        const arabicList = Array.isArray(arabicRes?.hadiths) ? arabicRes.hadiths : [];
        const engList = Array.isArray(engRes?.hadiths) ? engRes.hadiths : [];

        // Match Arabic and English by hadith number.
        // The old page used i += 2, which skipped every other hadith and
        // could pair the wrong Arabic and English texts.
        const arabicByNumber = new Map(
          arabicList.map((item: any) => [String(item.hadithnumber ?? ''), item])
        );

        const merged: HadithItem[] = [];

        for (const en of engList) {
          const number = String(en?.hadithnumber ?? '');
          const ar = arabicByNumber.get(number);

          if (ar?.text && en?.text) {
            merged.push({
              id: `${collectionKey}-${number}`,
              arabic: ar.text,
              english: en.text,
              source:
                COLLECTIONS.find((c) => c.id === collectionKey)?.name ||
                collectionKey,
              reference: number || '—',
              category: 'Sunnah',
              significance: 'A hadith from the selected collection. Read the full context before drawing detailed rulings from a short excerpt.',
            });
          }

          if (merged.length >= 30) break;
        }

        if (merged.length > 0) {
          setHadiths(merged);
        } else {
          setHadiths(
            STATIC_HADITHS.filter((h) =>
              h.source.toLowerCase().includes(collectionKey)
            )
          );
        }
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return;
        setHadiths(
          STATIC_HADITHS.filter((h) =>
            h.source.toLowerCase().includes(collectionKey)
          )
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeCollection]);

  const handleShare = async (hadith: HadithItem, id: string) => {
    const textToShare = `${hadith.arabic}\n\n"${hadith.english}"\n— ${hadith.source} ${hadith.reference}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hadith — Noor Daily Companion',
          text: textToShare,
        });
        return;
      } catch {
        // User cancelled native sharing; clipboard is a useful fallback.
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard can be unavailable on insecure/local contexts.
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return hadiths.filter((h) => {
      const matchesTopic =
        activeTopic === 'All Topics' || h.category === activeTopic;

      if (!matchesTopic) return false;
      if (!q) return true;

      return (
        h.english.toLowerCase().includes(q) ||
        h.arabic.includes(query.trim()) ||
        h.category.toLowerCase().includes(q) ||
        h.source.toLowerCase().includes(q) ||
        h.reference.toLowerCase().includes(q)
      );
    });
  }, [hadiths, query, activeTopic]);

  const collectionCountLabel =
    activeCollection === 'All'
      ? 'Curated collection'
      : `${COLLECTIONS.find((c) => c.id === activeCollection)?.name || activeCollection} collection`;

  return (
    <div
      className="min-h-screen pt-20 pb-24 lg:pb-10"
      style={{ background: '#072018' }}
    >
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(232,189,75,0.10), transparent 42%), #0B2820',
          borderColor: 'rgba(26,64,53,0.65)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 text-[11px] font-semibold tracking-[0.14em] uppercase text-noor-gold border border-noor-gold/20 bg-noor-gold/5">
              <BookOpen size={13} />
              Prophetic guidance
            </div>

            <h1 className="font-display text-noor-ivory text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Hadith Collection
            </h1>

            <p className="text-noor-muted text-sm sm:text-base leading-7 max-w-2xl">
              Explore selected sayings and teachings of the Prophet Muhammad ﷺ,
              with Arabic text, English meaning, collection references, and
              simple context notes.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-noor-ivory/80 bg-white/[0.03] border border-white/[0.06]">
                <ShieldCheck size={13} className="text-noor-gold" />
                Source references
              </span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-noor-ivory/80 bg-white/[0.03] border border-white/[0.06]">
                <Library size={13} className="text-noor-gold" />
                Multiple collections
              </span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-noor-ivory/80 bg-white/[0.03] border border-white/[0.06]">
                <Sparkles size={13} className="text-noor-gold" />
                Daily highlight
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-5 relative z-10">
          {[
            ['16', 'Curated hadiths'],
            ['6', 'Collections'],
            ['11', 'Topics'],
            ['Daily', 'New highlight'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl px-4 py-4 bg-[#103329] border border-[#1A4035] shadow-lg"
            >
              <div className="text-noor-gold text-lg font-semibold">{value}</div>
              <div className="text-noor-muted text-[11px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Search + collection controls */}
        <section className="mt-8">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: '#103329',
              border: '1px solid rgba(26,64,53,0.8)',
            }}
          >
            <Search size={17} className="text-noor-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(8);
              }}
              placeholder="Search by meaning, Arabic, topic or reference..."
              aria-label="Search hadiths"
              className="flex-1 min-w-0 bg-transparent text-noor-ivory text-sm placeholder:text-noor-muted outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-noor-muted hover:text-noor-ivory text-xs"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-noor-muted mb-2">
              Collections
            </p>
            <div
              className="flex gap-2 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {COLLECTIONS.map((collection) => {
                const active = activeCollection === collection.id;

                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => {
                      setActiveCollection(collection.id);
                      setActiveTopic('All Topics');
                      setQuery('');
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border"
                    style={{
                      background: active
                        ? '#E8BD4B'
                        : 'rgba(16,51,41,0.8)',
                      borderColor: active
                        ? '#E8BD4B'
                        : 'rgba(26,64,53,0.8)',
                      color: active ? '#061812' : '#A9B8B1',
                    }}
                  >
                    {collection.name}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCollection === 'All' && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-noor-muted mb-2">
                Topics
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {TOPICS.map((topic) => {
                  const active = activeTopic === topic;

                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setActiveTopic(topic);
                        setVisibleCount(8);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-[11px] whitespace-nowrap border transition-all"
                      style={{
                        background: active
                          ? 'rgba(232,189,75,0.12)'
                          : 'rgba(16,51,41,0.45)',
                        borderColor: active
                          ? 'rgba(232,189,75,0.45)'
                          : 'rgba(26,64,53,0.65)',
                        color: active ? '#E8BD4B' : '#8FA39A',
                      }}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Daily highlight */}
        <section
          className="mt-8 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl"
          style={{
            background:
              'radial-gradient(circle at 100% 0%, rgba(232,189,75,0.12), transparent 35%), linear-gradient(135deg, #103329 0%, #0B2820 100%)',
            border: '1px solid rgba(232,189,75,0.25)',
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 text-noor-gold text-[11px] tracking-[0.16em] uppercase font-semibold">
                <Sparkles size={14} />
                Daily Hadith
              </div>
              <p className="text-noor-muted text-xs mt-1">
                A short reminder for today
              </p>
            </div>
            <span className="text-[10px] text-noor-muted border border-[#1A4035] rounded-full px-2.5 py-1">
              Updated daily
            </span>
          </div>

          <p
            className="font-arabic text-noor-gold text-2xl sm:text-3xl leading-[2.1] mb-5 text-right"
            style={{ fontFamily: 'Amiri, serif' }}
            dir="rtl"
          >
            {dailyHadith.arabic}
          </p>

          <p className="text-noor-ivory/90 text-sm sm:text-base italic leading-7">
            "{dailyHadith.english}"
          </p>

          <p className="text-noor-muted text-xs mt-3">
            — {dailyHadith.source}
          </p>

          <button
            type="button"
            onClick={() =>
              handleShare(
                {
                  id: 'daily',
                  arabic: dailyHadith.arabic,
                  english: dailyHadith.english,
                  source: dailyHadith.source,
                  reference: '',
                  category: 'Daily',
                  significance: '',
                },
                'daily'
              )
            }
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-noor-gold/30 text-noor-gold hover:bg-noor-gold/10 transition-colors"
          >
            {copiedId === 'daily' ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Share2 size={14} /> Share Hadith
              </>
            )}
          </button>
        </section>

        {/* Collection intro */}
        <section className="mt-10 mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-noor-gold text-[10px] uppercase tracking-[0.16em] font-semibold mb-1">
              Explore the collection
            </p>
            <h2 className="font-display text-noor-ivory text-2xl font-semibold">
              {activeTopic === 'All Topics' ? 'All Hadiths' : activeTopic}
            </h2>
            <p className="text-noor-muted text-xs mt-1">
              {filtered.length} result{filtered.length === 1 ? '' : 's'} · {collectionCountLabel}
            </p>
          </div>
        </section>

        {/* Hadith list */}
        {loading ? (
          <div className="rounded-2xl border border-[#1A4035] bg-[#103329] flex flex-col items-center justify-center py-20 text-noor-muted text-sm gap-3">
            <Loader2 size={24} className="animate-spin text-noor-gold" />
            <span>Fetching the selected collection…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#1A4035] bg-[#103329] text-center py-16 px-6">
            <Search size={24} className="mx-auto text-noor-muted mb-3" />
            <p className="text-noor-ivory text-sm font-medium">
              No hadiths found
            </p>
            <p className="text-noor-muted text-xs mt-1">
              Try another keyword, topic, or collection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.slice(0, visibleCount).map((h) => {
              const isExpanded = expandedId === h.id;

              return (
                <article
                  key={h.id}
                  className="rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:border-noor-gold/25"
                  style={{
                    background: '#103329',
                    border: '1px solid rgba(26,64,53,0.65)',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: 'rgba(24,185,138,0.10)',
                        color: '#18B98A',
                        border: '1px solid rgba(24,185,138,0.22)',
                      }}
                    >
                      {h.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleShare(h, h.id)}
                      className="text-noor-muted hover:text-noor-gold transition-colors flex items-center gap-1.5 text-xs"
                      title="Share Hadith"
                      aria-label={`Share ${h.source} ${h.reference}`}
                    >
                      {copiedId === h.id ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <Check size={12} /> Copied
                        </span>
                      ) : (
                        <>
                          <Share2 size={14} />
                          <span className="hidden sm:inline">Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p
                    className="font-arabic text-noor-gold text-xl sm:text-2xl leading-[2.1] mb-4 text-right"
                    style={{ fontFamily: 'Amiri, serif' }}
                    dir="rtl"
                  >
                    {h.arabic}
                  </p>

                  <p className="text-noor-ivory/90 text-sm sm:text-base leading-7">
                    "{h.english}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                    <span className="text-noor-muted">— {h.source}</span>
                    <span className="text-noor-muted/50">·</span>
                    <span className="text-noor-gold/80">Hadith {h.reference}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : h.id)
                    }
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-noor-gold hover:text-noor-ivory transition-colors"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Hide context' : 'Why it matters'}
                    <ArrowRight
                      size={13}
                      className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#1A4035]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-noor-muted mb-1.5">
                        Significance
                      </p>
                      <p className="text-noor-ivory/75 text-xs sm:text-sm leading-6">
                        {h.significance}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {!loading && visibleCount < filtered.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + 8)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-noor-gold border border-noor-gold/40 px-6 py-3 rounded-full hover:bg-noor-gold/10 transition-colors"
            >
              Load More <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Editorial/source note */}
        <section
          className="mt-12 rounded-2xl p-5 sm:p-6"
          style={{
            background: 'rgba(16,51,41,0.55)',
            border: '1px solid rgba(26,64,53,0.65)',
          }}
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-noor-gold shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="text-noor-ivory text-sm font-semibold">
                Source & context note
              </h3>
              <p className="text-noor-muted text-xs leading-6 mt-1.5">
                References identify the hadith collection and hadith number
                where available. The short “Significance” text is editorial
                context, not a quotation from the Prophet ﷺ. Collection data
                loaded from the external hadith API may contain material with
                different grading levels, so detailed legal or theological
                conclusions should be checked against the full hadith and
                qualified scholarship.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
