import { useState } from 'react';
import { Link } from 'react-router';
import NoorLogo from './NoorLogo';
import { Mail, ArrowRight, Shield, FileText, Info, PhoneCall } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    const clean = email.trim().toLowerCase();
    if (!clean) return;

    const localPart = clean.split('@')[0] || 'Noor User';
    const name = localPart
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    localStorage.setItem(
      'noorProfile',
      JSON.stringify({ email: clean, name })
    );

    window.dispatchEvent(new Event('noor-profile-updated'));
    setSubscribed(true);
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#082019' }}
    >
      <div className="islamic-pattern absolute inset-0 opacity-60 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,32,25,0) 0%, rgba(8,32,25,0.6) 100%)',
        }}
      />

      {/* Subscribe Section */}
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8"
          style={{
            background: 'rgba(16,51,41,0.72)',
            border: '1px solid rgba(24,185,138,0.28)',
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(232,189,75,0.12)' }}
            >
              <Mail size={20} className="text-noor-gold" />
            </div>

            <div>
              <p className="text-noor-ivory text-sm font-semibold">
                Stay Connected
              </p>

              <p className="text-noor-muted text-[11px]">
                Get the latest Islamic content, reminders and updates.
              </p>
            </div>
          </div>

          <form
            className="flex w-full sm:w-auto sm:min-w-[340px]"
            onSubmit={handleSubscribe}
          >
            <input
              aria-label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubscribed(false);
              }}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-l-full px-4 py-2.5 text-xs text-noor-ivory bg-transparent border border-noor-border outline-none focus:border-noor-gold/60"
            />

            <button
              type="submit"
              className="rounded-r-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap"
              style={{
                background: '#E8BD4B',
                color: '#061812',
              }}
            >
              {subscribed ? (
                'Saved ✓'
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={13} className="inline ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 pt-2 pb-6 lg:pb-8">

        {/*
          MOBILE:
          Brand = full width
          Core Features + Tools = 2 columns
          Legal = hidden

          DESKTOP:
          Brand + Core + Tools + Legal = 4 columns
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-7 lg:gap-10 mb-8 lg:mb-10">

          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <NoorLogo variant="footer" />

                <div className="font-display text-noor-ivory font-semibold text-2xl tracking-wide">
                  Noor
                </div>
              </div>

              <p className="text-noor-muted text-xs leading-relaxed mb-1 max-w-md">
                Your daily digital companion for Qur'an, prayer timings,
                Sunnah habits, and spiritual growth.
              </p>
            </div>
          </div>

          {/* Essential Features */}
          <div>
            <h4 className="font-display text-noor-ivory font-semibold text-[11px] sm:text-sm mb-3 tracking-wide uppercase text-noor-gold/90">
              Core Features
            </h4>

            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <Link
                  to="/quran"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Holy Qur'an
                </Link>
              </li>

              <li>
                <Link
                  to="/hadith"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Hadith Collection
                </Link>
              </li>

              <li>
                <Link
                  to="/duas"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Daily Duas & Azkar
                </Link>
              </li>

              <li>
                <Link
                  to="/sunnah-habits"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Sunnah Habits
                </Link>
              </li>

              <li>
                <Link
                  to="/qibla"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Qibla Direction
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Knowledge */}
          <div>
            <h4 className="font-display text-noor-ivory font-semibold text-[11px] sm:text-sm mb-3 tracking-wide uppercase text-noor-gold/90">
              Tools & Resources
            </h4>

            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <Link
                  to="/calendar"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Islamic Calendar
                </Link>
              </li>

              <li>
                <Link
                  to="/zakat"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Zakat Calculator
                </Link>
              </li>

              <li>
                <Link
                  to="/tasbeeh"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Digital Tasbeeh
                </Link>
              </li>

              <li>
                <Link
                  to="/stories"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Islamic Stories
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="text-noor-muted hover:text-noor-gold transition-colors"
                >
                  Articles & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support — Hidden on mobile, visible on laptop */}
          <div className="hidden lg:block">
            <h4 className="font-display text-noor-ivory font-semibold text-sm mb-3.5 tracking-wide uppercase text-noor-gold/90">
              Legal & Support
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/about"
                  className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <Info size={13} />
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <Shield size={13} />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText size={13} />
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-noor-muted hover:text-noor-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <PhoneCall size={13} />
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-noor-border/40 pt-4 lg:pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-noor-muted/80">
          <p>
            © {new Date().getFullYear()} Noor. All rights reserved.
          </p>

          <p>
            Built with ❤️ for a better Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
}
