import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, ExternalLink, Quote, Share2, Sparkles } from 'lucide-react';
import { STORIES } from './Stories';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const story = STORIES.find((item) => item.slug === slug);

  const related = useMemo(() => {
    if (!story) return [];
    return story.relatedSlugs.map((id) => STORIES.find((item) => item.slug === id)).filter(Boolean).slice(0, 3);
  }, [story]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: story?.title ?? 'Islamic Story', text: story?.excerpt ?? '', url }); } catch { /* cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  if (!story) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center" style={{ background: '#072018' }}>
        <div className="mx-4 max-w-md rounded-2xl border border-[#1A4035] bg-[#103329] p-8 text-center">
          <BookOpen className="mx-auto mb-3 text-noor-gold" size={32} />
          <h1 className="font-display text-xl font-semibold text-noor-ivory">Story not found</h1>
          <p className="mt-2 text-sm text-noor-muted">The story you requested is not available in the Noor collection.</p>
          <Link to="/stories" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E8BD4B] px-5 py-2.5 text-xs font-semibold text-[#061812]"><ArrowLeft size={14} /> Back to Stories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: '#072018' }}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/stories" className="inline-flex items-center gap-1.5 py-4 text-xs font-medium text-noor-gold hover:underline"><ArrowLeft size={13} /> Back to Stories</Link>

        <header className="overflow-hidden rounded-3xl border border-[#1A4035] bg-[#103329] shadow-2xl shadow-black/10">
          <div className="relative h-64 sm:h-80 lg:h-[430px] bg-[#072018]">
            <img src={story.img} alt={story.alt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#103329] via-[#103329]/25 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-[#E8BD4B]/30 bg-[#E8BD4B]/15 px-3 py-1.5 text-[10px] font-semibold text-noor-gold backdrop-blur-sm">{story.tag}</span>
              <button onClick={handleShare} aria-label="Share story" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm hover:bg-black/40">{copied ? <Check size={12} /> : <Share2 size={12} />} {copied ? 'Copied' : 'Share'}</button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-noor-muted mb-3"><span className="inline-flex items-center gap-1.5 text-noor-accent"><Sparkles size={12} /> {story.lesson}</span><span className="h-1 w-1 rounded-full bg-[#54766A]" /><span className="inline-flex items-center gap-1.5"><Clock size={12} /> {story.readingTime} min read</span></div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-noor-ivory">{story.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <div className="rounded-2xl border border-[#1A4035] bg-[#072018]/60 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-noor-accent">Overview</p>
              <p className="mt-2 text-sm sm:text-base leading-7 text-noor-ivory/80">{story.excerpt}</p>
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-noor-ivory">The Story</h2>
              <div className="mt-5 space-y-5 text-sm sm:text-base leading-8 text-noor-ivory/80">
                {story.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex items-end justify-between gap-4 mb-5"><div><p className="text-[10px] uppercase tracking-[.18em] text-noor-accent font-semibold">Practical reflection</p><h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-noor-ivory">What We Learn</h2></div><span className="hidden sm:block text-xs text-noor-muted">{story.lessons.length} lessons</span></div>
              <div className="grid sm:grid-cols-2 gap-3">
                {story.lessons.map((item, index) => <div key={item.title} className="rounded-2xl border border-[#1A4035] bg-[#0B2820] p-5"><div className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8BD4B]/10 text-[10px] font-bold text-noor-gold">0{index + 1}</span><h3 className="text-sm font-semibold text-noor-ivory">{item.title}</h3></div><p className="mt-3 pl-10 text-xs sm:text-sm leading-6 text-noor-muted">{item.text}</p></div>)}
              </div>
            </section>

            <section className="mt-12 rounded-2xl border border-[#1A4035] bg-[#0B2820] p-5 sm:p-6">
              <div className="flex items-center gap-2"><BookOpen size={16} className="text-noor-gold" /><h2 className="font-display text-xl font-semibold text-noor-ivory">Qur’an & Hadith References</h2></div>
              <div className="mt-4 space-y-2">
                {story.sources.map((source) => <div key={`${source.label}-${source.reference}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-[#1A4035] bg-[#072018]/60 px-4 py-3"><span className="text-xs font-semibold text-noor-ivory">{source.label}</span><span className="text-xs text-noor-muted">{source.reference}</span></div>)}
              </div>
              <div className="mt-4 flex gap-3 rounded-xl border border-[#1A4035] bg-[#072018]/50 p-4"><Quote size={16} className="mt-0.5 shrink-0 text-noor-gold" /><p className="text-[11px] sm:text-xs leading-5 text-noor-muted">Source material is listed above. The explanation, practical lessons, reflection, and takeaway on this page are Noor’s original editorial presentation and are not presented as Qur’an or Hadith text.</p></div>
            </section>

            <section className="mt-10 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#1A4035] bg-[#0B2820] p-5"><p className="text-[10px] uppercase tracking-[.18em] text-noor-accent font-semibold">Reflection</p><p className="mt-3 text-sm leading-7 text-noor-ivory/80">{story.reflection}</p></div>
              <div className="rounded-2xl border border-[#E8BD4B]/20 bg-[#E8BD4B]/5 p-5"><p className="text-[10px] uppercase tracking-[.18em] text-noor-gold font-semibold">Key Takeaway</p><p className="mt-3 font-display text-lg leading-7 text-noor-ivory">{story.takeaway}</p></div>
            </section>
          </div>
        </header>

        {related.length > 0 && <section className="mt-12"><div className="flex items-end justify-between gap-4 mb-5"><div><p className="text-[10px] uppercase tracking-[.18em] text-noor-accent font-semibold">Continue reading</p><h2 className="mt-1 font-display text-2xl font-semibold text-noor-ivory">Related Stories</h2></div><Link to="/stories" className="hidden sm:inline-flex items-center gap-1 text-xs text-noor-gold hover:underline">View all <ArrowRight size={12} /></Link></div><div className="grid md:grid-cols-3 gap-4">{related.map((item) => item && <Link key={item.slug} to={`/stories/${item.slug}`} className="group rounded-2xl border border-[#1A4035] bg-[#103329] p-4 transition hover:-translate-y-1 hover:border-[#2D6655]"><div className="h-28 overflow-hidden rounded-xl bg-[#072018]"><img src={item.img} alt={item.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></div><p className="mt-3 text-[10px] font-semibold text-noor-accent">{item.tag}</p><h3 className="mt-1 font-display text-base font-semibold leading-snug text-noor-ivory group-hover:text-noor-gold">{item.title}</h3><span className="mt-3 inline-flex items-center gap-1 text-[11px] text-noor-gold">Read story <ArrowRight size={11} /></span></Link>)}</div></section>}
      </article>
    </div>
  );
}
