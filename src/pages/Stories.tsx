import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { STORIES } from '../data/stories';

export default function Stories() {
  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div
        className="py-12 mb-8 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative">
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Islamic Stories</h1>
          <p className="text-noor-muted text-sm max-w-md mx-auto leading-relaxed">
            Inspiring stories from the lives of the Prophets, Sahaba and righteous people
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map((s, i) => (
            <Link
              key={s.slug}
              to={`/stories/${s.slug}`}
              className="block rounded-2xl overflow-hidden group cursor-pointer transition-all hover:-translate-y-1"
              style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(16,51,41,0.9) 0%, rgba(16,51,41,0.1) 60%)' }}
                />
                <span
                  className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(232,189,75,0.18)',
                    color: '#E8BD4B',
                    border: '1px solid rgba(232,189,75,0.3)',
                  }}
                >
                  {s.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: '#18B98A' }}
                  />
                  <span className="text-noor-accent text-xs">{s.lesson}</span>
                </div>
                <h3 className="font-display text-noor-ivory font-semibold text-lg leading-snug mb-2 group-hover:text-noor-gold transition-colors">
                  {s.title}
                </h3>
                <p className="text-noor-muted text-sm leading-relaxed mb-4 line-clamp-3">{s.excerpt}</p>
                <span className="flex items-center gap-1.5 text-xs text-noor-gold group-hover:underline">
                  Read Full Story <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
