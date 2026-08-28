import { useState } from 'react';
import { Link } from 'react-router';
import NoorLogo from './NoorLogo';
import { Mail, UsersRound, ArrowRight, Shield, FileText, Info, PhoneCall } from 'lucide-react';

const SOCIAL_ICONS = [
  '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>',
  '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>',
  '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    const localPart = clean.split('@')[0] || 'Noor User';
    const name = localPart.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    localStorage.setItem('noorProfile', JSON.stringify({ email: clean, name }));
    window.dispatchEvent(new Event('noor-profile-updated'));
    setSubscribed(true);
  };

  return (
    <footer
      className="relative overflow-hidden pb-16 lg:pb-0"
      style={{ background: '#082019' }}
    >
      <div className="islamic-pattern absolute inset-0 opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,32,25,0) 0%, rgba(8,32,25,0.6) 100%)',
        }}
      />

      {/* Top Bar - Single Full Width Subscribe Card */}
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          style={{ background: 'rgba(16,51,41,0.72)', border: '1px solid rgba(24,185,138,0.28)' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(232,189,75,0.12)' }}>
              <Mail size={20} className="text-noor-gold" />
            </div>
            <div>
              <p className="text-noor-ivory text-sm font-semibold">Stay Connected</p>
              <p className="text-noor-muted text-[11px]">Get the latest Islamic content, reminders and updates.</p>
            </div>
          </div>
          
          <form className="flex w-full sm:w-auto sm:min-w-[340px]" onSubmit={handleSubscribe}>
            <input
              aria-label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSubscribed(false); }}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-l-full px-4 py-2.5 text-xs text-noor-ivory bg-transparent border border-noor-border outline-none focus:border-noor-gold/60"
            />
            <button
              type="submit"
              className="rounded-r-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap"
              style={{ background: '#E8BD4B', color: '#061812' }}
            >
              {subscribed ? 'Saved ✓' : <>Subscribe <ArrowRight size={13} className="inline ml-1" /></>}
            </button>
          </form>
        </div>
      </div>       
      
      {/* Main Footer Section */}
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pt-2 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          
          {/* Brand Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <NoorLogo variant="footer" />
                <div className="font-display text-noor-ivory font-semibold text-2xl tracking-wide">Noor</div>
              </div>
              <p className="text-noor-muted text-xs leading-relaxed mb-4">
                Your daily digital companion for Qur'an, prayer timings, Sunnah habits, and spiritual growth.
              </p>
            </div>
          </div>

          {/* Essential Features */}
          <div>
            <h4 className="font-display text-noor-ivory font-semibold text-sm mb-3.5 tracking-wide uppercase text-noor-gold/90">
              Core Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/quran" className="text-noor-muted hover:text-noor-gold transition-colors">Holy Qur'an</Link></li>
              <li><Link to="/hadith" className="text-noor-muted hover:text-noor-gold transition-colors">Hadith Collection</Link></li>
              <li><Link to="/duas" className="text-noor-muted hover:text-noor-gold transition-colors">Daily Duas & Azkar</Link></li>
              <li><Link to="/sunnah-habits" className="text-noor-muted hover:text-noor-gold transition-colors">Sunnah Habits</Link></li>
              <li><Link to="/qibla" className="text-noor-muted hover:text-noor-gold transition-colors">Qibla Direction</Link></li>
            </ul>
          </div>

          {/* Tools & Knowledge */}
          <div>
            <h4 className="font-display text-noor-ivory font-semibold text-sm mb-3.5 tracking-wide uppercase text-noor-gold/90">
              Tools & Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/calendar" className="text-noor-muted hover:text-noor-gold transition-colors">Islamic Calendar</Link></li>
              <li><Link to="/zakat" className="text-noor-muted hover:text-noor-gold transition-colors">Zakat Calculator</Link></li>
              <li><Link to="/tasbeeh" className="text-noor-muted hover:text-noor-gold transition-colors">Digital Tasbeeh</Link></li>
              <li><Link to="/stories" className="text-noor-muted hover:text-noor-gold transition-colors">Islamic Stories</Link></li>
              <li><Link to="/blog" className="text-noor-muted hover:text-noor-gold transition-colors">Articles & Guides</Link></li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="font-display text-noor-ivory font-semibold text-sm mb-3.5 tracking-wide uppercase text-noor-gold/90">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"><Info size={13} /> About Us</Link></li>
              <li><Link to="/privacy" className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"><Shield size={13} /> Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"><FileText size={13} /> Terms & Conditions</Link></li>
              <li><Link to="/contact" className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"><PhoneCall size={13} /> Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-noor-border/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-noor-muted/80">
          <p>© {new Date().getFullYear()} Noor. All rights reserved.</p>
          <p>Built with ❤️ for a better Ummah.</p>
        </div>
      </div>
    </footer>
  );
}
