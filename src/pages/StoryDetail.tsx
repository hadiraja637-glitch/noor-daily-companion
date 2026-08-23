import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, BookOpen, Share2, Sparkles, Check } from 'lucide-react';
import { getStoryAsync, type Story } from '../data/stories';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadStory() {
      setLoading(true);
      if (slug) {
        const found = await getStoryAsync(slug);
        setStory(found || null);
      }
      setLoading(false);
    }
    loadStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center" style={{ background: '#072018' }}>
        <div className="text-center text-noor-gold">
          <BookOpen className="animate-bounce mx-auto mb-2" size={32} />
          <p className="text-xs text-noor-muted">Story load ho rahi hai...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center" style={{ background: '#072018' }}>
        <div className="text-center p-8 rounded-2xl bg-[#103329] border border-noor-border max-w-md mx-4">
          <h2 className="text-noor-ivory text-xl font-semibold mb-2">Story Nahi Mili</h2>
          <p className="text-noor-muted text-xs mb-6">Munsalik kahani ya zikr load nahi ho saka.</p>
          <Link to="/stories" className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#E8BD4B] text-[#061812] inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Wapas Stories Par Jayein
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text: story.excerpt, url: window.location.href });
      } catch { /* Share cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: '#072018' }}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <Link to="/stories" className="inline-flex items-center gap-1.5 text-xs text-noor-gold hover:underline mb-6">
          <ArrowLeft size={13} /> Tamam Stories Wapas
        </Link>

        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
          <div className="relative h-64 sm:h-80 overflow-hidden bg-[#072018]">
            <img src={story.img} alt={story.alt || story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(16,51,41,0.95) 0%, rgba(16,51,41,0.2) 60%)' }} />
            <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-medium" style={{ background: 'rgba(232,189,75,0.2)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.3)' }}>
              {story.tag}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-3 border-b border-[#1A4035] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-noor-gold" />
                <span className="text-noor-accent text-xs font-medium">{story.lesson}</span>
              </div>
              <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-noor-muted border border-noor-border hover:text-noor-gold transition-colors">
                {copied ? <Check size={12} className="text-noor-gold" /> : <Share2 size={12} />}
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>

            <h1 className="font-display text-noor-ivory text-2xl sm:text-4xl font-semibold mb-4 leading-tight">
              {story.title}
            </h1>

            <p className="text-noor-gold text-sm italic mb-6 leading-relaxed bg-[#072018]/50 p-4 rounded-xl border border-[#1A4035]">
              "{story.excerpt}"
            </p>

            <div className="space-y-4 text-noor-ivory/80 text-sm sm:text-base leading-relaxed">
              {story.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
