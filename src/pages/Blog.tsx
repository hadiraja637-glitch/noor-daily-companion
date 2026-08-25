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

    // Detect link if present
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = newMsg.match(urlRegex);
    const linkUrl = match ? match[0] : undefined;
    const textWithoutLink = linkUrl ? newMsg.replace(linkUrl, '').trim() : newMsg;

    const newMessageItem: ChatMessage = {
      id: Date.now().toString(),
      user: 'SwanxPanther', // Default user handle or dynamic username
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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
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
            chatMessages.map((msg) => (
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

                  {/* 3-Dots Action Menu (Delete for Everyone) */}
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
                </div>
              </div>
            ))
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
    </div>
  );
}

export default Blog;
