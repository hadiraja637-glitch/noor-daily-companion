import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getStory, STORIES } from '../data/stories';

export default function StoryDetail() {
  const { slug } = useParams();
  const story = slug ? getStory(slug) : undefined;

  if (!story) {
    return (
      <div className="min-h-screen pt-24 pb-24 px-4 flex items-center justify-center" style={{ background: '#061812' }}>
        <div className="max-w-xl text-center rounded-2xl p-8" style={{ background: '#103329', border: '1px solid rgba(232,189,75,.25)' }}>
          <BookOpen className="mx-auto text-noor-gold mb-4" />
          <h1 className="font-display text-noor-ivory text-3xl font-semibold mb-3">Story not found</h1>
          <Link to="/stories" className="text-noor-gold hover:underline">Back to Islamic Stories</Link>
        </div>
      </div>
    );
  }

  const currentIndex = STORIES.findIndex((item) => item.slug === story.slug);
  const previous = STORIES[currentIndex - 1];
  const next = STORIES[currentIndex + 1];

  return (
    <article className="min-h-screen pt-20 pb-24 lg:pb-10" style={{ background: '#061812' }}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="py-8">
          <Link to="/stories" className="inline-flex items-center gap-2 text-noor-muted text-sm hover:text-noor-gold mb-6">
            <ArrowLeft size={14} /> All Islamic Stories
          </Link>
          <span className="block text-noor-gold text-xs tracking-[0.2em] uppercase mb-3">{story.tag} · {story.lesson}</span>
          <h1 className="font-display text-noor-ivory text-4xl sm:text-5xl font-semibold leading-tight mb-4">{story.title}</h1>
          <p className="text-noor-muted max-w-3xl text-base leading-relaxed">{story.excerpt}</p>
        </div>

        <div className="rounded-3xl overflow-hidden mb-8" style={{ border: '1px solid rgba(26,64,53,.7)', background: '#103329' }}>
          <img src={story.img} alt={story.alt} className="w-full h-[280px] sm:h-[420px] object-cover" />
          <div className="p-6 sm:p-8">
            <div className="max-w-3xl space-y-5">
              {story.content.map((paragraph) => (
                <p key={paragraph} className="text-noor-ivory/80 text-base sm:text-lg leading-8">{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-noor-border flex flex-wrap gap-3">
              {previous && <Link to={`/stories/${previous.slug}`} className="btn-outline-noor inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"><ArrowLeft size={13} /> Previous</Link>}
              {next && <Link to={`/stories/${next.slug}`} className="btn-outline-noor inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm">Next <ArrowRight size={13} /></Link>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
