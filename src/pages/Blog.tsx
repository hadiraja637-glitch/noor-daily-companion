import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare, ShieldAlert, Link as LinkIcon, Image as ImageIcon, Sparkles, Share2, MoreVertical, Trash2 } from 'lucide-react';

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
  linkUrl?: string;
  time: string;
}

// BroadcastChannel for cross-tab live chat syncing
const chatChannel = new BroadcastChannel('noor_community_chat_channel');

export function Blog() {
  const CURRENT_USER = 'SwanxPanther'; // Current user handle to restrict delete permissions

  const [activeTab, setActiveTab] = useState<'articles' | 'community'>('community');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Modal State for New Blog Post
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImg, setNewImg] = useState('');
  const [formError, setFormError] = useState('');

  // Initial Blog Posts
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Finding Peace in Daily Solitude and Reflection',
      category: 'Reflection',
      excerpt: 'Exploring how quiet moments and late-night walks help center our thoughts and strengthen our spiritual journey.',
      content: 'Solitude is often misunderstood as loneliness, but for a seeker, it is a sacred sanctuary. Taking time away from the noise of daily life allows the mind to settle and the heart to connect with deeper truths. Whether through quiet contemplation during a walk or journaling under the night sky, these moments build inner resilience and clarity.',
      author: 'SwanxPanther',
      date: 'August 24, 2026',
      readTime: '4 min read',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      featured: true,
    },
    {
      id: '2',
      title: 'Building Consistent Habits with Atomic Principles',
      category: 'Productivity',
      excerpt: 'Small 1% improvements compound over time. Here is how to apply identity-based habits to your coding and study routine.',
      content: 'We often overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. By focusing on who you wish to become (identity-based habits) rather than just what you want to achieve, consistency becomes a natural byproduct of your daily routine.',
      author: 'SwanxPanther',
      date: 'August 20, 2026',
      readTime: '5 min read',
      img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    },
  ]);

  // Chat States with localStorage & BroadcastChannel integration
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('noor_community_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: '1',
        user: 'Community Admin',
        text: 'Assalamu Alaikum! Welcome to the Noor community chat. Share beneficial Islamic reminders and Bayan links here.',
        time: 'Just now',
      },
    ];
  });

  const [newMsg, setNewMsg] = useState('');
  const [chatError, setChatError] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync messages with localStorage and BroadcastChannel
  useEffect(() => {
    try {
      localStorage.setItem('noor_community_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [chatMessages]);

  useEffect(() => {
    chatChannel.onmessage = (event) => {
      if (event.data) {
        setChatMessages(event.data);
      }
    };

    return () => {
      chatChannel.onmessage = null;
    };
  }, []);

  const broadcastMessages = (updatedMessages: ChatMessage[]) => {
    setChatMessages(updatedMessages);
    try {
      chatChannel.postMessage(updatedMessages);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) {
      setChatError('Please write something before sending.');
      return;
    }
    setChatError('');

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = newMsg.match(urlRegex);
    const linkUrl = match ? match[0] : undefined;
    const textWithoutLink = linkUrl ? newMsg.replace(linkUrl, '').trim() : newMsg;

    const newMessageItem: ChatMessage = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      text: textWithoutLink,
      linkUrl: linkUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...chatMessages, newMessageItem];
    broadcastMessages(updated);
    setNewMsg('');
  };

  const handleDeleteMessage = (id: string) => {
    const updated = chatMessages.filter((msg) => msg.id !== id);
    broadcastMessages(updated);
    setActiveMenuId(null);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const categories = ['All', 'Reflection', 'Productivity', 'Technology', 'General'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExcerpt.trim() || !newContent.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const newBlogPost: BlogPost = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt,
      content: newContent,
      author: CURRENT_USER,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      img: newImg.trim() || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
    };

    setPosts([newBlogPost, ...posts]);
    setShowAddModal(false);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setNewImg('');
    setFormError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0B2820] border border-[#1A4035] rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#E8BD4B]">
            <Sparkles size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Noor Sanctuary & Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-noor-ivory">Reflections & Islamic Community</h1>
          <p className="text-sm text-noor-muted max-w-xl">Explore thoughtful articles or connect live with the community through shared reminders and Islamic reference links.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'articles' ? 'bg-[#E8BD4B] text-[#061812] shadow-md' : 'bg-[#103329] text-noor-ivory hover:bg-[#1A4035]'
            }`}
          >
            Articles & Blog
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'community' ? 'bg-[#E8BD4B] text-[#061812] shadow-md' : 'bg-[#103329] text-noor-ivory hover:bg-[#1A4035]'
            }`}
          >
            <MessageSquare size={16} /> Community Chat
          </button>
        </div>
      </div>

      {/* ARTICLES TAB VIEW */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B2820] border border-[#1A4035] text-sm text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#103329] border border-[#E8BD4B]/30 text-[#E8BD4B] font-bold text-sm hover:bg-[#1A4035] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle size={16} /> Write Article
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-[#E8BD4B] text-[#061812]' : 'bg-[#0B2820] text-noor-muted border border-[#1A4035] hover:text-noor-ivory'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full py-16 text-center text-noor-muted space-y-2">
                <BookOpen size={32} className="mx-auto text-noor-muted/50" />
                <p className="text-base font-medium text-noor-ivory">No articles found</p>
                <p className="text-xs">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="bg-[#0B2820] border border-[#1A4035] rounded-2xl overflow-hidden shadow-lg hover:border-[#E8BD4B]/50 transition-all cursor-pointer flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#061812]/80 backdrop-blur-md text-[11px] font-bold text-[#E8BD4B] border border-[#1A4035]">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-xs text-noor-muted">
                        <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-noor-ivory group-hover:text-[#E8BD4B] transition-colors line-clamp-1">{post.title}</h3>
                      <p className="text-sm text-noor-muted line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#1A4035] text-xs">
                      <span className="text-[#E8BD4B] font-medium">By {post.author}</span>
                      <span className="text-emerald-400 font-bold group-hover:underline">Read Article →</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* COMMUNITY CHAT TAB VIEW */}
      {activeTab === 'community' && (
        <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#1A4035] bg-[#061812] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#103329] border border-[#E8BD4B]/30 flex items-center justify-center text-[#E8BD4B]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-noor-ivory">Noor Community Chat</h2>
                <p className="text-xs text-emerald-400 font-medium">Live sync active across tabs</p>
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-noor-muted space-y-2">
                <p className="text-sm font-medium text-noor-ivory/80">No Messages Yet</p>
                <p className="text-xs max-w-xs">Be the first to share an authentic Islamic quote or Bayan link with the community!</p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                // Check if the current message belongs to the current user
                const isMyMessage = msg.user === CURRENT_USER;

                return (
                  <div key={msg.id} className="flex gap-3 items-start group relative">
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

                      {/* 3-Dots Action Menu (Only shown if it is MY message) */}
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

          {/* Bottom Input Controls */}
          <div className="p-3 sm:p-4 border-t border-[#1A4035] bg-[#0B2820] space-y-3 z-10">
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
                placeholder="Write a message or paste YouTube/Islamic link..."
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
      )}

      {/* READ FULL ARTICLE MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#103329] text-noor-muted hover:text-noor-ivory transition-colors border border-[#1A4035]"
            >
              <X size={18} />
            </button>
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#103329] text-xs font-bold text-[#E8BD4B] border border-[#E8BD4B]/30">
                {activePost.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-noor-ivory">{activePost.title}</h2>
              <div className="flex items-center gap-4 text-xs text-noor-muted">
                <span>By {activePost.author}</span>
                <span>•</span>
                <span>{activePost.date}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>
            </div>
            <div className="h-64 rounded-xl overflow-hidden border border-[#1A4035]">
              <img src={activePost.img} alt={activePost.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-sm text-noor-ivory/90 leading-relaxed space-y-4 whitespace-pre-line">
              {activePost.content}
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW ARTICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0B2820] border border-[#1A4035] rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-noor-ivory">Write New Article</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-[#103329] text-noor-muted hover:text-noor-ivory transition-colors border border-[#1A4035]"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 font-medium">
                <ShieldAlert size={16} /> {formError}
              </div>
            )}

            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-noor-muted mb-1">Article Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-noor-muted mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                  >
                    <option value="Reflection">Reflection</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Technology">Technology</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-noor-muted mb-1">Cover Image URL (optional)</label>
                  <input
                    type="text"
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    placeholder="https://image-url.com..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-noor-muted mb-1">Short Excerpt *</label>
                <input
                  type="text"
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Brief summary..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-noor-muted mb-1">Full Content *</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your article content here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#061812] border border-[#1A4035] text-sm text-noor-ivory focus:outline-none focus:border-[#E8BD4B] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#103329] text-noor-muted text-sm font-bold hover:text-noor-ivory border border-[#1A4035]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E8BD4B] text-[#061812] text-sm font-bold hover:bg-[#f2ca5c] shadow-md"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
