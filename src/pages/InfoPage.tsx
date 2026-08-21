import { Link } from 'react-router';

const CONTENT: Record<string, { title: string; intro: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'Noor is designed to be useful without asking for unnecessary personal information.',
    sections: [
      { heading: 'Information we use', body: 'Noor may use information you choose to provide, such as an email address for newsletter signup. Browser-only preferences such as bookmarks can be stored locally on your device.' },
      { heading: 'Location', body: 'Location may be requested for features such as prayer times and Qibla. Where possible, Noor uses your device location only for the requested feature and does not need an account for basic use.' },
      { heading: 'Third-party services', body: 'Some content, such as Qur’an text, translations, prayer calculations or audio, may be delivered by external services. Their own terms and privacy policies apply to those services.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'Noor provides Islamic learning and utility features for educational and personal use.',
    sections: [
      { heading: 'Content', body: 'Qur’an, hadith, duas and other religious material should be treated with respect. Where a source or translator is used, Noor aims to preserve attribution and source information.' },
      { heading: 'Utilities', body: 'Prayer times, Qibla, Zakat and calendar tools are convenience tools. For matters requiring a religious ruling or financial decision, consult a qualified scholar or appropriate professional.' },
      { heading: 'Availability', body: 'Noor may depend on external APIs and device capabilities. Features can be unavailable temporarily because of network, browser or service limitations.' },
    ],
  },
  contact: {
    title: 'Contact Noor',
    intro: 'We would love to hear about bugs, ideas and useful Islamic features you would like to see.',
    sections: [
      { heading: 'Feedback', body: 'For now, use the contact address configured by the site owner before launch. This page is intentionally simple so the production email can be added without changing the design.' },
      { heading: 'Feature requests', body: 'Tell us what would make Noor more helpful for your daily prayer, Qur’an reading, remembrance and learning.' },
    ],
  },
  about: {
    title: 'About Noor',
    intro: 'Noor is a daily companion for prayer, remembrance & giving.',
    sections: [
      { heading: 'Our purpose', body: 'The goal is to bring essential Islamic tools together in one calm, beautiful and accessible experience.' },
      { heading: 'Built for the Ummah', body: 'Noor combines practical utilities with Qur’an, hadith, duas, stories and reflective reading in a respectful interface.' },
    ],
  },
};

export default function InfoPage() {
  const slug = window.location.pathname.replace(/^\//, '').split('/')[0] || 'about';
  const page = CONTENT[slug] || CONTENT.about;

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-10 bg-noor-bg">
      <div className="py-14 text-center relative overflow-hidden bg-noor-bg2 border-b border-noor-border">
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative px-4">
          <p className="font-arabic text-noor-gold text-xl mb-2">نور</p>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold">{page.title}</h1>
          <p className="text-noor-muted text-sm mt-2 max-w-xl mx-auto">{page.intro}</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
        <div className="rounded-2xl p-6 sm:p-8 bg-noor-card border border-noor-border space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-noor-ivory text-2xl font-semibold mb-2">{section.heading}</h2>
              <p className="text-noor-muted text-sm leading-7">{section.body}</p>
            </section>
          ))}
          <Link to="/" className="inline-flex text-noor-gold text-sm hover:underline">← Back to Noor</Link>
        </div>
      </div>
    </div>
  );
}
