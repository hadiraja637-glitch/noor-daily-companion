import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', "Qur'an", 'Hadith', 'Salah', 'Duas', 'Spiritual Growth', 'Islamic History', 'Lifestyle'];

const POSTS = [
  {
    title: '5 Ways to Strengthen Your Connection with Allah',
    category: 'Spiritual Growth',
    excerpt: 'Simple yet powerful ways to bring Allah closer to your heart. These practical tips can be incorporated into daily routines, transforming ordinary moments into acts of worship.',
    date: 'Aug 18, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1577214407836-1f3a0604ecb2?w=700&h=420&fit=crop&auto=format',
    alt: 'Islamic lanterns',
    featured: true,
    content: "A stronger connection with Allah is built through consistency rather than occasional bursts of effort. Start with sincere intention, protect the five daily prayers, keep a small daily portion of Qur'an, remember Allah during ordinary moments, and make heartfelt dua. Small acts repeated with sincerity can reshape the heart over time.",
  },
  {
    title: 'Understanding the Importance of Salah',
    category: 'Salah',
    excerpt: "Salah is the foundation of a believer's life. Discover its true significance and how it shapes our relationship with Allah.",
    date: 'Aug 15, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1563300365-9c77e472e7a5?w=700&h=420&fit=crop&auto=format',
    alt: 'Mosque silhouette',
    featured: false,
    content: 'Salah gives the believer a daily rhythm of turning back to Allah. It teaches discipline, gratitude, humility and remembrance. Guarding the prayer times, slowing down in sujood, and learning the meanings of what you recite can help transform prayer from a routine into a living relationship with Allah.',
  },
  {
    title: 'Duas for Everyday Life',
    category: 'Duas',
    excerpt: 'Beautiful duas for daily situations, with meanings and benefits explained clearly.',
    date: 'Aug 12, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=700&h=420&fit=crop&auto=format',
    alt: 'Quran',
    featured: false,
    content: 'Dua is an act of worship and a way to keep the heart connected to Allah in ease and difficulty. Build a personal routine around authentic supplications for waking, leaving home, eating, travel, protection, forgiveness and sleep, while also speaking to Allah in your own words.',
  },
  {
    title: 'Lessons from the Lives of the Prophets',
    category: 'Islamic History',
    excerpt: 'Timeless lessons that guide us in modern life, drawn from the stories of our beloved Prophets.',
    date: 'Aug 10, 2026',
    readTime: '8 min read',
    img: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=700&h=420&fit=crop&auto=format',
    alt: 'Mountain ridges',
    featured: false,
    content: "The Qur'an presents the lives of the Prophets as sources of patience, courage, trust and repentance. Their stories remind us that hardship does not mean abandonment, and that sincere reliance upon Allah can coexist with effort, patience and wise action.",
  },
  {
    title: "How to Build a Daily Qur'an Habit",
    category: "Qur'an",
    excerpt: "Practical tips to make the Qur'an a consistent part of your day — even with a busy schedule.",
    date: 'Aug 8, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1587617425953-9075d28b8c46?w=700&h=420&fit=crop&auto=format',
    alt: 'Quran on wooden stand',
    featured: false,
    content: "A sustainable Qur'an habit starts small. Choose a fixed time, keep the Mushaf or reading app visible, read a manageable amount, listen when you cannot read, and take a moment to reflect on one ayah. Consistency matters more than a large target that cannot be maintained.",
  },
  {
    title: 'Small Deeds That Bring Great Barakah',
    category: 'Lifestyle',
    excerpt: 'Little actions that bring immense rewards in sha Allah — simple habits every Muslim can cultivate.',
    date: 'Aug 5, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=700&h=420&fit=crop&auto=format',
    alt: 'Ocean waves',
    featured: false,
    content: 'A smile, a sincere greeting, helping someone, giving charity, remembering Allah, visiting family and removing harm from another person can all become meaningful acts of worship when done sincerely. Look for small opportunities to do good throughout the day.',
  },
  {
    title: "The Night Prayer: Qiyam al-Layl",
    category: 'Spiritual Growth',
    excerpt: 'Discover the spiritual benefits of praying at night and how to establish a consistent Tahajjud routine.',
    date: 'Aug 2, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1714273709859-fb5613b0aaa7?w=700&h=420&fit=crop&auto=format',
    alt: 'Desert dunes',
    featured: false,
    content: "Night prayer is a quiet space for reflection, Qur'an and dua. Begin with even two rak'ahs, protect your sleep, and increase gradually as your routine becomes stable. The goal is sincerity and consistency, not exhaustion.",
  },
  {
    title: 'Islamic Finance: Halal Investing Principles',
    category: 'Lifestyle',
    excerpt: 'A beginner\'s guide to understanding halal investing and managing your wealth in accordance with Islamic principles.',
    date: 'Jul 28, 2026',
    readTime: '9 min read',
    img: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=700&h=420&fit=crop&auto=format',
    alt: 'Mosque dome',
    featured: false,
    content: 'Halal financial planning begins with understanding what you own, how it is earned and where it is invested. Avoid clearly prohibited elements, seek qualified scholarly guidance for complex products, and keep transparency and responsibility at the center of financial decisions.',
  },
];

export default function Blog() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [openPost, setOpenPost] = useState<typeof POSTS[0] | null>(null);

  const filtered = POSTS.filter((p) => {
    const matchesCat = category === 'All' || p.category === category;
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  if (openPost) {
    return (
      <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-8">
          <button
            onClick={() => setOpenPost(null)}
            className="text-noor-gold text-sm mb-6 hover:underline flex items-center gap-1"
          >
            ← Back to Blog
          </button>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium mb-4 inline-block"
            style={{ background: 'rgba(232,189,75,0.15)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.3)' }}
          >
            {openPost.category}
          </span>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold leading-tight mb-3">
            {openPost.title}
          </h1>
          <p className="text-noor-muted text-sm mb-6">{openPost.date} · {openPost.readTime}</p>
          <div className="rounded-2xl overflow-hidden mb-8 h-72">
            <img src={openPost.img} alt={openPost.alt} className="w-full h-full object-cover" />
          </div>
          <div className="prose max-w-none">
            <p className="text-noor-ivory/85 text-base leading-relaxed mb-4">{openPost.excerpt}</p>
            <p className="text-noor-ivory/75 text-base leading-relaxed mb-4">
              {openPost.content}
            </p>
            <blockquote
              className="border-l-2 pl-4 py-2 my-6"
              style={{ borderColor: '#E8BD4B', background: 'rgba(232,189,75,0.05)', borderRadius: '0 8px 8px 0' }}
            >
              <p className="font-arabic text-noor-gold text-lg" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
                وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ
              </p>
              <p className="text-noor-ivory/70 text-sm italic mt-2">
                "Take provisions, and indeed the best provision is taqwa." — Qur'an 2:197
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div
        className="py-12 mb-8 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Islamic Blog</h1>
          <p className="text-noor-muted text-sm">Knowledge, reflection and practical guidance for everyday life</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
            style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
          >
            <Search size={15} className="text-noor-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-sm text-noor-ivory placeholder:text-noor-muted outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-7" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors"
              style={{
                background: category === c ? 'rgba(232,189,75,0.15)' : 'rgba(16,51,41,0.5)',
                border: category === c ? '1px solid rgba(232,189,75,0.35)' : '1px solid rgba(26,64,53,0.5)',
                color: category === c ? '#E8BD4B' : '#A9B8B1',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <button
            onClick={() => setOpenPost(featured)}
            className="w-full mb-7 rounded-2xl overflow-hidden group text-left"
            style={{ border: '1px solid rgba(26,64,53,0.6)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-56 md:h-full overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-center" style={{ background: '#103329' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-noor-gold text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(232,189,75,0.12)', border: '1px solid rgba(232,189,75,0.25)' }}>
                    {featured.category}
                  </span>
                  <span className="text-noor-gold text-[10px] px-2 py-0.5 rounded-full border border-noor-gold/20"
                    style={{ background: 'rgba(232,189,75,0.08)' }}>
                    Featured
                  </span>
                </div>
                <h2 className="font-display text-noor-ivory text-2xl font-semibold leading-snug mb-3 group-hover:text-noor-gold transition-colors">
                  {featured.title}
                </h2>
                <p className="text-noor-muted text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-noor-muted text-xs">{featured.date} · {featured.readTime}</p>
                  <span className="flex items-center gap-1 text-xs text-noor-gold">
                    Read More <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post, i) => (
            <button
              key={i}
              onClick={() => setOpenPost(post)}
              className="rounded-xl overflow-hidden group text-left transition-all hover:-translate-y-1"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.img}
                  alt={post.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(232,189,75,0.18)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,0.3)' }}
                >
                  {post.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-noor-ivory font-semibold text-base leading-snug mb-1.5 group-hover:text-noor-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-noor-muted text-xs leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-noor-muted text-xs">{post.date}</span>
                  <span className="text-noor-gold text-xs">Read More →</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-noor-muted text-sm">No articles found.</div>
        )}
      </div>
    </div>
  );
}
