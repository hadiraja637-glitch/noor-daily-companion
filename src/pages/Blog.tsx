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
  ImageIcon,
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
  // --- Persistent User Profile ---
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('noor_user_nickname') || '');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('noor_user_email') || '');
  const [isProfileSet, setIsProfileSet] = useState<boolean>(() => !!localStorage.getItem('noor_user_nickname'));

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [tempNickname, setTempNickname] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  // --- Real-time Public Chat State ---
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

  // --- Blog & Search State ---
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // --- Article Submit Modal State ---
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

  // --- BACKEND REAL-TIME SYNC API HOOK (Broadcast Channel for Multi-tab / Public Sync) ---
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

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Profile Save
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

  // Handle Send Message
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

  // Filter Posts
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

  // Submit Article Handler
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-emerald-600" /> Islamic Knowledge & Reflections
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Explore authentic articles, community posts, and daily reminders.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs sm:text-sm hover:bg-emerald-700 transition shadow-sm active:scale-95 whitespace-nowrap"
            >
              <PlusCircle size={16} /> Submit Article
            </button>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles or authors..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
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
                  className="cursor-pointer group relative rounded-2xl overflow-hidden bg-white border border-slate-100 hover:border-emerald-500 transition grid grid-cols-1 md:grid-cols-12 shadow-sm hover:shadow-md"
                >
                  <div className="md:col-span-5 h-48 md:h-auto overflow-hidden relative">
                    <img
                      src={feat.img}
                      alt={feat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="md:col-span-7 p-5 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {feat.category}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Clock size={12} /> {feat.readTime}
                        </span>
                      </div>
                      <h2 className="font-bold text-lg sm:text-xl text-slate-800 group-hover:text-emerald-600 transition">
                        {feat.title}
                      </h2>
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-2">{feat.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <User size={13} className="text-emerald-600" /> {feat.author}
                      </span>
                      <span>{feat.date}</span>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-slate-100">
              No articles found matching your query.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="cursor-pointer group rounded-2xl bg-white border border-slate-100 hover:border-emerald-500 transition flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="h-40 overflow-hidden relative bg-slate-100">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-semibold text-slate-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.readTime}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-emerald-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[140px] flex items-center gap-1">
                      <User size={12} /> {post.author}
                    </span>
                    <span className="text-emerald-600 font-medium group-hover:underline">Read →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Professional Real-time Public Lounge */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col h-[600px] overflow-hidden sticky top-6">
            {/* Header with Unique Teal/Emerald Unread Badge */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm tracking-wide">Public Islamic Lounge</h2>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Sync Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm border border-teal-300/30 backdrop-blur-md animate-pulse"
                  >
                    +{unreadCount} new
                  </button>
                )}

                {isProfileSet && (
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    👤 {userName}
                  </button>
                )}
              </div>
            </div>

            {/* Chat Display Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60" onClick={() => setUnreadCount(0)}>
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 text-xs mt-16">
                  No messages yet. Be the first to start the discussion!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderName === userName;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[11px] font-medium text-slate-400 mb-0.5 px-1">
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                        <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Clean Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isProfileSet ? 'Type a public message...' : 'Set nickname to start chatting...'}
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Persistent Profile Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <User className="text-emerald-600" /> Set Your Display Profile
              </h3>
              {isProfileSet && (
                <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Save your nickname to participate in public discussions. Your profile identity will be remembered locally.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nickname / Display Name *</label>
                <input
                  type="text"
                  required
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="e.g. Ali Ahmed"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm transition mt-2 shadow-sm"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULL ARTICLE VIEW MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-slate-800 border border-slate-100">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            >
              <X size={18} />
            </button>

            <div className="h-52 sm:h-64 rounded-xl overflow-hidden bg-slate-100">
              <img src={selectedPost.img} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {selectedPost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold pt-1">{selectedPost.title}</h2>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  By <strong className="text-slate-700">{selectedPost.author}</strong>
                </span>
                <span>
                  {selectedPost.date} • {selectedPost.readTime}
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-800 border border-slate-100">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Submit Your Article</h2>
              <p className="text-slate-500 text-xs">Share your beneficial knowledge and thoughts with the community.</p>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3 text-emerald-600">
                <Check size={36} className="mx-auto animate-bounce" />
                <p className="text-sm font-semibold">Article Submitted Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-600 mb-1 text-xs font-medium">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Benefits of Giving Charity in Secret"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 text-xs font-medium">Author Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Brother Ali"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 text-xs font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
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
                  <label className="block text-slate-600 mb-1 text-xs font-medium flex items-center gap-1">
                    <ImageIcon size={12} /> Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 text-xs font-medium">Article Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your main article text here..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send size={15} /> Publish Article
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
