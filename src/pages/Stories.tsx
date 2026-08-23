import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Search, Languages, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { STORIES, fetchExternalIslamicStories, type Story } from '../data/stories';

export default function Stories() {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [allStories, setAllStories] = useState<Story[]>(STORIES);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  // Load API Quran Insights & merge with Local Stories
  useEffect(() => {
    async function loadApiStories() {
      setLoadingApi(true);
      const apiData = await fetchExternalIslamicStories();
      if (apiData.length > 0) {
        const mappedApiStories: Story[] = apiData.map((item, idx) => ({
          slug: item.slug || `api-story-${idx}`,
          title: item.title || 'Quranic Insight',
          excerpt: item.excerpt || 'Contemplate upon the divine wisdom of the Qur\'an.',
          content: item.content || [],
          img: item.img || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=720&fit=crop&auto=format',
          alt: item.alt || 'Quran',
          tag: 'Quranic Insights',
          lesson: item.lesson || 'Divine Reflection',
        }));
        setAllStories([...STORIES, ...mappedApiStories]);
      }
      setLoadingApi(false);
    }
    loadApiStories();
  }, []);

  const tags = ['All', 'Prophets', 'Sahaba', 'Prophet ﷺ', 'Quranic Insights'];

  // Filtering Logic
  const filteredStories = allStories.filter((s) => {
    const matchesTag = activeTag === 'All' || s.tag === activeTag;
    const titleMatch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = s.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const urduTitleMatch = s.translationUrdu?.title.includes(searchQuery);
    return matchesTag && (titleMatch || excerptMatch || urduTitleMatch);
  });

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-12" style={{ background: '#072018' }}>
      {/* Header Banner */}
      <div
        className="py-10 sm:py-14 mb-8 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ background: 'rgba(232,189,75,0.15)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.3)' }}>
            <Sparkles size={13} /> {lang === 'en' ? 'Timeless Wisdom & Guidance' : 'روشن ہدایت اور حکمت'}
          </div>
          <h1 className="font-display text-noor-ivory text-3xl sm:text-5xl font-semibold mb-3">
            {lang === 'en' ? 'Islamic Stories' : 'اسلامی واقعات'}
          </h1>
          <p className="text-noor-muted text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
            {lang === 'en'
              ? 'Inspiring stories from the lives of the Prophets, Sahaba, and righteous scholars.'
              : 'انبیاء کرام، صحابہ عظام اور سلف صالحین کی زندگیوں سے نصائح اور عبرت انگیز واقعات'}
          </p>

          {/* Search Bar & Language Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search stories or lessons...' : 'واقعہ یا سبق تلاش کریں...'}
                className="w-full bg-[#072018] text-noor-ivory text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-noor-border outline-none focus:border-noor-gold/60 transition-colors placeholder:text-noor-muted/60"
              />
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium border border-noor-gold/40 text-noor-gold hover:bg-noor-gold/10 transition-colors w-full sm:w-auto justify-center"
            >
              <Languages size={14} />
              {lang === 'en' ? 'اردو میں پڑھیں' : 'Switch to English'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0"
              style={{
                background: activeTag === tag ? '#E8BD4B' : 'rgba(16,51,41,0.6)',
                color: activeTag === tag ? '#061812' : '#A9B8B1',
                border: activeTag === tag ? '1px solid #E8BD4B' : '1px solid rgba(26,64,53,0.6)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStories.map((s, i) => {
              const displayTitle = lang === 'ur' && s.translationUrdu ? s.translationUrdu.title : s.title;
              const displayExcerpt = lang === 'ur' && s.translationUrdu ? s.translationUrdu.excerpt : s.excerpt;
              const displayLesson = lang === 'ur' && s.translationUrdu ? s.translationUrdu.lesson : s.lesson;

              return (
                <Link
                  key={s.slug || i}
                  to={`/stories/${s.slug}`}
                  className="block rounded-2xl overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between"
                  style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
                >
                  <div>
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-[#072018]">
                      <img
                        src={s.img}
                        alt={s.alt || displayTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=720&fit=crop&auto=format';
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(16,51,41,0.95) 0%, rgba(16,51,41,0.1) 60%)' }}
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: 'rgba(232,189,75,0.18)',
                          color: '#E8BD4B',
                          border: '1px solid rgba(232,189,75,0.3)',
                        }}
                      >
                        {s.tag}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#18B98A' }} />
                        <span className="text-noor-accent text-xs font-medium truncate">{displayLesson}</span>
                      </div>
                      <h3 className={`font-display text-noor-ivory font-semibold text-base sm:text-lg leading-snug mb-2 group-hover:text-noor-gold transition-colors ${lang === 'ur' ? 'text-right font-arabic' : ''}`}>
                        {displayTitle}
                      </h3>
                      <p className={`text-noor-muted text-xs sm:text-sm leading-relaxed line-clamp-3 ${lang === 'ur' ? 'text-right' : ''}`}>
                        {displayExcerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <span className="flex items-center gap-1.5 text-xs text-noor-gold group-hover:underline font-medium">
                      {lang === 'en' ? 'Read Full Story' : 'مکمل واقعہ پڑھیں'} <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-[#103329]/50 border border-noor-border">
            <BookOpen size={28} className="mx-auto text-noor-gold mb-2 opacity-60" />
            <p className="text-noor-ivory font-medium text-sm">No stories found matching your search.</p>
            <p className="text-noor-muted text-xs mt-1">Try resetting search filters or changing keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
