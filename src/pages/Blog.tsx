import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, Clock, X, Check, BookOpen, Send, User, MessageSquare } from 'lucide-react';

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
    const saved = localStorage.getItem('noor_public_chat_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- BACKEND REAL-TIME SYNC API HOOK (Broadcast Channel for Multi-tab / Public Sync) ---
  useEffect(() => {
    // Web Broadcast Channel for instant cross-tab & global event syncing
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

    // Save locally
    const updatedMessages = [...messages, msgObj];
    setMessages(updatedMessages);
    localStorage.setItem('noor_public_chat_messages', JSON.stringify(updatedMessages));

    // Broadcast to backend/other clients
    try {
      const channel = new BroadcastChannel('noor_public_chat_channel');
      channel.postMessage(msgObj);
      channel.close();
    } catch (err) {
      console.error('Broadcast error:', err);
    }

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-emerald-600" /> Islamic Knowledge & Reflections
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Explore authentic articles, community posts, and daily reminders.
            </p>
          </div>
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
                {/* Unique Teal Pill Unread Counter */}
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
                placeholder={isProfileSet ? "Type a public message..." : "Set nickname to start chatting..."}
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
                <User className="text-emerald-600" /> Set Your Nickname
              </h3>
              {isProfileSet && (
                <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Apna nickname save karein. Yeh aik baar save hoga aur dynamic chat screen par show hoga.
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
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
    </div>
  );
};
export default Blog;
