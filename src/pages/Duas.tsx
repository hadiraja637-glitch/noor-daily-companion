import { useState, useEffect, useMemo } from 'react';
import { Copy, Share2, Check, Sparkles, BookOpen, Volume2, Search, Heart } from 'lucide-react';

interface DuaItem {
  id?: string;
  arabic: string;
  translation: string;
  reference: string;
  transliteration?: string;
  category: string;
  keywords?: string[];
}

const CATEGORIES = [
  'All Duas',
  'Daily Featured',
  'Anxiety & Stress',
  'Exams & Success',
  'Health & Healing',
  'Parents & Family',
  'Rizq & Wealth',
  'Forgiveness',
  'Protection',
  'Morning',
  'Evening',
  'After Prayer',
  'Before Sleeping',
  'Travel',
];

const HIGH_DEMAND_DUAS: DuaItem[] = [
  // High Google Search: Anxiety & Stress
  {
    category: 'Anxiety & Stress',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: "Surah Al-Anbiya 21:87 (Dua of Prophet Yunus)",
    keywords: ['anxiety', 'stress', 'distress', 'depression', 'difficulty', 'hardship'],
  },
  {
    category: 'Anxiety & Stress',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazani, wal-\'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala\'id-dayni wa ghalabatir-rijal',
    translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.',
    reference: 'Sahih al-Bukhari 6369',
    keywords: ['anxiety', 'worry', 'debt', 'sadness', 'laziness'],
  },

  // High Google Search: Exams & Knowledge
  {
    category: 'Exams & Success',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni \'ilma',
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Surah Taha 20:114',
    keywords: ['study', 'exam', 'knowledge', 'student', 'success', 'test'],
  },
  {
    category: 'Exams & Success',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
    transliteration: 'Rabbish-rah li sadri, wa yassir li amri, wahlul \'uqdatam-mil-lisani yafqahu qawli',
    translation: 'My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech.',
    reference: 'Surah Taha 20:25-28',
    keywords: ['speech', 'interview', 'exam', 'confidence', 'presentation'],
  },

  // High Google Search: Health & Healing
  {
    category: 'Health & Healing',
    arabic: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ واشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا',
    transliteration: 'Adhibil-ba\'sa Rabban-nas, ishfi antash-Shafi, la shifa\'a illa shifa\'uka shifa\'an la yughadiru saqama',
    translation: 'Remove the suffering, O Lord of mankind, and heal; You are the Healer, there is no healing except Your healing—a healing that leaves behind no illness.',
    reference: 'Sahih al-Bukhari 5743',
    keywords: ['sick', 'shifa', 'pain', 'healing', 'health', 'illness'],
  },

  // High Google Search: Parents & Family
  {
    category: 'Parents & Family',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-hamhuma kama rabbayani sagheira',
    translation: 'My Lord, have mercy upon them [my parents] as they brought me up [when I was] small.',
    reference: 'Surah Al-Isra 17:24',
    keywords: ['parents', 'mother', 'father', 'family', 'mercy'],
  },

  // High Google Search: Rizq & Wealth
  {
    category: 'Rizq & Wealth',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allahummak-fini bi-halalika an haramika wa aghnini bi-fadlika amman siwak',
    translation: 'O Allah, suffice me with what You have made lawful against what You have made unlawful, and make me independent of all those besides You.',
    reference: 'Jami at-Tirmidhi 3563',
    keywords: ['rizq', 'wealth', 'money', 'business', 'halal', 'job'],
  },
  {
    category: 'Rizq & Wealth',
    arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transliteration: 'Rabbi inni lima anzalta ilayya min khayrin faqir',
    translation: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
    reference: 'Surah Al-Qasas 28:24',
    keywords: ['need', 'poverty', 'blessing', 'provision', 'marriage'],
  },

  // Forgiveness
  {
    category: 'Forgiveness',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    transliteration: 'Rabbana dhalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasirin',
    translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
    reference: "Surah Al-A'raf 7:23",
    keywords: ['sin', 'forgiveness', 'astagfirullah', 'repentance'],
  },

  // Protection
  {
    category: 'Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    reference: 'Sahih Muslim 2708',
    keywords: ['evil eye', 'protection', 'fear', 'harm', 'safety'],
  },

  // Morning & Evening
  {
    category: 'Morning',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur',
    translation: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
    reference: 'Abu Dawud 5068',
    keywords: ['morning', 'azkar', 'start day'],
  },
  {
    category: 'Before Sleeping',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'O Allah, in Your name I die and I live.',
    reference: 'Sahih al-Bukhari 6312',
    keywords: ['sleep', 'night', 'bedtime'],
  },
];

export default function Duas() {
  const [activeCategory, setActiveCategory] = useState<string>('Daily Featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dailyDua, setDailyDua] = useState<DuaItem | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [sharedIndex, setSharedIndex] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  // Daily Dynamic Dua selection
  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    setDailyDua(HIGH_DEMAND_DUAS[dayOfYear % HIGH_DEMAND_DUAS.length]);
  }, []);

  // Filter Duas based on Category and Search Query
  const filteredDuas = useMemo(() => {
    return HIGH_DEMAND_DUAS.filter((dua) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.transliteration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (searchQuery.trim() !== '') return true;

      if (activeCategory === 'All Duas') return true;
      if (activeCategory === 'Daily Featured') return dailyDua ? dua === dailyDua : true;
      return dua.category === activeCategory;
    });
  }, [activeCategory, searchQuery, dailyDua]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleShare = async (dua: DuaItem, id: string) => {
    const shareData = {
      title: `${dua.category} Dua`,
      text: `${dua.arabic}\n\n"${dua.translation}"\n— ${dua.reference}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      handleCopy(`${shareData.text}\n\n${shareData.url}`, id);
      setSharedIndex(id);
      setTimeout(() => setSharedIndex(null), 2000);
    }
  };

  const handleTextToSpeech = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isPlaying === id) {
        window.speechSynthesis.cancel();
        setIsPlaying(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.onend = () => setIsPlaying(null);
      utterance.onerror = () => setIsPlaying(null);
      setIsPlaying(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-8 sm:py-10 mb-6 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <BookOpen size={13} /> High Ranking & Authentic Duas
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Sacred Duas</h1>
          <p className="text-noor-muted text-xs sm:text-sm">Supplications for health, exams, anxiety, rizq & protection</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword (e.g., anxiety, exam, shifa, debt, parents)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#103329] border border-[#1A4035] text-xs sm:text-sm text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]/50 transition-all"
          />
        </div>

        {/* Daily Featured Highlight Box */}
        {dailyDua && activeCategory !== 'Daily Featured' && !searchQuery && (
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#103329] to-[#0B2820] border border-[#E8BD4B]/40 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-[#1A4035]/60 pb-2.5">
              <span className="flex items-center gap-1.5 text-[#E8BD4B] font-display font-semibold text-xs sm:text-sm">
                <Sparkles size={15} /> Featured Dua of the Day
              </span>
              <span className="text-[11px] text-noor-muted bg-[#061812]/40 px-2.5 py-0.5 rounded-full border border-[#1A4035]">
                {dailyDua.category}
              </span>
            </div>

            <p className="font-arabic text-noor-gold text-lg sm:text-xl leading-loose text-right mb-3" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
              {dailyDua.arabic}
            </p>
            {dailyDua.transliteration && (
              <p className="text-noor-muted/90 text-xs italic mb-1.5">{dailyDua.transliteration}</p>
            )}
            <p className="text-noor-ivory/90 text-xs sm:text-sm leading-relaxed mb-2">"{dailyDua.translation}"</p>
            <p className="text-noor-muted/70 text-[11px]">— {dailyDua.reference}</p>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat && !searchQuery;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8BD4B]/20 border border-[#E8BD4B]/50 text-[#E8BD4B] shadow-sm'
                    : 'bg-[#103329]/60 border border-[#1A4035]/60 text-noor-muted hover:text-noor-ivory'
                }`}
              >
                {cat === 'Daily Featured' && <Sparkles size={12} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-12 text-noor-muted text-xs sm:text-sm bg-[#103329]/30 rounded-2xl border border-[#1A4035]/40">
              No supplications match your search query.
            </div>
          ) : (
            filteredDuas.map((dua, i) => {
              const duaId = `${dua.category}-${i}`;
              const isCopied = copiedIndex === duaId;
              const isShared = sharedIndex === duaId;

              return (
                <div
                  key={duaId}
                  className="rounded-2xl p-5 sm:p-6 bg-[#103329] border border-[#1A4035]/70 hover:border-[#E8BD4B]/30 transition-all shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between text-xs border-b border-[#1A4035]/40 pb-2">
                    <span className="text-[#E8BD4B] font-medium bg-[#E8BD4B]/10 px-2.5 py-0.5 rounded-full border border-[#E8BD4B]/20">
                      {dua.category}
                    </span>
                    <span className="text-noor-muted text-[11px]">— {dua.reference}</span>
                  </div>

                  <p
                    className="font-arabic text-noor-gold text-xl sm:text-2xl leading-loose text-right"
                    style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                  >
                    {dua.arabic}
                  </p>

                  {dua.transliteration && (
                    <p className="text-noor-muted/80 text-xs sm:text-sm italic border-l-2 border-[#E8BD4B]/40 pl-3 py-0.5">
                      {dua.transliteration}
                    </p>
                  )}

                  <p className="text-noor-ivory/90 text-xs sm:text-sm leading-relaxed">
                    "{dua.translation}"
                  </p>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1A4035]/50 text-xs">
                    <button
                      onClick={() => handleTextToSpeech(dua.arabic, duaId)}
                      className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
                        isPlaying === duaId
                          ? 'bg-[#E8BD4B] text-[#061812] font-semibold'
                          : 'text-noor-muted hover:text-noor-gold hover:bg-[#061812]/40'
                      }`}
                      aria-label="Listen Audio"
                    >
                      <Volume2 size={15} className={isPlaying === duaId ? 'animate-bounce' : ''} />
                      <span className="hidden sm:inline text-[11px]">
                        {isPlaying === duaId ? 'Playing...' : 'Listen'}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(`${dua.arabic}\n\n"${dua.translation}"\n— ${dua.reference}`, duaId)}
                        className="p-2 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#061812]/40 transition-all flex items-center gap-1.5"
                        aria-label="Copy Dua"
                      >
                        {isCopied ? (
                          <>
                            <Check size={15} className="text-emerald-400" />
                            <span className="text-emerald-400 text-[11px] font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={15} />
                            <span className="hidden sm:inline text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(dua, duaId)}
                        className="p-2 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#061812]/40 transition-all flex items-center gap-1.5"
                        aria-label="Share Dua"
                      >
                        {isShared ? (
                          <>
                            <Check size={15} className="text-emerald-400" />
                            <span className="text-emerald-400 text-[11px] font-medium">Shared!</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={15} />
                            <span className="hidden sm:inline text-[11px]">Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
