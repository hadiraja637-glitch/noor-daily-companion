import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare, ShieldAlert, Link as LinkIcon, Image as ImageIcon, Sparkles, Share2 } from 'lucide-react';

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
  text: string;
  time: string;
  linkUrl?: string;
  isSelf?: boolean;
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
  {
    id: '2',
    title: 'Understanding Tahajjud: The Miracle Prayer of the Night',
    category: 'Salah & Prayer',
    excerpt: 'Discover the immense blessings, spiritual tranquility, and steps to wake up for Tahajjud prayer.',
    content: `Tahajjud is considered one of the most powerful voluntary prayers in Islam. Allah descends to the lowest heaven during the last third of the night, asking: "Who is calling upon Me so that I may answer him?"\n\n**Tips to Wake Up for Tahajjud:**\n- Sleep early with Wudu.\n- Set an intention (Niyyah) before sleeping.\n- Keep your alarm out of arm's reach.`,
    author: 'Fatima Noor',
    date: 'Aug 12, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'The Power of Istighfar: Unlocking Barakah and Peace',
    category: 'Duas & Azkar',
    excerpt: 'How seeking forgiveness daily opens closed doors, relieves stress, and brings unexpected provisions.',
    content: `Istighfar (seeking forgiveness) is not only for sins—it is a spiritual remedy for worry, debt, and hardship. Prophet Muhammad (PBUH) used to seek forgiveness more than 70 times a day.\n\n**Benefits mentioned in Quran (Surah Nuh):**\n- Sends down rain and wealth\n- Grants righteous offspring\n- Bestows peace of mind`,
    author: 'Hassan Raza',
    date: 'Aug 05, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  },
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: '1',
    user: 'Brother Hamza',
    text: 'Assalamu Alaikum! Share authentic Quran lectures or Bayan links here.',
    time: '10:15 AM',
  },
  {
    id: '2',
    user: 'Sister Ayesha',
    text: 'Wa Alaikum Assalam! Must watch this Bayan on Surah Ar-Rahman:',
    linkUrl: 'https://youtube.com/watch?v=demo-bayan',
    time: '10:18 AM',
  },
];

const CATEGORIES = ['All', 'Spiritual Growth', 'Salah & Prayer', 'Duas & Azkar', 'Community & Life'];

// Moderation Keywords Filter
const BANNED_KEYWORDS = ['bf', 'gf', 'dating', 'relationship', 'love u', 'sexy', 'number', 'whatsapp', 'fuck', 'shit', 'abuse', 'single', 'meet me'];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Chat
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [newMsg, setNewMsg] = useState('');
  const [userName, setUserName] = useState('');
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form State
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

    const savedChat = localStorage.getItem('noor_community_chat');
    if (savedChat) {
      try {
        setChatMessages(JSON.parse(savedChat));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isChatOpen) {
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

  // URL Extraction Regex
  const extractUrl = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    return urlMatch ? urlMatch[0] : null;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setChatError('');

    if (!newMsg.trim()) return;

    const lowerMsg = newMsg.toLowerCase();
    const containsBadWords = BANNED_KEYWORDS.some((word) => lowerMsg.includes(word));

    if (containsBadWords) {
      setChatError('Strict Moderation: Personal dating, contact sharing & informal chat are prohibited!');
      return;
    }

    const detectedLink = extractUrl(newMsg);
    const cleanText = newMsg.replace(/(https?:\/\/[^\s]+)/g, '').trim();

    const messageObj: ChatMessage = {
      id: Date.now().toString(),
      user: userName.trim() || 'Servant of Allah',
      text: cleanText || (detectedLink ? 'Shared an Islamic Resource Link:' : newMsg),
      linkUrl: detectedLink || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = [...chatMessages, messageObj];
    setChatMessages(updatedChat);
    localStorage.setItem('noor_community_chat', JSON.stringify(updatedChat));
    setNewMsg('');
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-8 sm:py-12 mb-6 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <BookOpen size={13} /> Islamic Insights & Knowledge Portal
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Knowledge & Reflections</h1>
          <p className="text-noor-muted text-xs sm:text-sm max-w-xl mx-auto">
            Read verified Islamic posts, publish your reflections, and participate in our moderated Islamic chat room.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-xs sm:text-sm hover:bg-[#f2ca5c] transition-all shadow-md"
            >
              <PlusCircle size={16} /> Submit Your Article
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#103329] border border-[#E8BD4B]/40 text-[#E8BD4B] font-semibold text-xs sm:text-sm hover:bg-[#1A4035] transition-all shadow-md"
            >
              <MessageSquare size={16} /> Public Islamic Chat
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-6">
        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-xs text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#E8BD4B]/20 border border-[#E8BD4B]/50 text-[#E8BD4B]'
                    : 'bg-[#103329]/60 border border-[#1A4035]/60 text-noor-muted hover:text-noor-ivory'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.find((p) => p.featured) && activeCategory === 'All' && !searchQuery && (
          (() => {
            const feat = filteredPosts.find((p) => p.featured)!;
            return (
              <div
                onClick={() => setSelectedPost(feat)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden bg-[#103329] border border-[#E8BD4B]/40 hover:border-[#E8BD4B] transition-all grid grid-cols-1 md:grid-cols-12 shadow-xl"
              >
                <div className="md:col-span-5 h-52 md:h-auto overflow-hidden relative">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#E8BD4B] bg-[#E8BD4B]/10 px-2 py-0.5 rounded-md border border-[#E8BD4B]/20">
                        {feat.category}
                      </span>
                      <span className="text-noor-muted text-xs flex items-center gap-1"><Clock size={12} /> {feat.readTime}</span>
                    </div>
                    <h2 className="font-display text-lg sm:text-2xl font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors">
                      {feat.title}
                    </h2>
                    <p className="text-noor-muted text-xs sm:text-sm line-clamp-2">{feat.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1A4035]/60 text-xs text-noor-muted">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-[#E8BD4B]" /> {feat.author}</span>
                    <span>{feat.date}</span>
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group rounded-2xl bg-[#103329] border border-[#1A4035] hover:border-[#E8BD4B]/40 transition-all flex flex-col justify-between overflow-hidden shadow-md"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-[#0B2820]">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <span className="absolute top-3 left-3 text-[10px] font-semibold text-noor-ivory bg-[#061812]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#1A4035]">
                    {post.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-noor-muted">
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-noor-muted text-xs line-clamp-2">{post.excerpt}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#1A4035]/40 mt-2 flex items-center justify-between text-xs text-noor-muted">
                <span className="truncate max-w-[140px] flex items-center gap-1"><User size={12} /> {post.author}</span>
                <span className="text-[#E8BD4B] font-medium group-hover:underline">Read Article →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLE FULL READ MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-4 shadow-2xl relative text-noor-ivory">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory"
            >
              <X size={18} />
            </button>

            <div className="h-48 sm:h-64 rounded-xl overflow-hidden">
              <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 border-b border-[#1A4035] pb-4">
              <span className="text-xs text-[#E8BD4B] font-semibold bg-[#E8BD4B]/10 px-2.5 py-1 rounded-full border border-[#E8BD4B]/20">
                {selectedPost.category}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold pt-1">{selectedPost.title}</h2>
              <div className="flex items-center justify-between text-xs text-noor-muted pt-1">
                <span>By <strong className="text-noor-ivory">{selectedPost.author}</strong></span>
                <span>{selectedPost.date} • {selectedPost.readTime}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-noor-ivory/90 leading-relaxed whitespace-pre-line space-y-3">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#E8BD4B]/30 rounded-2xl max-w-lg w-full p-5 sm:p-7 space-y-4 shadow-2xl relative text-noor-ivory">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#E8BD4B]">Submit Your Article</h2>
              <p className="text-noor-muted text-xs">Share your Islamic thoughts or reflections with the community.</p>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3 text-emerald-400">
                <Check size={36} className="mx-auto animate-bounce" />
                <p className="text-sm font-semibold">Article Published Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-noor-muted mb-1 text-xs">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Benefits of Giving Charity in Secret"
                    className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] focus:outline-none focus:border-[#E8BD4B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-noor-muted mb-1 text-xs">Your Name / Author *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Brother Ali"
                      className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] focus:outline-none focus:border-[#E8BD4B]"
                    />
                  </div>

                  <div>
                    <label className="block text-noor-muted mb-1 text-xs">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c} className="bg-[#0B2820] text-noor-ivory">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-noor-muted mb-1 text-xs flex items-center gap-1">
                    <ImageIcon size={12} /> Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] focus:outline-none focus:border-[#E8BD4B]"
                  />
                </div>

                <div>
                  <label className="block text-noor-muted mb-1 text-xs">Article Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article body here..."
                    className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] focus:outline-none focus:border-[#E8BD4B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-xs sm:text-sm hover:bg-[#f2ca5c] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={15} /> Publish Article
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODERN TELEGRAM/DISCORD STYLE PUBLIC CHAT MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#081F18] border border-[#1A4035] rounded-3xl max-w-lg w-full h-[88vh] flex flex-col justify-between shadow-2xl relative text-noor-ivory overflow-hidden">
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-[#1A4035] bg-[#0B2820]/90 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E8BD4B]/15 border border-[#E8BD4B]/40 flex items-center justify-center text-[#E8BD4B] shadow-inner">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-noor-ivory flex items-center gap-2">
                    Islamic Community Hub
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-noor-muted">Sharing Knowledge & Authentic Links</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-[#061812]/70 scrollbar-thin scrollbar-thumb-[#1A4035]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2.5 items-start">
                  {/* User Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#103329] border border-[#1A4035] flex items-center justify-center text-xs text-[#E8BD4B] font-bold flex-shrink-0 mt-0.5">
                    {msg.user.charAt(0).toUpperCase()}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex-1 bg-[#0B2820] border border-[#1A4035] rounded-2xl rounded-tl-xs p-3 space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#E8BD4B]">{msg.user}</span>
                      <span className="text-[10px] text-noor-muted/60">{msg.time}</span>
                    </div>

                    {msg.text && <p className="text-xs text-noor-ivory/90 leading-relaxed break-words">{msg.text}</p>}

                    {/* Detected Link Attachment Card */}
                    {msg.linkUrl && (
                      <a
                        href={msg.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 flex items-center gap-2.5 p-2 rounded-xl bg-[#103329] border border-[#E8BD4B]/30 text-[#E8BD4B] hover:bg-[#1A4035] transition-all group"
                      >
                        <div className="p-1.5 rounded-lg bg-[#E8BD4B]/10 text-[#E8BD4B]">
                          <Share2 size={14} />
                        </div>
                        <div className="overflow-hidden text-xs truncate flex-1">
                          <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Islamic Reference Link</span>
                          <span className="text-noor-ivory group-hover:underline truncate block">{msg.linkUrl}</span>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Controls */}
            <div className="p-3 border-t border-[#1A4035] bg-[#0B2820] space-y-2">
              {chatError && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                  <ShieldAlert size={14} /> {chatError}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="space-y-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name (e.g. Brother Ali)"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#061812] border border-[#1A4035] text-xs text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Write a message or paste YouTube/Islamic link..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-xs text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-xs hover:bg-[#f2ca5c] transition-all shadow-md flex items-center justify-center gap-1"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
