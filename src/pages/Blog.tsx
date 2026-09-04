import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare,
  ShieldAlert, Image as ImageIcon, Link as LinkIcon, ThumbsUp, Heart, Smile, Sparkles
} from 'lucide-react';

// Custom Supabase Client Loader (fixes Vercel Build Error without modifying UI)
const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';

const getSupabaseClient = () => {
  const supWindow = (window as unknown as { supabase?: any }).supabase;
  if (!supWindow) return null;
  return supWindow.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  img: string;
  featured?: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  email: string;
  text: string;
  time: string;
  linkUrl?: string;
}

interface UserProfile {
  name: string;
  email: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Ways to Strengthen Your Connection with Allah in Daily Life',
    category: 'SPIRITUAL GROWTH',
    excerpt: 'Simple yet powerful daily habits to bring Allah closer to your heart during busy schedules.',
    content: `Maintaining a strong spiritual connection in today's fast-paced world can feel challenging. However, Islam emphasizes consistency in small deeds over sporadic large efforts.\n\n 1. **Start with Morning & Evening Adhkar:** Protect your mind and soul by reciting daily authentic supplications.\n 2. **Mindful Salah:** Treat prayer not as a checklist item, but as a direct conversation with the Creator.\n 3. **Daily Quran Recitation:** Even reading 5 verses a day with translation keeps the divine light alive in your chest.\n 4. **Constant Dhikr:** Keep your tongue moist with SubhanAllah, Alhamdulillah, and Allahu Akbar throughout your commute or work.\n 5. **Nightly Self-Reflection (Muhasabah):** Take 2 minutes before sleeping to thank Allah for blessings and seek forgiveness for shortcomings.`,
    author: 'Sheikh Omar Al-Sayed',
    date: 'Aug 18, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'Understanding Tahajjud: The Prayer of Light and Answers',
    category: 'SALAH & PRAYER',
    excerpt: 'Discover why the night prayer is considered the most powerful intimate conversation with Allah.',
    content: `Tahajjud is a voluntary prayer offered during the last third of the night. It holds immense reward and serves as a direct bridge to divine mercy.\n\n* **Why it matters:** The Prophet (ﷺ) said: 'Our Lord descends every night to the lowest heaven when one-third of the night remains, saying: Who calls upon Me so I may answer?'\n* **How to build the habit:** Set an intention, sleep early, and start with just 2 short Raka'at before Fajr.\n* **Supplication:** It is the best time to pour your heart out in Sujood when distraction is zero.`,
    author: 'Dr. Ayesha Siddiqui',
    date: 'Aug 15, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'The Psychological & Spiritual Benefits of Daily Azkar',
    category: 'DUAS & AZKAR',
    excerpt: 'How authentic Islamic remembrances anchor peace in an anxious heart.',
    content: `Modern life brings stress, overthinking, and fatigue. The Qur'an states: 'Unquestionably, by the remembrance of Allah do hearts find rest' (13:28).\n\nDaily morning and evening Azkar act as a spiritual shield against anxiety, envy, and spiritual burnouts. Incorporate Ayat al-Kursi, 3 Quls, and Istighfar daily for immediate calm.`,
    author: 'Ustadh Bilal Tariq',
    date: 'Aug 10, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Building an Authentic Islamic Home Environment',
    category: 'COMMUNITY & LIFE',
    excerpt: 'Practical advice on fostering love, mercy, and Islamic values in family life.',
    content: `Creating an Islamic environment at home goes beyond hanging calligraphies. It involves practicing character, patience, and warmth inspired by the Sunnah.\n\n- Eat meals together with Bismillah.\n- Make congregational prayer a regular household event.\n- Speak with gentleness and eliminate harsh language.`,
    author: 'Fatima Al-Zahra',
    date: 'Aug 05, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES = ['All', 'Spiritual Growth', 'Salah & Prayer', 'Duas & Azkar', 'Community & Life'];

const BANNED_KEYWORDS = [
  'bf', 'gf', 'dating', 'relationship', 'love u', 'sexy', 'number', 'whatsapp',
  'fuck', 'shit', 'abuse', 'single', 'meet me'
];

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // User Profile State for Chat
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileInput, setProfileInput] = useState({ name: '', email: '' });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [bannedAlert, setBannedAlert] = useState<boolean>(false);

  // Form State for New Blog Article
  const [formData, setFormData] = useState({
    title: '',
    category: 'Spiritual Growth',
    author: '',
    readTime: '3 min read',
    excerpt: '',
    content: '',
    img: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load CDN Supabase JS Script if missing dynamically
  useEffect(() => {
    if (!(window as any).supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Load User Profile from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('noor_user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Error reading profile from local storage', e);
      }
    }
  }, []);

  // Fetch blogs from Supabase or Fallback
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        const client = getSupabaseClient();
        if (!client) {
          if (isMounted) {
            setPosts(DEFAULT_POSTS);
            setIsLoading(false);
          }
          return;
        }

        const { data, error } = await client
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const formatted: BlogPost[] = data.map((b: any) => ({
            id: String(b.id),
            title: b.title || 'Untitled Post',
            category: b.category || 'SPIRITUAL GROWTH',
            excerpt: b.excerpt || (b.content ? b.content.slice(0, 100) + '...' : ''),
            content: b.content || '',
            author: b.author || 'Anonymous',
            date: b.date || new Date().toLocaleDateString(),
            readTime: b.read_time || b.readTime || '3 min read',
            img: b.img || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
            featured: b.featured || false,
          }));
          setPosts([...formatted, ...DEFAULT_POSTS]);
        } else if (isMounted) {
          setPosts(DEFAULT_POSTS);
        }
      } catch (e) {
        console.error('Error fetching blogs from Supabase:', e);
        if (isMounted) setPosts(DEFAULT_POSTS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  // Fetch Chat Messages when Chat Modal Opens
  useEffect(() => {
    if (!isChatOpen) return;
    const fetchChatMessages = async () => {
      const client = getSupabaseClient();
      if (!client) return;

      const { data, error } = await client
        .from('public_chat')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const formattedMsgs: ChatMessage[] = data.map((m: any) => ({
          id: String(m.id),
          user: m.user || 'User',
          email: m.email || '',
          text: m.text || '',
          time: m.time || '',
          linkUrl: m.link_url,
        }));
        setChatMessages(formattedMsgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    fetchChatMessages();
  }, [isChatOpen]);

  // Submit Article Handler
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) return;

    const client = getSupabaseClient();
    if (!client) return;

    const newPostData = {
      title: formData.title,
      category: formData.category.toUpperCase(),
      excerpt: formData.excerpt || formData.content.slice(0, 110) + '...',
      content: formData.content,
      author: formData.author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      read_time: formData.readTime,
      img: formData.img.trim() || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    };

    const { data, error } = await client.from('blogs').insert([newPostData]).select();

    if (!error && data && data.length > 0) {
      const createdPost: BlogPost = {
        id: String(data[0].id),
        ...newPostData,
        readTime: newPostData.read_time,
      };
      setPosts((prev) => [createdPost, ...prev]);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsSubmitOpen(false);
        setFormData({ title: '', category: 'Spiritual Growth', author: '', readTime: '3 min read', excerpt: '', content: '', img: '' });
      }, 1500);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileInput.name || !profileInput.email) return;
    const profile = { name: profileInput.name, email: profileInput.email };
    setUserProfile(profile);
    localStorage.setItem('noor_user_profile', JSON.stringify(profile));
    setIsProfileModalOpen(false);
    setIsChatOpen(true);
  };

  // Send Public Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !linkInput.trim()) return;
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    const lowerText = (newMessage + ' ' + linkInput).toLowerCase();
    if (BANNED_KEYWORDS.some((kw) => lowerText.includes(kw))) {
      setBannedAlert(true);
      setTimeout(() => setBannedAlert(false), 3000);
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const client = getSupabaseClient();

    if (client) {
      const { data, error } = await client
        .from('public_chat')
        .insert([{
          user: userProfile.name,
          email: userProfile.email,
          text: newMessage.trim(),
          link_url: linkInput.trim() || null,
          time: timeStr
        }])
        .select();

      if (!error && data && data.length > 0) {
        const msg: ChatMessage = {
          id: String(data[0].id),
          user: userProfile.name,
          email: userProfile.email,
          text: newMessage.trim(),
          linkUrl: linkInput.trim() || undefined,
          time: timeStr,
        };
        setChatMessages((prev) => [...prev, msg]);
      }
    }

    setNewMessage('');
    setLinkInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return filteredPosts.find((p) => p.featured) || filteredPosts[0];
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="min-h-screen bg-[#061913] text-[#E8EFEA] pt-20 pb-20">
      {/* HEADER HERO SECTION */}
      <section className="text-center py-10 sm:py-14 px-4 max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#102B22] border border-[#1C4235] text-[#D4AF37] text-xs font-medium">
          <BookOpen size={14} />
          <span>Islamic Insights & Knowledge Portal</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF8F5]">
          Knowledge & Reflections
        </h1>
        <p className="text-[#A3B8B0] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Read verified Islamic posts, publish your reflections, and participate in our live moderated Islamic chat room.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#061913] font-semibold text-xs sm:text-sm hover:bg-[#c29f2f] transition-all shadow-md"
          >
            <PlusCircle size={16} /> Submit Your Article
          </button>
          <button
            onClick={() => {
              if (!userProfile) setIsProfileModalOpen(true);
              else setIsChatOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#102B22] border border-[#1C4235] text-[#E8EFEA] font-medium text-xs sm:text-sm hover:border-[#D4AF37]/50 transition-all shadow-md"
          >
            <MessageSquare size={16} /> Public Live Chat
          </button>
        </div>
      </section>

      {/* SEARCH AND CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A958C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D221B] border border-[#1C4235] text-sm text-[#E8EFEA] placeholder-[#7A958C] focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#102B22] border border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#0D221B] border border-[#1C4235] text-[#A3B8B0] hover:text-[#E8EFEA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-[#0D221B] animate-pulse border border-[#1C4235]" />
            ))}
          </div>
        ) : (
          <>
            {/* FEATURED POST */}
            {featuredPost && (
              <div
                onClick={() => setSelectedPost(featuredPost)}
                className="cursor-pointer group rounded-2xl bg-[#0D221B] border border-[#1C4235] hover:border-[#D4AF37]/40 transition-all overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-xl"
              >
                <div className="md:col-span-5 h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={featuredPost.img}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#061913]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#1C4235] text-[10px] font-semibold text-[#D4AF37]">
                    FEATURED
                  </div>
                </div>
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3 text-xs text-[#7A958C]">
                    <span className="font-semibold tracking-wider text-[#D4AF37]">{featuredPost.category.toUpperCase()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {featuredPost.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[#A3B8B0] text-sm leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1C4235]/60 text-xs text-[#7A958C]">
                    <span>By <strong className="text-[#FAF8F5] font-normal">{featuredPost.author}</strong></span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECONDARY GRID POSTS */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer group rounded-2xl bg-[#0D221B] border border-[#1C4235] hover:border-[#D4AF37]/40 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={post.img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#7A958C]">
                          <span className="text-[#D4AF37] font-semibold">{post.category.toUpperCase()}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[#A3B8B0] text-xs leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0 border-t border-[#1C4235]/50 mt-4 flex items-center justify-between text-xs text-[#7A958C]">
                      <span>By {post.author}</span>
                      <span className="text-[#D4AF37]">Read →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ARTICLE READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D221B] border border-[#1C4235] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative text-[#E8EFEA]">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#102B22] text-[#A3B8B0] hover:text-[#FAF8F5]"
            >
              <X size={18} />
            </button>
            <div className="h-60 rounded-xl overflow-hidden">
              <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 border-b border-[#1C4235] pb-4">
              <span className="text-xs text-[#D4AF37] font-semibold tracking-wider">{selectedPost.category.toUpperCase()}</span>
              <h2 className="font-serif text-2xl font-bold text-[#FAF8F5]">{selectedPost.title}</h2>
              <div className="text-xs text-[#7A958C]">
                By {selectedPost.author} • {selectedPost.date} • {selectedPost.readTime}
              </div>
            </div>
            <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-[#A3B8B0]">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D221B] border border-[#1C4235] rounded-2xl max-w-lg w-full p-6 space-y-4 relative text-[#E8EFEA]">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#102B22] text-[#A3B8B0] hover:text-[#FAF8F5]"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl font-bold text-[#D4AF37]">Submit Your Article</h2>
            {submittedSuccess ? (
              <div className="py-8 text-center text-emerald-400 space-y-2">
                <Check size={40} className="mx-auto" />
                <p className="font-semibold text-sm">Article Published Live to Supabase!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#A3B8B0] mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A3B8B0] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A3B8B0] mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name..."
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A3B8B0] mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
                  />
                </div>
                <div>
                  <label className="block text-[#A3B8B0] mb-1">Content *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your post here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-[#061913] font-bold rounded-xl text-sm hover:bg-[#c29f2f]"
                >
                  Publish Article Live
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL FOR CHAT */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D221B] border border-[#1C4235] rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#D4AF37]">Join Community Chat</h3>
            <p className="text-xs text-[#A3B8B0]">Enter your details once to start chatting with brothers & sisters.</p>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={profileInput.name}
                onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
              />
              <input
                type="email"
                required
                placeholder="Your Email (Private)"
                value={profileInput.email}
                onChange={(e) => setProfileInput({ ...profileInput, email: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#061913] border border-[#1C4235] text-sm text-[#E8EFEA]"
              />
              <button type="submit" className="w-full py-2.5 bg-[#D4AF37] text-[#061913] font-bold rounded-xl text-xs">
                Save Profile & Open Chat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC LIVE CHAT MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D221B] border border-[#1C4235] rounded-2xl max-w-lg w-full h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#102B22] border-b border-[#1C4235] flex items-center justify-between">
              <span className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                <MessageSquare size={16} /> Community Live Chat
              </span>
              <button onClick={() => setIsChatOpen(false)} className="text-[#A3B8B0] hover:text-[#E8EFEA]">
                <X size={18} />
              </button>
            </div>
            {bannedAlert && (
              <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs p-2 text-center flex items-center justify-center gap-1">
                <ShieldAlert size={14} /> Restricted words/links are not allowed.
              </div>
            )}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-10 text-[#7A958C] text-xs">No messages yet. Be the first to start the conversation!</div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-[#061913] border border-[#1C4235] p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[#7A958C]">
                      <span className="font-semibold text-[#D4AF37]">{msg.user}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-[#E8EFEA] text-sm">{msg.text}</p>
                    {msg.linkUrl && (
                      <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline block text-[11px] truncate">
                        {msg.linkUrl}
                      </a>
                    )}
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-[#102B22] border-t border-[#1C4235] flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-[#061913] border border-[#1C4235] rounded-xl text-xs text-[#E8EFEA]"
                />
                <button type="submit" className="px-4 py-2 bg-[#D4AF37] text-[#061913] font-bold text-xs rounded-xl flex items-center gap-1">
                  <Send size={12} /> Send
                </button>
              </div>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Optional Islamic Reference URL (https://...)"
                className="w-full px-3 py-1.5 bg-[#061913] border border-[#1C4235] rounded-lg text-[10px] text-[#A3B8B0]"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
