import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  ShieldAlert,
  Link as LinkIcon,
  ExternalLink,
  MoreVertical,
  Trash2,
  Wifi,
  Sparkles,
  Loader2,
  Circle,
  ChevronDown
} from 'lucide-react';

const SUPABASE_URL = 'https://imcspnvjsvaxzejzxlqr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tRYqJQ-xmq9m5yk1cu2fyA_kXvPUgnv';

type SupabaseClient = any;

let supabaseClient: SupabaseClient | null = null;
let supabasePromise: Promise<SupabaseClient | null> | null = null;

const getSupabaseClient = async (): Promise<SupabaseClient | null> => {
  if (supabaseClient) return supabaseClient;

  if (typeof window === 'undefined') return null;

  const createClient = () => {
    const supabase = (window as any).supabase;
    if (!supabase?.createClient) return null;
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  };

  const existing = createClient();
  if (existing) return existing;

  if (!supabasePromise) {
    supabasePromise = new Promise((resolve) => {
      const current = document.querySelector('script[data-noor-supabase]') as HTMLScriptElement | null;
      if (current) {
        current.addEventListener('load', () => resolve(createClient()), { once: true });
        current.addEventListener('error', () => resolve(null), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.dataset.noorSupabase = 'true';
      script.onload = () => resolve(createClient());
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }

  return supabasePromise;
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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=82';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Ways to Strengthen Your Connection with Allah in Daily Life',
    category: 'SPIRITUAL GROWTH',
    excerpt:
      'Simple yet powerful daily habits to bring Allah closer to your heart during busy schedules.',
    content: `Maintaining a strong spiritual connection in today's fast-paced world can feel challenging. However, Islam emphasizes consistency in small deeds over sporadic large efforts.

1. **Start with Morning & Evening Adhkar:** Protect your mind and soul by reciting daily authentic supplications.
2. **Mindful Salah:** Treat prayer not as a checklist item, but as a direct conversation with the Creator.
3. **Daily Quran Recitation:** Even reading 5 verses a day with translation keeps the divine light alive in your chest.
4. **Constant Dhikr:** Keep your tongue moist with SubhanAllah, Alhamdulillah, and Allahu Akbar throughout your commute or work.
5. **Nightly Self-Reflection (Muhasabah):** Take 2 minutes before sleeping to thank Allah for blessings and seek forgiveness for shortcomings.`,
    author: 'Sheikh Omar Al-Sayed',
    date: 'Aug 18, 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=82',
    featured: true,
  },
  {
    id: '2',
    title: 'Understanding Tahajjud: The Prayer of Light and Answers',
    category: 'SALAH & PRAYER',
    excerpt:
      'Discover why the night prayer is considered the most powerful intimate conversation with Allah.',
    content: `Tahajjud is a voluntary prayer offered during the last third of the night. It holds immense reward and serves as a direct bridge to divine mercy.

Why it matters: The Prophet (ﷺ) described the special virtue of the last portion of the night for sincere supplication.
How to build the habit: Set an intention, sleep early, and start with just 2 short Raka'at before Fajr.
Supplication: Use the quiet of Sujood to make sincere dua.`,
    author: 'Dr. Ayesha Siddiqui',
    date: 'Aug 15, 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=82',
  },
  {
    id: '3',
    title: 'The Psychological & Spiritual Benefits of Daily Azkar',
    category: 'DUAS & AZKAR',
    excerpt: 'How authentic Islamic remembrances anchor peace in an anxious heart.',
    content: `Modern life brings stress, overthinking, and fatigue. Daily morning and evening Azkar can become a steady spiritual routine.

Incorporate authentic daily remembrance such as Ayat al-Kursi, the three Quls, and Istighfar according to your trusted Islamic sources.`,
    author: 'Ustadh Bilal Tariq',
    date: 'Aug 10, 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=82',
  },
  {
    id: '4',
    title: 'Building an Authentic Islamic Home Environment',
    category: 'COMMUNITY & LIFE',
    excerpt:
      'Practical advice on fostering love, mercy, and Islamic values in family life.',
    content: `Creating an Islamic environment at home goes beyond hanging calligraphies. It involves practicing character, patience, and warmth inspired by the Sunnah.

- Eat meals together with Bismillah.
- Make congregational prayer a regular household event.
- Speak with gentleness and eliminate harsh language.`,
    author: 'Fatima Al-Zahra',
    date: 'Aug 05, 2026',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=82',
  },
];

const CATEGORIES = [
  'All',
  'Spiritual Growth',
  'Salah & Prayer',
  'Duas & Azkar',
  'Community & Life',
];

const BANNED_KEYWORDS = [
  'bf',
  'gf',
  'dating',
  'relationship',
  'love u',
  'sexy',
  'number',
  'whatsapp',
  'fuck',
  'shit',
  'abuse',
  'single',
  'meet me',
];

const normaliseCategory = (value: string) =>
  value.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

const formatDbPost = (b: any): BlogPost => ({
  id: String(b.id),
  title: b.title || 'Untitled Post',
  category: b.category || 'SPIRITUAL GROWTH',
  excerpt:
    b.excerpt ||
    (b.content ? `${String(b.content).slice(0, 120).trim()}…` : 'No excerpt available.'),
  content: b.content || '',
  author: b.author || 'Anonymous',
  date:
    b.date ||
    (b.created_at
      ? new Date(b.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })
      : 'Recently'),
  readTime: b.read_time || b.readTime || '3 min read',
  img: b.img || FALLBACK_IMAGE,
  featured: Boolean(b.featured),
});

const formatDbMessage = (m: any): ChatMessage => ({
  id: String(m.id),
  user: String(m.user_name || '').trim() || 'Community Member',
  email: String(m.email || '').trim(),
  text: String(m.text || ''),
  time:
    m.time ||
    (m.created_at
      ? new Date(m.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : ''),
  linkUrl: m.link_url || undefined,
});

const mergeMessages = (current: ChatMessage[], incoming: ChatMessage[]) => {
  const map = new Map<string, ChatMessage>();
  [...current, ...incoming].forEach((message) => map.set(message.id, message));
  return Array.from(map.values());
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileInput, setProfileInput] = useState({ name: '', email: '' });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [bannedAlert, setBannedAlert] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [realtimeLive, setRealtimeLive] = useState(false);
  const [openMessageMenu, setOpenMessageMenu] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

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
  const chatChannelRef = useRef<any>(null);
  const fallbackSyncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollChatToBottom = (behavior: ScrollBehavior = 'smooth') => {
    window.setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior }), 60);
  };

  const fetchBlogs = async () => {
    const client = await getSupabaseClient();

    if (!client) {
      setPosts(DEFAULT_POSTS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const remote = Array.isArray(data) ? data.map(formatDbPost) : [];
      const remoteTitles = new Set(remote.map((post) => post.title.trim().toLowerCase()));

      // Keep the built-in articles available, but never show the same title twice.
      const merged = [...remote, ...DEFAULT_POSTS.filter(
        (post) => !remoteTitles.has(post.title.trim().toLowerCase())
      )];

      setPosts(merged);
    } catch (error) {
      console.error('Noor: unable to fetch blogs from Supabase.', error);
      setPosts(DEFAULT_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatMessages = async (client?: SupabaseClient) => {
    const supabase = client || (await getSupabaseClient());
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('public_chat')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (Array.isArray(data)) {
        setChatMessages(data.map(formatDbMessage));
      }
    } catch (error) {
      console.error('Noor: unable to fetch community messages.', error);
      setChatError('Community messages could not be loaded right now.');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Restore the community profile before checking Supabase auth.
    // This prevents the name/email form from appearing again after refresh.
    try {
      const saved = window.localStorage.getItem('noor_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed?.email) {
          const profile = {
            name: String(parsed.name).trim(),
            email: String(parsed.email).trim().toLowerCase(),
          };
          setUserProfile(profile);
          setProfileInput(profile);
        }
      }
    } catch (error) {
      console.warn('Noor: saved profile could not be read.', error);
    }

    (async () => {
      const client = await getSupabaseClient();
      if (!mounted) return;

      if (client) {
        try {
          const { data } = await client.auth.getUser();
          const authUser = data?.user;

          if (authUser) {
            const metadata = authUser.user_metadata || {};
            const name =
              metadata.full_name ||
              metadata.name ||
              metadata.display_name ||
              metadata.user_name ||
              '';
            if (name && authUser.email) {
              setUserProfile({ name: String(name), email: authUser.email });
              setProfileInput({ name: String(name), email: authUser.email });
            }
          }
        } catch (error) {
          console.warn('Noor: profile lookup skipped.', error);
        }
      }

      if (mounted) fetchBlogs();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;

    let mounted = true;

    const startChat = async () => {
      const client = await getSupabaseClient();
      if (!client || !mounted) {
        setChatError('Community connection is unavailable.');
        return;
      }

      setChatError('');
      await fetchChatMessages(client);
      scrollChatToBottom('auto');

      const channel = client
        .channel('noor-public-chat-live')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'public_chat',
          },
          (payload: any) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              setChatMessages((prev) =>
                mergeMessages(prev, [formatDbMessage(payload.new)])
              );
              scrollChatToBottom();
            }

            if (payload.eventType === 'DELETE' && payload.old?.id) {
              const deletedId = String(payload.old.id);
              setChatMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
            }
          }
        )
        .subscribe((status: string) => {
          const live = status === 'SUBSCRIBED';
          setRealtimeLive(live);

          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setChatError('Live sync is reconnecting. Messages are still being checked safely.');
          }
        });

      chatChannelRef.current = channel;
    };

    startChat();

    return () => {
      mounted = false;
      setRealtimeLive(false);

      if (fallbackSyncRef.current) {
        clearInterval(fallbackSyncRef.current);
        fallbackSyncRef.current = null;
      }

      const channel = chatChannelRef.current;
      chatChannelRef.current = null;

      if (channel) {
        Promise.resolve(channel.unsubscribe()).catch(() => undefined);
      }
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (!isChatOpen || realtimeLive) return;

    fallbackSyncRef.current = setInterval(() => {
      fetchChatMessages();
    }, 15000);

    return () => {
      if (fallbackSyncRef.current) {
        clearInterval(fallbackSyncRef.current);
        fallbackSyncRef.current = null;
      }
    };
  }, [isChatOpen, realtimeLive]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' ||
        normaliseCategory(post.category) === normaliseCategory(activeCategory);

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = useMemo(
    () => filteredPosts.find((post) => post.featured) || filteredPosts[0],
    [filteredPosts]
  );

  const gridPosts = useMemo(
    () =>
      featuredPost
        ? filteredPosts.filter((post) => post.id !== featuredPost.id)
        : filteredPosts,
    [filteredPosts, featuredPost]
  );

  const openCommunity = () => {
    setOpenMessageMenu(null);
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }
    setIsChatOpen(true);
  };

  const handleSubmitArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setSubmitError('Please complete the required fields.');
      return;
    }

    const client = await getSupabaseClient();
    if (!client) {
      setSubmitError('The publishing service is unavailable. Please try again.');
      return;
    }

    const newPostData = {
      title: formData.title.trim(),
      category: formData.category.toUpperCase(),
      excerpt:
        formData.excerpt.trim() ||
        `${formData.content.trim().slice(0, 120)}…`,
      content: formData.content.trim(),
      author: formData.author.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      read_time: formData.readTime,
      img: formData.img.trim() || FALLBACK_IMAGE,
    };

    try {
      const { data, error } = await client
        .from('blogs')
        .insert([newPostData])
        .select('*')
        .single();

      if (error) throw error;

      const createdPost = data
        ? formatDbPost(data)
        : {
            id: `pending-${Date.now()}`,
            ...newPostData,
            readTime: newPostData.read_time,
          };

      setPosts((prev) => [
        createdPost,
        ...prev.filter((post) => post.id !== createdPost.id),
      ]);

      setSubmittedSuccess(true);

      window.setTimeout(() => {
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
      }, 1400);
    } catch (error: any) {
      console.error('Noor: article publish failed.', error);
      setSubmitError(
        error?.message
          ? `Could not publish: ${error.message}`
          : 'Could not publish the article. Please try again.'
      );
    }
  };

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();

    const name = profileInput.name.trim();
    const email = profileInput.email.trim().toLowerCase();

    if (!name || !email) return;

    const profile = { name, email };
    setUserProfile(profile);

    try {
      window.localStorage.setItem('noor_user_profile', JSON.stringify(profile));
      window.dispatchEvent(
        new CustomEvent('noor-profile-updated', { detail: profile })
      );
    } catch (error) {
      console.warn('Noor: profile could not be saved locally.', error);
    }

    setIsProfileModalOpen(false);
    setIsChatOpen(true);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSending) return;

    const text = newMessage.trim();
    const link = linkInput.trim();

    if (!text && !link) return;

    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    const combined = `${text} ${link}`.toLowerCase();
    if (BANNED_KEYWORDS.some((keyword) => combined.includes(keyword))) {
      setBannedAlert(true);
      window.setTimeout(() => setBannedAlert(false), 3200);
      return;
    }

    if (link && !isHttpUrl(link)) {
      setChatError('Please enter a valid http:// or https:// reference link.');
      return;
    }

    const client = await getSupabaseClient();
    if (!client) {
      setChatError('Community connection is unavailable. Please try again.');
      return;
    }

    setIsSending(true);
    setChatError('');

    try {
      const { error } = await client
        .from('public_chat')
        .insert([
          {
            user_name: userProfile.name,
            email: userProfile.email,
            text,
            link_url: link || null,
          },
        ]);

      if (error) throw error;

      // The database is the source of truth. Realtime will normally add the row;
      // a small follow-up read also keeps the UI correct when realtime is delayed.
      setNewMessage('');
      setLinkInput('');
      await fetchChatMessages(client);
      scrollChatToBottom();
    } catch (error: any) {
      console.error('Noor: message send failed.', error);
      setChatError(
        error?.message
          ? `Message could not be sent: ${error.message}`
          : 'Message could not be sent. Please try again.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (message: ChatMessage) => {
    if (!userProfile || message.email !== userProfile.email || deletingMessageId) return;

    setDeletingMessageId(message.id);
    setOpenMessageMenu(null);
    setChatError('');

    const client = await getSupabaseClient();

    try {
      if (!client) throw new Error('Community connection is unavailable.');

      const { error } = await client
        .from('public_chat')
        .delete()
        .eq('id', message.id)
        .eq('email', userProfile.email);

      if (error) throw error;

      setChatMessages((prev) => prev.filter((item) => item.id !== message.id));
    } catch (error: any) {
      console.error('Noor: message delete failed.', error);
      setChatError(
        error?.message
          ? `Delete failed: ${error.message}`
          : 'Delete failed. Please try again.'
      );
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.src !== FALLBACK_IMAGE) image.src = FALLBACK_IMAGE;
  };

  return (
    <div className="min-h-screen bg-[#061913] text-[#E8EFEA] pt-20 pb-16 selection:bg-[#D4AF37]/30">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#17372C]">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.08),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(18,130,94,0.12),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#34503F] bg-[#0B241B] px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                <Sparkles size={13} />
                Islamic Insights & Knowledge
              </div>
              <h1 className="mt-4 font-serif text-[2.15rem] leading-[1.05] sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-[#FAF8F5]">
                Islamic Blog
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-[15px] leading-6 text-[#A3B8B0]">
                Insights, reflections, and practical reminders to strengthen faith and enrich everyday life.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSubmitError('');
                  setIsSubmitOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#061913] shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition hover:bg-[#e0bf55] active:scale-[0.98]"
              >
                <PlusCircle size={16} />
                Submit Article
              </button>

              <button
                type="button"
                onClick={openCommunity}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#34503F] bg-[#0B241B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#E8EFEA] transition hover:border-[#D4AF37]/60 hover:bg-[#102B22] active:scale-[0.98]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Community
                <MessageSquare size={15} className="text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="rounded-2xl border border-[#17372C] bg-[#082018]/80 p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative min-w-0 flex-[1.25] lg:max-w-2xl">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F8D82]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search articles or authors..."
                className="w-full rounded-xl border border-[#234538] bg-[#061913] py-3 pl-10 pr-4 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70 focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>

            <div className="relative w-full lg:w-[190px] lg:shrink-0">
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="w-full appearance-none rounded-xl border border-[#234538] bg-[#061913] py-3 pl-4 pr-9 text-sm text-[#DCE7E1] outline-none focus:border-[#D4AF37]/70"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#789187]"
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold transition ${
                    active
                      ? 'border border-[#D4AF37] bg-[#D4AF37]/12 text-[#D4AF37]'
                      : 'border border-[#234538] bg-[#0B241B] text-[#94AAA1] hover:border-[#345A49] hover:text-[#E8EFEA]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOG CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-pulse">
            <div className="lg:col-span-8 h-[310px] rounded-2xl border border-[#17372C] bg-[#0B241B]" />
            <div className="lg:col-span-4 h-[310px] rounded-2xl border border-[#17372C] bg-[#0B241B]" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#34503F] bg-[#0B241B] px-6 py-16 text-center">
            <BookOpen size={30} className="mx-auto text-[#D4AF37]" />
            <h2 className="mt-3 font-serif text-xl text-[#FAF8F5]">No articles found</h2>
            <p className="mt-1 text-sm text-[#829B91]">Try another search or category.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* FEATURED */}
            {featuredPost && (
              <article
                onClick={() => setSelectedPost(featuredPost)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#234538] bg-[#0B241B] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:border-[#D4AF37]/45"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="relative h-56 sm:h-64 md:col-span-5 md:h-[270px] overflow-hidden">
                    <img
                      src={featuredPost.img}
                      alt={featuredPost.title}
                      loading="eager"
                      onError={handleImageError}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061913]/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/45 bg-[#061913]/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D4AF37] backdrop-blur-md">
                      <Sparkles size={11} />
                      Featured
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-5 sm:p-6 md:col-span-7">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] sm:text-xs uppercase tracking-[0.11em]">
                      <span className="font-bold text-[#D4AF37]">
                        {featuredPost.category}
                      </span>
                      <span className="text-[#49675B]">•</span>
                      <span className="flex items-center gap-1 text-[#829B91] normal-case tracking-normal">
                        <Clock size={12} />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="mt-3 font-serif text-[1.45rem] leading-[1.18] sm:text-2xl lg:text-[1.8rem] font-semibold text-[#FAF8F5] transition group-hover:text-[#E2C25A]">
                      {featuredPost.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-[#A3B8B0]">
                      {featuredPost.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#234538]/80 pt-4 text-[11px] text-[#789187]">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={13} />
                        <strong className="font-medium text-[#DCE7E1]">{featuredPost.author}</strong>
                      </span>
                      <span>{featuredPost.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* SECONDARY */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {gridPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[#234538] bg-[#0B241B] transition hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:shadow-[0_14px_35px_rgba(0,0,0,0.16)]"
                  >
                    <div className="relative h-40 sm:h-44 overflow-hidden">
                      <img
                        src={post.img}
                        alt={post.title}
                        loading="lazy"
                        onError={handleImageError}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061913]/45 to-transparent" />
                    </div>

                    <div className="p-4 sm:p-4.5">
                      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.08em]">
                        <span className="truncate font-bold text-[#D4AF37]">{post.category}</span>
                        <span className="shrink-0 normal-case tracking-normal text-[#789187]">
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="mt-2.5 line-clamp-2 font-serif text-[1.08rem] leading-[1.25] font-semibold text-[#FAF8F5] group-hover:text-[#E2C25A]">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#94AAA1]">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[#234538]/70 pt-3 text-[10px] text-[#789187]">
                        <span className="truncate pr-2">By {post.author}</span>
                        <span className="shrink-0 font-semibold text-[#D4AF37]">Read →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ARTICLE MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020B08]/85 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#34503F] bg-[#0B241B] shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
              className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-[#061913]/75 p-2 text-[#A3B8B0] backdrop-blur hover:text-white"
            >
              <X size={17} />
            </button>

            <div className="h-48 sm:h-64 shrink-0 overflow-hidden">
              <img
                src={selectedPost.img}
                alt={selectedPost.title}
                onError={handleImageError}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="overflow-y-auto p-5 sm:p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#D4AF37]">
                {selectedPost.category}
              </span>
              <h2 className="mt-2 max-w-2xl font-serif text-2xl sm:text-3xl font-semibold leading-tight text-[#FAF8F5]">
                {selectedPost.title}
              </h2>
              <p className="mt-2 text-xs text-[#789187]">
                By {selectedPost.author} • {selectedPost.date} • {selectedPost.readTime}
              </p>
              <div className="mt-6 whitespace-pre-line text-sm sm:text-[15px] leading-7 text-[#B5C5BE]">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ARTICLE */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020B08]/85 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#34503F] bg-[#0B241B] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[#234538] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4AF37]">
                  Share Knowledge
                </p>
                <h2 className="mt-0.5 font-serif text-xl font-semibold text-[#FAF8F5]">
                  Submit Your Article
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitOpen(false)}
                className="rounded-full border border-[#34503F] bg-[#102B22] p-2 text-[#A3B8B0] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {submittedSuccess ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                    <Check size={28} />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[#FAF8F5]">
                    Article Published
                  </h3>
                  <p className="mt-1 text-sm text-[#8FA79D]">
                    Your article has been saved to the Noor blog.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitArticle} className="space-y-4">
                  {submitError && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-300">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                      Article Title *
                    </label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter a meaningful title..."
                      className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none focus:border-[#D4AF37]/70"
                      >
                        {CATEGORIES.filter((category) => category !== 'All').map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                        Author Name *
                      </label>
                      <input
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Your name..."
                        className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                      Image URL <span className="text-[#637D73]">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                      Short Excerpt <span className="text-[#637D73]">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="A short introduction for the card..."
                      className="w-full resize-none rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#A3B8B0]">
                      Article Content *
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your article..."
                      className="w-full resize-y rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm leading-6 text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-sm font-bold text-[#061913] shadow-lg transition hover:bg-[#e0bf55] active:scale-[0.99]"
                  >
                    <Check size={16} />
                    Publish Article
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020B08]/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[#34503F] bg-[#0B241B] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]">
                  <User size={18} />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#FAF8F5]">
                  Join Noor Community
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#8FA79D]">
                  Your name appears publicly beside your messages. Your email is used only to associate your messages with you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="rounded-full p-2 text-[#789187] hover:bg-[#102B22] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-3">
              <input
                required
                value={profileInput.name}
                onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
              />
              <input
                required
                type="email"
                value={profileInput.email}
                onChange={(e) => setProfileInput({ ...profileInput, email: e.target.value })}
                placeholder="Your email"
                className="w-full rounded-xl border border-[#234538] bg-[#061913] px-3.5 py-3 text-sm text-[#E8EFEA] outline-none placeholder:text-[#5E776E] focus:border-[#D4AF37]/70"
              />
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-sm font-bold text-[#061913] transition hover:bg-[#e0bf55]"
              >
                Continue to Community
                <MessageSquare size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMMUNITY CHAT */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] bg-[#020B08]/75 backdrop-blur-sm">
          <div className="flex h-[100dvh] w-full items-end justify-end sm:items-center sm:justify-center sm:p-4">
            <section className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#071C15] shadow-2xl sm:h-[min(700px,88dvh)] sm:max-w-[440px] sm:rounded-2xl sm:border sm:border-[#34503F]">
              {/* CHAT HEADER */}
              <header className="shrink-0 border-b border-[#234538] bg-[#081F17] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]">
                      <MessageSquare size={18} />
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0B241B] bg-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-serif text-base font-semibold text-[#FAF8F5]">
                          Noor Community
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
                          <Circle size={6} fill="currentColor" />
                          {realtimeLive ? 'Live' : 'Syncing'}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#789187]">
                        <Wifi size={11} />
                        Public Islamic Community
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    className="shrink-0 rounded-full p-2 text-[#789187] hover:bg-[#102B22] hover:text-white"
                    aria-label="Close community chat"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-[#234538] bg-[#061913] px-3 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[10px] font-bold text-[#D4AF37]">
                    {userProfile?.name?.slice(0, 1).toUpperCase() || 'M'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#637D73]">
                      Chatting as
                    </p>
                    <p className="truncate text-xs font-semibold text-[#E8EFEA]">
                      {userProfile?.name || 'Guest'}
                    </p>
                  </div>
                </div>
              </header>

              {/* CHAT STATUS */}
              {(bannedAlert || chatError) && (
                <div
                  className={`shrink-0 border-b px-4 py-2 text-center text-[10px] ${
                    bannedAlert
                      ? 'border-red-400/15 bg-red-400/10 text-red-300'
                      : 'border-amber-400/15 bg-amber-400/10 text-amber-200'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldAlert size={13} />
                    {bannedAlert
                      ? 'That message or link is not allowed in the public community.'
                      : chatError}
                  </span>
                </div>
              )}

              {/* MESSAGES */}
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_top,rgba(22,75,56,0.18),transparent_42%)] px-3 py-4 sm:px-4"
                onClick={() => setOpenMessageMenu(null)}
              >
                {chatMessages.length === 0 ? (
                  <div className="flex h-full min-h-[320px] items-center justify-center px-6">
                    <div className="max-w-xs text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 text-[#D4AF37]">
                        <MessageSquare size={23} />
                      </div>
                      <h3 className="mt-4 font-serif text-lg text-[#FAF8F5]">
                        A peaceful space to connect
                      </h3>
                      <p className="mt-1.5 text-xs leading-5 text-[#789187]">
                        Share beneficial reminders, reflections, and Islamic resources with the community.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((message) => {
                      const isMine =
                        Boolean(userProfile?.email) &&
                        message.email === userProfile?.email;

                      const initial =
                        message.user?.trim()?.slice(0, 1).toUpperCase() || 'U';

                      return (
                        <div
                          key={message.id}
                          className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMine && (
                            <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#34503F] bg-[#102B22] text-[10px] font-bold text-[#D4AF37]">
                              {initial}
                            </div>
                          )}

                          <div
                            className={`relative max-w-[82%] sm:max-w-[78%] ${
                              isMine ? 'items-end' : 'items-start'
                            } flex flex-col`}
                          >
                            <div
                              className={`mb-1 flex max-w-full items-center gap-2 px-1 text-[9px] ${
                                isMine ? 'flex-row-reverse' : ''
                              }`}
                            >
                              <span
                                className={`max-w-[180px] truncate font-semibold ${
                                  isMine ? 'text-[#D4AF37]' : 'text-[#A8BDB4]'
                                }`}
                              >
                                {isMine ? 'You' : message.user}
                              </span>
                              <span className="text-[#617A70]">{message.time}</span>
                            </div>

                            <div
                              className={`relative rounded-2xl border px-3.5 py-2.5 shadow-sm ${
                                isMine
                                  ? 'rounded-br-md border-[#2E674F] bg-[#0D3427] text-[#EEF5F1]'
                                  : 'rounded-bl-md border-[#234538] bg-[#0B241B] text-[#DCE7E1]'
                              }`}
                            >
                              {isMine && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenMessageMenu((current) =>
                                      current === message.id ? null : message.id
                                    );
                                  }}
                                  className="absolute -right-8 top-1 rounded-full p-1.5 text-[#637D73] hover:bg-[#102B22] hover:text-[#D4AF37]"
                                  aria-label="Message options"
                                >
                                  <MoreVertical size={15} />
                                </button>
                              )}

                              {openMessageMenu === message.id && isMine && (
                                <div
                                  className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-[#34503F] bg-[#0B241B] p-1 shadow-2xl"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    disabled={deletingMessageId === message.id}
                                    onClick={() => handleDeleteMessage(message)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-300 hover:bg-red-400/10 disabled:opacity-50"
                                  >
                                    {deletingMessageId === message.id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                    Delete for Everyone
                                  </button>
                                </div>
                              )}

                              {message.text && (
                                <p className="whitespace-pre-wrap break-words text-[13px] leading-5">
                                  {message.text}
                                </p>
                              )}

                              {message.linkUrl && (
                                <a
                                  href={message.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-[#D4AF37]/15 bg-[#061913]/45 px-2.5 py-2 text-[10px] text-[#D4AF37] hover:bg-[#061913]/70"
                                >
                                  <LinkIcon size={12} className="shrink-0" />
                                  <span className="min-w-0 truncate">{message.linkUrl}</span>
                                  <ExternalLink size={11} className="shrink-0" />
                                </a>
                              )}
                            </div>
                          </div>

                          {isMine && (
                            <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[10px] font-bold text-[#D4AF37]">
                              {userProfile?.name?.slice(0, 1).toUpperCase() || 'M'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              {/* COMPOSER */}
              <form
                onSubmit={handleSendMessage}
                className="shrink-0 border-t border-[#234538] bg-[#081F17] p-2.5 sm:p-3"
              >
                <div className="rounded-xl border border-[#34503F] bg-[#061913] p-1.5">
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={1}
                      value={newMessage}
                      onChange={(event) => setNewMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      placeholder="Share a beneficial reminder..."
                      className="max-h-24 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-[13px] leading-5 text-[#E8EFEA] outline-none placeholder:text-[#5E776E]"
                    />
                    <button
                      type="submit"
                      disabled={isSending || (!newMessage.trim() && !linkInput.trim())}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37] text-[#061913] transition hover:bg-[#e0bf55] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Send message"
                    >
                      {isSending ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>

                  <div className="mt-1 flex items-center gap-2 border-t border-[#17372C] px-2 pt-2">
                    <LinkIcon size={12} className="shrink-0 text-[#637D73]" />
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(event) => setLinkInput(event.target.value)}
                      placeholder="Add reference link (optional)"
                      className="min-w-0 flex-1 bg-transparent py-1 text-[10px] text-[#B5C5BE] outline-none placeholder:text-[#5E776E]"
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between px-1 text-[9px] text-[#5E776E]">
                  <span>Keep it beneficial • No harmful links</span>
                  <span className="inline-flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${realtimeLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {realtimeLive ? 'Live sync' : 'Syncing'}
                  </span>
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
