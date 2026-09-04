import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare,
  ShieldAlert
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
    content: `Maintaining a strong spiritual connection in today's fast-paced world can feel challenging. However, Islam emphasizes consistency in small deeds over sporadic large efforts.\n\n 1. **Start with Morning & Evening Adhkar:** Protect your mind and soul by reciting daily authentic supplications.\n 2. **Mindful Salah:** Treat prayer not as a checklist item, but as a direct conversation with the Creator.\n 3. **Daily Quran Recitation:** Even reading 5 verses a day with translation keeps the divine light alive in your chest.\n 4. **Constant Dhikr:** Keep your tongue moist with SubhanAllah, Alhamdulillah, and Allahu Akbar throughout your commute or work.\n 5. **Nightly Self-Reflection (Muhasabah):** Take 2 minutes before sleeping to thank Allah for blessings and seek forgiveness for shortcomings.`,
    author: 'Sheikh Omar Al-Sayed',
    date: 'Aug 18, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
];

const CATEGORIES = ['All', 'Spiritual Growth', 'Salah & Prayer', 'Duas & Azkar', 'Community & Life'];

const BANNED_KEYWORDS = [
  'bf', 'gf', 'dating', 'relationship', 'love u', 'sexy', 'number', 'whatsapp',
  'fuck', 'shit', 'abuse', 'single', 'meet me'
];

const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';

// Helper function to safely get Supabase Client
const getSupabaseClient = () => {
  const supWindow = (window as unknown as { supabase?: any }).supabase;
  if (!supWindow) return null;
  return supWindow.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // User & Chat States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileInput, setProfileInput] = useState({ name: '', email: '' });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [bannedAlert, setBannedAlert] = useState<boolean>(false);

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

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load Saved Profile
  useEffect(() => {
    const saved = localStorage.getItem('noor_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Profile parse error', e);
      }
    }
  }, []);

  // Fetch Supabase Blogs
  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const supabaseClient = getSupabaseClient();
        if (!supabaseClient) {
          if (isMounted) {
            setPosts(DEFAULT_POSTS);
            setIsLoading(false);
          }
          return;
        }

        const { data, error } = await supabaseClient
          .from('blogs')
          .select('id, title, category, excerpt, content, author, date, read_time, img, featured')
          .order('created_at', { ascending: false });

        if (!error && data && isMounted) {
          const formatted: BlogPost[] = data.map((b: any) => ({
            id: b.id.toString(),
            title: b.title,
            category: b.category,
            excerpt: b.excerpt,
            content: b.content,
            author: b.author,
            date: b.date,
            readTime: b.read_time || '3 min read',
            img: b.img || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
            featured: b.featured || false,
          }));
          setPosts([...formatted, ...DEFAULT_POSTS]);
        } else if (isMounted) {
          setPosts(DEFAULT_POSTS);
        }
      } catch (e) {
        console.error('Error loading blogs:', e);
        if (isMounted) setPosts(DEFAULT_POSTS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  // Fetch Live Chat Messages from Supabase
  useEffect(() => {
    if (!isChatOpen) return;

    const fetchChatMessages = async () => {
      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) return;

      const { data, error } = await supabaseClient
        .from('chat_messages')
        .select('id, user, email, text, time, link_url')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const formattedMsgs: ChatMessage[] = data.map((m: any) => ({
          id: m.id.toString(),
          user: m.user,
          email: m.email,
          text: m.text,
          time: m.time,
          linkUrl: m.link_url,
        }));
        setChatMessages(formattedMsgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    fetchChatMessages();
  }, [isChatOpen]);

  // Submit Article Live to Supabase
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) return;

    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) return;

    const newPostData = {
      title: formData.title,
      category: formData.category,
      excerpt: formData.excerpt || formData.content.slice(0, 110) + '...',
      content: formData.content,
      author: formData.author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      read_time: formData.readTime,
      img: formData.img.trim() || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    };

    const { data, error } = await supabaseClient.from('blogs').insert([newPostData]).select();

    if (!error && data && data.length > 0) {
      const createdPost: BlogPost = {
        id: data[0].id.toString(),
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileInput.name || !profileInput.email) return;
    const profile = { name: profileInput.name, email: profileInput.email };
    setUserProfile(profile);
    localStorage.setItem('noor_user_profile', JSON.stringify(profile));
    setIsProfileModalOpen(false);
    setIsChatOpen(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !linkInput.trim()) return;
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    const lowerText = (newMessage + ' ' + linkInput).toLowerCase();
    const hasBanned = BANNED_KEYWORDS.some((kw) => lowerText.includes(kw));

    if (hasBanned) {
      setBannedAlert(true);
      setTimeout(() => setBannedAlert(false), 3000);
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const supabaseClient = getSupabaseClient();

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('chat_messages')
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
          id: data[0].id.toString(),
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
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Top Banner */}
      <div className="py-8 sm:py-12 mb-6 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="relative max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <BookOpen size={13} /> Islamic Knowledge & Article Sharing Portal
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Knowledge & Reflections</h1>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-xs sm:text-sm hover:bg-[#f2ca5c] transition-all shadow-md"
            >
              <PlusCircle size={16} /> Submit Article
            </button>
            <button
              onClick={() => {
                if (!userProfile) setIsProfileModalOpen(true);
                else setIsChatOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#103329] border border-[#1A4035] text-[#E8BD4B] font-semibold text-xs sm:text-sm hover:border-[#E8BD4B]/50 transition-all"
            >
              <MessageSquare size={16} /> Public Community Chat
            </button>
          </div>
        </div>
      </div>

      {/* ADSENSE CLS RESERVED SLOT */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="w-full min-h-[90px] bg-[#0B2820]/40 border border-[#1A4035]/40 rounded-xl flex items-center justify-center text-noor-muted text-xs">
          <span>Ad Advertisement Slot (90px Reserved Height - Zero CLS)</span>
        </div>
      </div>

      {/* Main Grid & Filters */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-[#E8BD4B]/20 border border-[#E8BD4B]/50 text-[#E8BD4B]' : 'bg-[#103329]/60 border border-[#1A4035]/60 text-noor-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-[#103329] border border-[#1A4035] h-80 animate-pulse p-4 space-y-4">
                <div className="w-full h-40 bg-[#0B2820] rounded-xl" />
                <div className="w-3/4 h-5 bg-[#0B2820] rounded" />
                <div className="w-full h-4 bg-[#0B2820] rounded" />
                <div className="w-1/2 h-4 bg-[#0B2820] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer group rounded-2xl bg-[#103329] border border-[#1A4035] hover:border-[#E8BD4B]/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
              >
                <div>
                  <div className="h-48 overflow-hidden relative bg-[#0B2820]">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-noor-ivory bg-[#061812]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#1A4035]">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-noor-muted font-medium">
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-noor-muted text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-[#1A4035]/40 mt-2 flex items-center justify-between text-xs text-noor-muted font-medium">
                  <span className="truncate max-w-[140px] flex items-center gap-1.5"><User size={14} className="text-[#E8BD4B]/70" /> {post.author}</span>
                  <span className="text-[#E8BD4B]">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-5 relative text-noor-ivory">
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory">
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
              <div className="flex items-center justify-between text-sm text-noor-muted pt-1">
                <span className="flex items-center gap-2"><User size={15} className="text-[#E8BD4B]" /> {selectedPost.author}</span>
                <span>{selectedPost.date} • {selectedPost.readTime}</span>
              </div>
            </div>

            <div className="w-full min-h-[250px] bg-[#103329]/60 border border-[#1A4035] rounded-xl flex items-center justify-center text-noor-muted text-xs">
              <span>In-Article Ad Slot (250px Height Reserved)</span>
            </div>

            <div className="prose prose-invert max-w-none text-sm sm:text-base text-noor-ivory/90 leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#E8BD4B]/30 rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-7 space-y-4 relative text-noor-ivory">
            <button onClick={() => setIsSubmitOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-[#103329] text-noor-muted hover:text-noor-ivory">
              <X size={18} />
            </button>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#E8BD4B]">Submit Your Article</h2>
            {submittedSuccess ? (
              <div className="py-10 text-center space-y-3 text-emerald-400">
                <Check size={48} className="mx-auto bg-emerald-400/10 p-3 rounded-full border border-emerald-400/20" />
                <p className="text-base sm:text-lg font-semibold">Article Published Live for All Devices!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-4">
                <div>
                  <label className="block text-noor-muted mb-1 text-xs font-medium">Article Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title..." className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory" />
                </div>
                <div>
                  <label className="block text-noor-muted mb-1 text-xs font-medium">Author Name *</label>
                  <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Your Name" className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory" />
                </div>
                <div>
                  <label className="block text-noor-muted mb-1 text-xs font-medium">Content *</label>
                  <textarea rows={5} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write full article..." className="w-full px-3.5 py-2.5 rounded-xl bg-[#103329] border border-[#1A4035] text-sm text-noor-ivory resize-none" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-[#E8BD4B] text-[#061812] font-bold text-sm hover:bg-[#f2ca5c] flex items-center justify-center gap-2">
                  <Send size={18} /> Publish Article
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-sm w-full p-6 space-y-4 text-noor-ivory">
            <h3 className="font-display text-lg font-bold text-[#E8BD4B]">Set Profile for Community Chat</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs text-noor-muted mb-1">Name</label>
                <input type="text" required value={profileInput.name} onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })} placeholder="Your display name" className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] text-sm" />
              </div>
              <div>
                <label className="block text-xs text-noor-muted mb-1">Email</label>
                <input type="email" required value={profileInput.email} onChange={(e) => setProfileInput({ ...profileInput, email: e.target.value })} placeholder="name@email.com" className="w-full px-3 py-2 rounded-xl bg-[#103329] border border-[#1A4035] text-sm" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E8BD4B] text-[#061812] font-semibold text-sm">Save & Join Chat</button>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC COMMUNITY CHAT MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-lg w-full h-[80dvh] flex flex-col overflow-hidden text-noor-ivory">
            <div className="p-4 bg-[#103329] border-b border-[#1A4035] flex items-center justify-between">
              <span className="font-bold text-sm text-[#E8BD4B] flex items-center gap-2"><MessageSquare size={16} /> Public Community Chat</span>
              <button onClick={() => setIsChatOpen(false)} className="text-noor-muted hover:text-noor-ivory"><X size={18} /></button>
            </div>
            {bannedAlert && (
              <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs p-2 text-center flex items-center justify-center gap-1">
                <ShieldAlert size={14} /> Inappropriate words or links are restricted in chat.
              </div>
            )}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-[#103329]/60 border border-[#1A4035] p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs text-noor-muted">
                    <span className="font-semibold text-[#E8BD4B]">{msg.user}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                  {msg.linkUrl && <a href={msg.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-[#E8BD4B] underline block">{msg.linkUrl}</a>}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-[#103329] border-t border-[#1A4035] space-y-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full px-3 py-2 bg-[#0B2820] border border-[#1A4035] rounded-xl text-sm" />
              <button type="submit" className="w-full py-2 bg-[#E8BD4B] text-[#061812] font-semibold text-xs rounded-xl">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
