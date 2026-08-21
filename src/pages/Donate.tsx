import { Heart, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

const causes = [
  { title: 'Qur’an & Learning', text: 'Help make reliable Islamic learning resources easier to access.', icon: BookOpen },
  { title: 'Community Support', text: 'Support practical initiatives that help people learn and grow together.', icon: Heart },
  { title: 'Sadaqah Jariyah', text: 'Choose a cause you would like to support as a lasting sadaqah.', icon: ShieldCheck },
];

export default function Donate() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen pt-20 pb-24" style={{ background: '#061812' }}>
      <div className="py-14 text-center relative overflow-hidden" style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,.5)' }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-noor-gold text-xs tracking-[.25em] uppercase mb-3">Make a Difference</p>
          <h1 className="font-display text-noor-ivory text-4xl sm:text-5xl font-semibold mb-3">Give with intention.</h1>
          <p className="text-noor-muted max-w-2xl mx-auto leading-relaxed">Support Islamic learning and community-focused projects. This page is a preparation for a secure payment integration; no payment is processed in this demo yet.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-5">
          {causes.map(({title,text,icon:Icon}) => (
            <div key={title} className="rounded-2xl p-6" style={{ background:'#103329', border:'1px solid rgba(26,64,53,.7)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{background:'rgba(232,189,75,.12)'}}><Icon size={20} className="text-noor-gold"/></div>
              <h2 className="font-display text-noor-ivory text-xl font-semibold mb-2">{title}</h2>
              <p className="text-noor-muted text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="max-w-xl mx-auto mt-8 rounded-2xl p-6" style={{background:'#103329',border:'1px solid rgba(232,189,75,.28)'}}>
          <h2 className="font-display text-noor-ivory text-2xl font-semibold mb-2">Donation intent</h2>
          <p className="text-noor-muted text-sm mb-5">For now this stores your intention locally so the UI is complete. A real payment provider can be connected later.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <select className="rounded-xl px-3 py-3 bg-noor-bg text-noor-ivory border border-noor-border" defaultValue="Qur’an & Learning">
              {causes.map(c => <option key={c.title}>{c.title}</option>)}
            </select>
            <input type="number" min="1" placeholder="Amount (USD)" className="rounded-xl px-3 py-3 bg-noor-bg text-noor-ivory border border-noor-border" />
          </div>
          <button onClick={() => setSubmitted(true)} className="w-full rounded-full py-3 font-semibold" style={{background:'#E8BD4B',color:'#061812'}}>
            {submitted ? 'Thank you — intention saved ✓' : 'Continue →'}
          </button>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-xs text-noor-gold hover:underline">Back to Noor Home <ArrowRight size={12}/></Link>
        </div>
      </div>
    </div>
  );
}
