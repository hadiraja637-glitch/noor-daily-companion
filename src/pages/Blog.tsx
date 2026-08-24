import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  PlusCircle,
  Clock,
  X,
  Check,
  BookOpen,
  Send,
  User,
  MessageSquare,
  ImageIcon
} from 'lucide-react';

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
  senderName: string;
  senderEmail?: string;
  message: string;
  timestamp: string;
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

const CATEGORIES = ['All', 'Spiritual Growth', 'Salah & Prayer', 'Duas & Azkar', 'Community & Life'];

 const Blog: React.FC = () => {
  // Persistent User Profile State
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('noor_user_nickname') || '');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('noor_user_email') || '');
  const [isProfileSet, setIsProfileSet] = useState<boolean>(() => !!localStorage.getItem('noor_user_nickname'));

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [tempNickname, setTempNickname] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  // Real-time Public Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('noor_public_chat_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Blog & Search State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Submit Article Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Spiritual Growth',
    author: '',
    readTime: '3 min read',
    excerpt: '',
    content: '',
    img: '',
  });

  // Load Saved Posts
  useEffect(() => {
    try {
      const savedBlogs = localStorage.getItem('noor_user_blogs');
      if (savedBlogs) {
        const parsed = JSON.parse(savedBlogs);
        if (Array.isArray(parsed)) {
          setPosts([...parsed, ...DEFAULT_POSTS]);
        } else {
          setPosts(DEFAULT_POSTS);
        }
      } else {
        setPosts(DEFAULT_POSTS);
      }
    } catch {
      setPosts(DEFAULT_POSTS);
    }
  }, []);

  // Broadcast Channel Hook
  useEffect(() => {
    const channel = new BroadcastChannel('noor_public_chat_channel');

    channel.onmessage = (event) => {
      const incomingMessage: ChatMessage = event.data;
      setMessages((prev) => {
        const updated = [...prev, incomingMessage];
        localStorage.setItem('noor_public_chat_messages', JSON.stringify(updated));
        return updated;
      });
      setUnreadCount((prev) => prev + 1);
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempNickname.trim()) return;

    localStorage.setItem('noor_user_nickname', tempNickname.trim());
    if (tempEmail.trim()) {
      localStorage.setItem('noor_user_email', tempEmail.trim());
    }

    setUserName(tempNickname.trim());
    setUserEmail(tempEmail.trim());
    setIsProfileSet(true);
    setShowProfileModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!isProfileSet) {
      setShowProfileModal(true);
      return;
    }

    const msgObj: ChatMessage = {
      id: Date.now().toString(),
      senderName: userName,
      senderEmail: userEmail,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, msgObj];
    setMessages(updatedMessages);
    localStorage.setItem('noor_public_chat_messages', JSON.stringify(updatedMessages));

    try {
      const channel = new BroadcastChannel('noor_public_chat_channel');
      channel.postMessage(msgObj);
      channel.close();
    } catch (err) {
      console.error('Broadcast error:', err);
    }

    setNewMessage('');
  };

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
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      category: formData.category,
      excerpt: formData.excerpt.trim() || formData.content.trim().slice(0, 110) + '...',
      content: formData.content.trim(),
      author: formData.author.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: formData.readTime || '3 min read',
      img: formData.img.trim() || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);

    try {
      const existingUserBlogs = JSON.parse(localStorage.getItem('noor_user_blogs') || '[]');
      localStorage.setItem('noor_user_blogs', JSON.stringify([newPost, ...existingUserBlogs]));
    } catch {
      localStorage.setItem('noor_user_blogs', JSON.stringify([newPost]));
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitOpen(false);
      setFormData({
        title: '',
        category: 'Spiritual Growth',
        author: '',
        readTime: '3 min read',
        excerpt: '',
        content: '',
        img: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- DEEP AESTHETIC NOOR HERO BANNER --- */}
        <div className="text-center py-10 px-4 rounded-3xl bg-gradient-to-b from-[#042821] via-[#03201a] to-[#021814] border border-[#0d4a3c]/60 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#021511] border border-amber-500/30 text-amber-400 text-xs font-medium mb-5">
            <BookOpen size={13} /> Islamic Insights & Knowledge Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-wide text-[#f7e8cf] drop-shadow-sm mb-3">
            Knowledge & Reflections
          </h1>
          <p className="text-emerald-200/70 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed mb-8">
            Read verified Islamic posts, publish your reflections, and participate in our moderated Islamic chat room.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-6 py-2.5 rounded-full bg-amber-400 text-[#021814] font-semibold text-xs sm:text-sm hover:bg-amber-300 transition shadow-lg active:scale-95 flex items-center gap-2"
            >
              <PlusCircle size={15} /> Submit Your Article
            </button>

            <a
              href="#lounge"
              className="px-6 py-2.5 rounded-full bg-[#021511]/90 text-emerald-300 border border-[#0a4034]/80 hover:bg-[#03201a] font-medium text-xs sm:text-sm transition flex items-center gap-2"
            >
              <MessageSquare size={15} /> Public Islamic Chat
            </a>
          </div>
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or authors..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#04241d] border border-[#0a4034]/70 text-xs sm:text-sm text-slate-100 placeholder-emerald-600 focus:outline-none focus:border-amber-400/80 transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-[#021814] font-semibold shadow-md'
                    : 'bg-[#04241d] text-emerald-200/80 border border-[#0a4034]/60 hover:bg-[#063329]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- MAIN LAYOUT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* BLOGS CONTENT AREA */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FEATURED POST */}
            {filteredPosts.find((p) => p.featured) && activeCategory === 'All' && !searchQuery && (
              (() => {
                const feat = filteredPosts.find((p) => p.featured)!;
                return (
                  <div
                    onClick={() => setSelectedPost(feat)}
                    className="cursor-pointer group relative rounded-3xl overflow-hidden bg-[#04241d] border border-[#0a4034]/70 hover:border-amber-400/40 transition grid grid-cols-1 md:grid-cols-12 shadow-xl"
                  >
                    <div className="md:col-span-5 h-52 md:h-auto overflow-hidden relative bg-[#021511]">
                      <img
                        src={feat.img}
                        alt={feat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                      />
                    </div>
                    <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-wider font-semibold text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20">
                            {feat.category.toUpperCase()}
                          </span>
                          <span className="text-emerald-400/80 text-xs flex items-center gap-1">
                            <Clock size={12} /> {feat.readTime}
                          </span>
                        </div>
                        <h2 className="font-serif font-normal text-xl sm:text-2xl text-[#f7e8cf] group-hover:text-amber-300 transition leading-snug">
                          {feat.title}
                        </h2>
                        <p className="text-emerald-200/70 text-xs sm:text-sm line-clamp-2 leading-relaxed">{feat.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#093d31]/80 text-xs text-emerald-400/80">
                        <span className="flex items-center gap-1.5">
                          <User size={13} className="text-amber-400" /> {feat.author}
                        </span>
                        <span>{feat.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* BLOGS GRID */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-emerald-400/80 text-xs sm:text-sm bg-[#04241d] rounded-3xl border border-[#0a4034]/60">
                No articles found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer group rounded-3xl bg-[#04241d] border border-[#0a4034]/70 hover:border-amber-400/40 transition flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
                  >
                    <div>
                      <div className="h-44 overflow-hidden relative bg-[#021511]">
                        <img
                          src={post.img}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-semibold text-amber-300 bg-[#021814]/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-amber-400/20">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-emerald-400/80">
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {post.readTime}
                          </span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="font-serif font-normal text-base sm:text-lg text-[#f7e8cf] group-hover:text-amber-300 transition line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-emerald-200/70 text-xs line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-[#093d31]/60 mt-3 flex items-center justify-between text-xs text-emerald-400/80">
                      <span className="truncate max-w-[140px] flex items-center gap-1">
                        <User size={12} className="text-amber-400" /> {post.author}
                      </span>
                      <span className="text-amber-400 font-medium group-hover:underline">Read →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CHAT LOUNGE SIDEBAR */}
          <div id="lounge" className="lg:col-span-1">
            <div className="bg-[#04241d] rounded-3xl shadow-2xl border border-[#0a4034]/80 flex flex-col h-[580px] overflow-hidden sticky top-6">
              
              {/* Header */}
              <div className="p-4 bg-[#021511] text-slate-100 flex justify-between items-center border-b border-[#0a4034]/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#04241d] rounded-xl text-amber-400 border border-amber-400/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xs sm:text-sm tracking-wide text-[#f7e8cf]">Public Islamic Lounge</h2>
                    <span className="text-[10px] text-emerald-400/80 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Sync Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="bg-amber-400 text-[#021814] text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
                    >
                      +{unreadCount} new
                    </button>
                  )}

                  {isProfileSet && (
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="text-xs bg-[#04241d] hover:bg-[#063329] text-emerald-200 px-2.5 py-1 rounded-lg border border-[#0a4034]/70 transition"
                    >
                      👤 {userName}
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#021511]/50" onClick={() => setUnreadCount(0)}>
                {messages.length === 0 ? (
                  <div className="text-center text-emerald-500/60 text-xs mt-20">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderName === userName;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-medium text-emerald-400/70 mb-0.5 px-1">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-sm ${
                            isMe
                              ? 'bg-amber-400 text-[#021814] font-medium rounded-tr-none'
                              : 'bg-[#07362c] text-slate-100 border border-[#0b4a3c]/60 rounded-tl-none'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.message}</p>
                          <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-[#021814]/70' : 'text-emerald-400/60'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#021511] border-t border-[#0a4034]/80 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isProfileSet ? 'Type a public message...' : 'Set nickname to start chatting...'}
                  className="flex-1 px-3.5 py-2 bg-[#04241d] border border-[#0a4034]/70 rounded-xl text-xs text-slate-100 placeholder-emerald-600 focus:outline-none focus:border-amber-400/80 transition"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-[#021814] p-2 rounded-xl transition shadow font-bold active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROFILE SETUP MODAL --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#04241d] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#0a4034]/80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-[#f7e8cf] text-sm flex items-center gap-2">
                <User className="text-amber-400" size={16} /> Set Your Display Profile
              </h3>
              {isProfileSet && (
                <button onClick={() => setShowProfileModal(false)} className="text-emerald-400 hover:text-slate-100">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-emerald-200/70 mb-4 leading-relaxed">
              Save your nickname to participate in public discussions.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-emerald-300 block mb-1">Nickname / Display Name *</label>
                <input
                  type="text"
                  required
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="e.g. Ali Ahmed"
                  className="w-full px-3 py-2 bg-[#021511] border border-[#0a4034]/70 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-emerald-300 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full px-3 py-2 bg-[#021511] border border-[#0a4034]/70 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-[#021814] font-semibold py-2.5 rounded-xl text-xs transition mt-2 shadow"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FULL ARTICLE VIEW MODAL --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#04241d] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-slate-100 border border-[#0a4034]/80">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#021511] text-emerald-400 hover:text-amber-400 transition"
            >
              <X size={16} />
            </button>

            <div className="h-52 sm:h-64 rounded-2xl overflow-hidden bg-[#021511]">
              <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 border-b border-[#0a4034]/80 pb-4">
              <span className="text-xs text-amber-300 font-medium bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20">
                {selectedPost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-normal pt-2 text-[#f7e8cf]">{selectedPost.title}</h2>
              <div className="flex items-center justify-between text-xs text-emerald-400/80 pt-1">
                <span>
                  By <strong className="text-amber-400 font-medium">{selectedPost.author}</strong>
                </span>
                <span>
                  {selectedPost.date} • {selectedPost.readTime}
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed whitespace-pre-line space-y-3">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBMIT ARTICLE MODAL --- */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#04241d] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100 border border-[#0a4034]/80">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#021511] text-emerald-400 hover:text-amber-400 transition"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-serif font-normal text-[#f7e8cf]">Submit Your Article</h2>
              <p className="text-emerald-300/70 text-xs">Share your beneficial knowledge and thoughts with the community.</p>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3 text-amber-400">
                <Check size={32} className="mx-auto animate-bounce" />
                <p className="text-sm font-medium">Article Submitted Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-emerald-300 mb-1 text-xs font-medium">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Benefits of Giving Charity in Secret"
                    className="w-full px-3 py-2 rounded-xl bg-[#021511] border border-[#0a4034]/70 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-300 mb-1 text-xs font-medium">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Brother Ali"
                      className="w-full px-3 py-2 rounded-xl bg-[#021511] border border-[#0a4034]/70 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 mb-1 text-xs font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#021511] border border-[#0a4034]/70 text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-300 mb-1 text-xs font-medium flex items-center gap-1">
                    <ImageIcon size={12} /> Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#021511] border border-[#0a4034]/70 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 mb-1 text-xs font-medium">Article Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your main article text here..."
                    className="w-full px-3 py-2 rounded-xl bg-[#021511] border border-[#0a4034]/70 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#021814] font-semibold text-xs sm:text-sm transition shadow flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Publish Article
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Blog;
