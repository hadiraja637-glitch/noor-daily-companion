export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  img: string;
  alt: string;
  tag: string;
  lesson: string;
}

export const STORIES: Story[] = [
  {
    slug: 'patience-of-prophet-ayub',
    title: 'The Patience of Prophet Ayub (AS)',
    excerpt: 'A story of steadfast patience, gratitude, and turning to Allah through hardship.',
    content: [
      'Prophet Ayub (AS) is remembered for extraordinary patience in the face of severe trials.',
      'His story reminds us that hardship does not mean Allah has abandoned a believer. He continued to remember Allah and remained grateful while seeking relief with humility.',
      'For Noor readers, the practical lesson is simple: keep your salah, keep your dua, and keep hope alive even when a difficulty feels long.',
    ],
    img: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=1200&h=720&fit=crop&auto=format',
    alt: 'Mountain ridges at golden hour',
    tag: 'Prophets',
    lesson: 'Patience in hardship',
  },
  {
    slug: 'courage-of-prophet-musa',
    title: 'The Courage of Prophet Musa (AS)',
    excerpt: 'From the Nile to Pharaoh, a journey of courage, trust, and reliance on Allah.',
    content: [
      'Prophet Musa (AS) faced situations that seemed impossible from a human perspective, yet he continued with trust in Allah.',
      'His story teaches that courage is not the absence of fear; it is choosing obedience and trust even when fear is present.',
      'A Noor daily practice: when facing a difficult decision, pause for dua, seek sound advice, and place your reliance on Allah.',
    ],
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=720&fit=crop&auto=format',
    alt: 'Ocean waves',
    tag: 'Prophets',
    lesson: 'Trust in Allah',
  },
  {
    slug: 'forgiveness-of-prophet-yusuf',
    title: 'The Forgiveness of Prophet Yusuf (AS)',
    excerpt: 'A story of betrayal, resilience, forgiveness, and choosing mercy over revenge.',
    content: [
      'Prophet Yusuf (AS) endured betrayal by his brothers, separation from his family, and years of difficulty before being given honor and responsibility.',
      'When he finally had power over those who had wronged him, he did not choose revenge. His response reflected mercy, wisdom, and trust in Allah’s plan.',
      'The lesson for us is to release resentment when we can, while keeping justice, boundaries, and wisdom in place.',
    ],
    img: 'https://images.unsplash.com/photo-1714273709859-fb5613b0aaa7?w=1200&h=720&fit=crop&auto=format',
    alt: 'Desert dunes',
    tag: 'Prophets',
    lesson: 'Power of forgiveness',
  },
  {
    slug: 'sincerity-of-hazrat-umar',
    title: 'The Sincerity of Hazrat Umar (RA)',
    excerpt: 'A transformation from strength and opposition to devoted service and justice.',
    content: [
      'Hazrat Umar ibn al-Khattab (RA) became known for courage, justice, humility, and deep concern for the Ummah.',
      'His life is a reminder that a person can change profoundly when guidance enters the heart.',
      'The practical takeaway is to keep returning to Allah, keep correcting ourselves, and let faith shape how we treat people.',
    ],
    img: 'https://images.unsplash.com/photo-1577561426384-62154a1e9457?w=1200&h=720&fit=crop&auto=format',
    alt: 'Mosque interior',
    tag: 'Sahaba',
    lesson: 'Sincerity of faith',
  },
  {
    slug: 'kindness-of-prophet-muhammad',
    title: 'The Kindness of Prophet Muhammad ﷺ',
    excerpt: 'A reflection on mercy, gentleness, dignity, and compassion in everyday life.',
    content: [
      'The Prophet Muhammad ﷺ is described as a mercy to the worlds. His character included gentleness, patience, generosity, and attention to the vulnerable.',
      'That character can be brought into daily life through small acts: listening well, speaking gently, forgiving mistakes, and helping people without humiliation.',
      'A Noor habit: choose one intentional act of kindness every day and make it purely for Allah.',
    ],
    img: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1200&h=720&fit=crop&auto=format',
    alt: 'Green dome mosque',
    tag: 'Prophet ﷺ',
    lesson: 'Compassion for all',
  },
  {
    slug: 'generosity-of-abu-bakr',
    title: 'The Generosity of Hazrat Abu Bakr (RA)',
    excerpt: 'A story of sincere giving, sacrifice, and putting the pleasure of Allah first.',
    content: [
      'Hazrat Abu Bakr (RA) is remembered for his deep sincerity, loyalty, and generosity.',
      'His example encourages believers to give from what Allah has provided, whether that means wealth, time, support, knowledge, or encouragement.',
      'Generosity does not require being rich. It begins with a willing heart and the intention to help for Allah’s sake.',
    ],
    img: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=1200&h=720&fit=crop&auto=format&q=80',
    alt: 'Mountains at sunset',
    tag: 'Sahaba',
    lesson: 'Generosity',
  },
];

export function getStory(slug: string) {
  return STORIES.find((story) => story.slug === slug);
}
