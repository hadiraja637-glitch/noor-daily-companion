import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare, ShieldAlert, Image as ImageIcon, Sparkles, Share2, MoreVertical, Trash2, Mail } from 'lucide-react';

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
    category: 'Spiritual Growth',
    excerpt: 'Simple yet powerful daily habits to bring Allah closer to your heart during busy schedules.',
    content: `Maintaining a strong spiritual connection in today's fast-paced world can feel challenging. However, Islam emphasizes consistency in small deeds over sporadic large efforts.\n\n1. **Start with Morning & Evening Adhkar:** Protect your mind and soul by reciting daily authentic supplications.\n2. **Mindful Salah:** Treat prayer not as a checklist item, but as a direct conversation with the Creator.\n3. **Daily Quran Recitation:** Even reading 5 verses a day with translation keeps the divine light alive in your chest.\n4. **Constant Dhikr:** Keep your tongue moist with SubhanAllah, Alhamdulillah, and Allahu Akbar throughout your commute or work.\n5. **Nightly Self-Reflection (Muhasabah):** Take 2 minutes before sleeping to thank Allah for blessings and seek forgiveness for shortcomings.`,
    author: 'Sheikh Omar Al-Sayed',
    date: 'Aug 18, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
];

const CATEGORIES = ['All', 'Spiritual Growth', 'Salah & Prayer', 'Duas & Azkar', 'Community & Life'];
const BANNED_KEYWORDS = ['bf', 'gf', 'dating', 'relationship', 'love u', 'sexy', 'number', 'whatsapp', 'fuck', 'shit', 'abuse', 'single', 'meet me'];

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileInput, setProfileInput] = useState({ name: '', email: '' });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [newMsg, setNewMsg] = useState('');
  const [chatError, setChatError] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Spiritual Growth',
    author: '',
    readTime: '3 min read',
    excerpt: '',
    content: '',
    img: '',
  });

  useEffect(() => {
    const savedBlogs = localStorage.getItem('noor_user_blogs');
    if (savedBlogs) {
      try {
        setPosts([...JSON.parse(savedBlogs), ...DEFAULT_POSTS]);
      } catch (e) {
        setPosts(DEFAULT_POSTS);
      }
    } else {
      setPosts(DEFAULT_POSTS);
    }

    const savedProfile = localStorage.getItem('noor_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {}
    }
  }, []);

  // Supabase CDN Realtime Connection Setup
  useEffect(() => {
    const initSupabaseChat = async () => {
      const supWindow = (window as any).supabase;
      if (!supWindow) return;

      const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
      const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';

      const supabaseClient = supWindow.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Fetch existing messages
      const { data, error } = await supabaseClient
        .from('public_chat')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const formatted: ChatMessage[] = data.map((item: any) => ({
          id: item.id.toString(),
          user: item.user_name,
          email: item.email,
          text: item.text,
          linkUrl: item.link_url || undefined,
          time: item.time,
        }));
        setChatMessages(formatted);
      }

      // Realtime subscription (YouTube live style)
      const channel = supabaseClient
        .channel('public_chat_room')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'public_chat' },
          (payload: any) => {
            if (payload.eventType === 'INSERT') {
              const newItem = payload.new;
              const newMsgObj: ChatMessage = {
                id: newItem.id.toString(),
                user: newItem.user_name,
                email: newItem.email,
                text: newItem.text,
                linkUrl: newItem.link_url || undefined,
                time: newItem.time,
              };

              setChatMessages((prev) => {
                if (prev.some((m) => m.id === newMsgObj.id)) return prev;
                return [...prev, newMsgObj];
              });

              if (!isChatOpen) {
                setUnreadCount((prev) => prev + 1);
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id.toString();
              setChatMessages((prev) => prev.filter((m) => m.id !== deletedId));
            }
          }
        )
        .subscribe();

      return () => {
        supabaseClient.removeChannel(channel);
      };
    };

    initSupabaseChat();
  }, [isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = useMemo(() => filteredPosts.find((p) => p.featured), [filteredPosts]);
  const showFeatured = featuredPost && activeCategory === 'All' && !searchQuery;

  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      excerpt: formData.excerpt || formData.content.slice(0, 110) + '...',
      content: formData.content,
      author: formData.author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: formData.readTime,
      img: formData.img.trim() || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('noor_user_blogs', JSON.stringify([newPost, ...(JSON.parse(localStorage.getItem('noor_user_blogs') || '[]'))]));
    
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitOpen(false);
      setFormData({ title: '', category: 'Spiritual Growth', author: '', readTime: '3 min read', excerpt: '', content: '', img: '' });
    }, 1800);
  };

  const extractUrl = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    return urlMatch ? urlMatch[0] : null;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileInput.name.trim() || !profileInput.email.trim()) return;

    const newProf: UserProfile = {
      name: profileInput.name.trim(),
      email: profileInput.email.trim(),
    };

    setUserProfile(newProf);
    localStorage.setItem('noor_user_profile', JSON.stringify(newProf));
    setIsProfileModalOpen(false);

    if (newMsg.trim()) {
      executeSendMessage(newProf);
    }
  };

  const handleSendTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setChatError('');

    if (!newMsg.trim()) return;

    const lowerMsg = newMsg.toLowerCase();
    const containsBadWords = BANNED_KEYWORDS.some((word) => lowerMsg.includes(word));

    if (containsBadWords) {
      setChatError('Strict Moderation: Personal dating, contact sharing & informal chat are prohibited!');
      return;
    }

    if (!userProfile || !userProfile.name) {
      setIsProfileModalOpen(true);
      return;
    }

    executeSendMessage(userProfile);
  };

  const executeSendMessage = async (profile: UserProfile) => {
    const supWindow = (window as any).supabase;
    if (!supWindow) return;

    const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';
    const supabaseClient = supWindow.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const detectedLink = extractUrl(newMsg);
    const cleanText = newMsg.replace(/(https?:\/\/[^\s]+)/g, '').trim();

    const messageData = {
      user_name: profile.name,
      email: profile.email,
      text: cleanText || (detectedLink ? 'Shared an Islamic Resource Link:' : newMsg),
      link_url: detectedLink || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    await supabaseClient.from('public_chat').insert([messageData]);

    setNewMsg('');
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteMessage = async (id: string) => {
    const supWindow = (window as any).supabase;
    if (supWindow) {
      const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
      const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';
      const supabaseClient = supWindow.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await supabaseClient.from('public_chat').delete().eq('id', id);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-8 sm:py-12 mb-6 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium shadow-sm">
            <BookOpen size={13} /> Islamic Insights & Knowledge Portal
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Knowledge & Reflections</h1>
          <p className="text-noor-muted text-xs sm:text-sm max-w-xl mx-auto">
            Read verified Islamic posts, publish your reflections, and participate in our live moderated Islamic chat room.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-xs sm:text-sm hover:bg-[#f2ca5c] transition-all shadow-md"
            >
              <PlusCircle size={16} /> Submit Your Article
            </button>
            
            <button
              onClick={() => {
                setIsChatOpen(true);
                setUnreadCount(0);
              }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#103329] border border-[#E8BD4B]/40 text-[#E8BD4B] font-semibold text-xs sm:text-sm hover:bg-[#1A4035] transition-all shadow-md"
            >
              <MessageSquare size={16} /> Public Live Chat
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold shadow-lg border border-white/20 animate-pulse">
                  +{unreadCount} new
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]/50 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? 'bg-[#E8BD4B]/20 border border-[#E8BD4B]/50 text-[#E8BD4B]'
                    : 'bg-[#103329]/60 border border-[#1A4035]/60 text-noor-muted hover:text-noor-ivory hover:border-[#1A4035]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {showFeatured && featuredPost && (
          <div
            onClick={() => setSelectedPost(featuredPost)}
            className="cursor-pointer group relative rounded-2xl overflow-hidden bg-[#103329] border border-[#E8BD4B]/40 hover:border-[#E8BD4B] transition-all flex flex-col md:flex-row shadow-xl"
          >
            <div className="md:w-5/12 h-56 md:h-auto min-h-[220px] relative overflow-hidden bg-[#0B2820]">
              <img 
                src={featuredPost.img} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="md:w-7/12 p-5 sm:p-8 flex flex-col justify-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-[#E8BD4B] bg-[#E8BD4B]/10 px-2.5 py-1 rounded-md border border-[#E8BD4B]/20 shadow-sm">
                    {featuredPost.category}
                  </span>
                  <span className="text-noor-muted text-xs flex items-center gap-1.5 font-medium"><Clock size={14} /> {featuredPost.readTime}</span>
                </div>
                <h2 className="font-display text-xl sm:text-3xl font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-noor-muted text-sm sm:text-base line-clamp-3 leading-relaxed">{featuredPost.excerpt}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#1A4035]/60 text-xs sm:text-sm text-noor-muted font-medium">
                <span className="flex items-center gap-2"><User size={15} className="text-[#E8BD4B]" /> {featuredPost.author}</span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredPosts.filter(p => !showFeatured || p.id !== featuredPost?.id).map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group rounded-2xl bg-[#103329] border border-[#1A4035] hover:border-[#E8BD4B]/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[#E8BD4B]/5"
            >
              <div>
                <div className="h-48 overflow-hidden relative bg-[#0B2820]">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 text-[10px] font-semibold text-noor-ivory bg-[#061812]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#1A4035] shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-noor-muted font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-noor-muted text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1A4035]/40 mt-2 flex items-center justify-between text-xs text-noor-muted font-medium">
                <span className="truncate max-w-[140px] flex items-center gap-1.5"><User size={14} className="text-[#E8BD4B]/70" /> {post.author}</span>
                <span className="text-[#E8BD4B] group-hover:underline flex items-center gap-1">Read <span className="hidden sm:inline">Article</span> →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLE FULL READ MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-5 shadow-2xl relative text-noor-ivory">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory transition-colors z-10 shadow-md border border-[#1A4035]"
            >
              <X size={18} />
            </button>

            <div className="h-52 sm:h-72 rounded-xl overflow-hidden relative bg-[#061812]">
              <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 border-b border-[#1A4035] pb-5">
              <span className="inline-block text-xs text-[#E8BD4B] font-semibold bg-[#E8BD4B]/10 px-3 py-1 rounded-full border border-[#E8BD4B]/20">
                {selectedPost.category}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{selectedPost.title}</h2>
              <div className="flex items-center justify-between text-sm text-noor-muted pt-1 font-medium">
                <span className="flex items-center gap-2"><User size={15} className="text-[#E8BD4B]" /> {selectedPost.author}</span>
                <span>{selectedPost.date} • {selectedPost.readTime}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-sm sm:text-base text-noor-ivory/90 leading-relaxed whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#E8BD4B]/30 rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-4 shadow-2xl relative text-noor-ivory">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-1.5 pb-2 border-b border-[#1A4035]">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#E8BD4B]">Submit Your Article</h2>
              <p className="text-noor-muted text-xs sm:text-sm">Share your Islamic thoughts or reflections with the community.</p>
            </div>

            {submittedSuccess ? (
              <div className="py-10 text-center space-y-3 text-emerald-400">
                <Check size={48} className="mx-auto animate-bounce bg-emerald-400/10 p-3 rounded-full border border-emerald-400/20" />
                <p className="text-base sm:text-lg font-semibold">Article Published Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-4">
                <div>
                  <label className="block text-noor-muted mb-1.5 text-xs sm:text-sm font-medium">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Benefits of Giving Charity in Secret"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-noor-muted mb-1.5 text-xs sm:text-sm font-medium">Your Name / Author *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Brother Ali"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-noor-muted mb-1.5 text-xs sm:text-sm font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] transition-colors"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c} className="bg-[#0B2820] text-noor-ivory">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-noor-muted mb-1.5 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <ImageIcon size={14} /> Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-noor-muted mb-1.5 text-xs sm:text-sm font-medium">Article Content *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article body here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E8BD4B] text-[#061812] font-bold text-sm sm:text-base hover:bg-[#f2ca5c] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Publish Article
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REQUIRED PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#E8BD4B]/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-noor-ivory animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 flex items-center justify-center text-[#E8BD4B] mx-auto">
                <User size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#E8BD4B]">Setup Your Profile</h3>
              <p className="text-noor-muted text-xs leading-relaxed">
                Please enter your details once before joining the public live chat.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-noor-muted text-xs font-medium mb-1 flex items-center gap-1">
                  <User size={13} className="text-[#E8BD4B]" /> Full Name or Public Nickname *
                </label>
                <input
                  type="text"
                  required
                  value={profileInput.name}
                  onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })}
                  placeholder="e.g. Fatima Noor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                />
              </div>

              <div>
                <label className="block text-noor-muted text-xs font-medium mb-1 flex items-center gap-1">
                  <Mail size={13} className="text-[#E8BD4B]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={profileInput.email}
                  onChange={(e) => setProfileInput({ ...profileInput, email: e.target.value })}
                  placeholder="e.g. user@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#E8BD4B] text-[#061812] font-bold text-sm hover:bg-[#f2ca5c] transition-all shadow-md mt-2"
              >
                Save & Continue to Live Chat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* YOUTUBE STYLE REALTIME LIVE CHAT MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#081F18] border border-[#1A4035] rounded-2xl sm:rounded-3xl max-w-lg w-full h-[90dvh] sm:h-[85vh] flex flex-col justify-between shadow-2xl relative text-noor-ivory overflow-hidden">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-[#1A4035] bg-[#0B2820]/95 backdrop-blur-md flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8BD4B]/15 border border-[#E8BD4B]/40 flex items-center justify-center text-[#E8BD4B] shadow-inner">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-noor-ivory flex items-center gap-2">
                    Islamic Live Stream Chat
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[11px] text-noor-muted">
                    {userProfile ? (
                      <span>Active as: <strong className="text-[#E8BD4B] font-semibold">{userProfile.name}</strong></span>
                    ) : (
                      <span className="text-amber-400 font-medium">Profile Pending</span>
                    )}
                    <span className="text-emerald-400 font-semibold">• Supabase Realtime</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory transition-all border border-[#1A4035]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div 
              onClick={() => {
                setUnreadCount(0);
                setActiveMenuId(null);
              }}
              className="p-4 flex-1 overflow-y-auto space-y-4 bg-[#061812]/70 scrollbar-thin scrollbar-thumb-[#1A4035]"
            >
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-noor-muted/60">
                  <MessageSquare size={36} className="text-[#E8BD4B]/40 mb-1" />
                  <p className="text-sm font-semibold text-noor-ivory">Live Chat is Ready!</p>
                  <p className="text-xs max-w-xs">Send a message below and watch it sync instantly via Supabase Realtime.</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMyMessage = userProfile && msg.email === userProfile.email;

                  return (
                    <div key={msg.id} className="flex gap-3 items-start group relative animate-in fade-in duration-200">
                      <div className="w-8 h-8 rounded-full bg-[#103329] border border-[#1A4035] flex items-center justify-center text-xs text-[#E8BD4B] font-bold flex-shrink-0 shadow-sm mt-1">
                        {msg.user.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 max-w-[88%] bg-[#0B2820] border border-[#1A4035] rounded-2xl rounded-tl-sm p-3.5 space-y-2 shadow-md relative">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs pr-5">
                          <span className="font-bold text-[#E8BD4B]">{msg.user}</span>
                          <span className="font-medium text-noor-muted/70">{msg.time}</span>
                        </div>

                        {msg.text && <p className="text-sm text-noor-ivory/95 leading-relaxed break-words">{msg.text}</p>}

                        {msg.linkUrl && (
                          <a
                            href={msg.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 flex items-center gap-3 p-2.5 rounded-xl bg-[#103329] border border-[#E8BD4B]/30 text-[#E8BD4B] hover:bg-[#1A4035] transition-all shadow-sm"
                          >
                            <div className="p-2 rounded-lg bg-[#E8BD4B]/10 text-[#E8BD4B]">
                              <Share2 size={16} />
                            </div>
                            <div className="overflow-hidden text-xs truncate flex-1">
                              <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Islamic Reference Link</span>
                              <span className="text-noor-ivory group-hover:underline truncate block break-all">{msg.linkUrl}</span>
                            </div>
                          </a>
                        )}

                        {isMyMessage && (
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === msg.id ? null : msg.id);
                              }}
                              className="p-1 rounded-md text-noor-muted hover:text-noor-ivory transition-colors hover:bg-[#103329]"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {activeMenuId === msg.id && (
                              <div className="absolute right-0 top-6 z-20 bg-[#103329] border border-[#1A4035] rounded-xl shadow-xl py-1 w-36 animate-in fade-in zoom-in-95">
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium"
                                >
                                  <Trash2 size={13} /> Delete for everyone
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Controls */}
            <div className="p-3 sm:p-4 border-t border-[#1A4035] bg-[#0B2820] space-y-2 z-10">
              {chatError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 font-medium">
                  <ShieldAlert size={16} /> {chatError}
                </div>
              )}
              <form onSubmit={handleSendTrigger} className="flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Say something in live chat..."
                  className="flex-1 px-3.5 py-3 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#E8BD4B] text-[#061812] font-bold hover:bg-[#f2ca5c] transition-all shadow-md flex items-center justify-center gap-1"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
