export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  img: string;
  alt: string;
  tag: 'Prophets' | 'Sahaba' | 'Prophet ﷺ' | 'Quranic Insights' | 'Islamic History';
  lesson: string;
  translationUrdu?: {
    title: string;
    excerpt: string;
    content: string[];
    lesson: string;
  };
}

export const STORIES: Story[] = [
  {
    slug: 'patience-of-prophet-ayub',
    title: 'The Patience of Prophet Ayub (AS)',
    excerpt: 'A story of steadfast patience, gratitude, and turning to Allah through hardship.',
    content: [
      'Prophet Ayub (AS) is remembered for extraordinary patience in the face of severe trials, losing his health, wealth, and family support.',
      'His story reminds us that hardship does not mean Allah has abandoned a believer. He continued to remember Allah and remained grateful while seeking relief with humility.',
      'For Noor readers, the practical lesson is simple: keep your salah, keep your dua, and keep hope alive even when a difficulty feels long.',
    ],
    img: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=1200&h=720&fit=crop&auto=format',
    alt: 'Mountain ridges at golden hour',
    tag: 'Prophets',
    lesson: 'Patience in hardship',
    translationUrdu: {
      title: 'حضرت ایوب علیٰہ السلام کا صبر',
      excerpt: 'استقامت، شکر گزاری اور آزمائش میں اللہ کی طرف رجوع کرنے کا ایک عظیم واقعہ۔',
      content: [
        'حضرت ایوب علیہ السلام کو سخت ترین آزمائشوں کے باوجود ان کے بے مثال صبر کے لیے یاد کیا جاتا ہے۔',
        'ان کا واقعہ ہمیں یاد دلاتا ہے کہ تکلیف کا مطلب یہ نہیں کہ اللہ نے مؤمن کو چھوڑ دیا ہے۔ انہوں نے ہمیشہ اللہ کا ذکر کیا اور عاجزی کے ساتھ دعا کی۔',
        'نور ایپ کا سبق: اپنی نماز اور دعا کو قائم رکھیں اور مشکل چاہے کتنی ہی لمبی ہو، امید کا دامن نہ چھوڑیں۔'
      ],
      lesson: 'آزمائش میں صبر اور شکر'
    }
  },
  {
    slug: 'courage-of-prophet-musa',
    title: 'The Courage of Prophet Musa (AS)',
    excerpt: 'From the Nile to Pharaoh, a journey of courage, trust, and reliance on Allah.',
    content: [
      'Prophet Musa (AS) faced situations that seemed impossible from a human perspective, yet he continued with unwavering trust in Allah.',
      'When trapped before the Red Sea with Pharaoh’s army approaching, his faith was steadfast: "Indeed, with me is my Lord; He will guide me."',
      'His story teaches that courage is not the absence of fear; it is choosing obedience and trust even when facing immense odds.',
    ],
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=720&fit=crop&auto=format',
    alt: 'Ocean waves',
    tag: 'Prophets',
    lesson: 'Trust in Allah',
    translationUrdu: {
      title: 'حضرت موسیٰ علیٰہ السلام کی شجاعت',
      excerpt: 'دریاۓ نیل سے فرعون کے دربار تک: شجاعت اور اللہ پر توکل کا سفر۔',
      content: [
        'حضرت موسیٰ علیہ السلام نے ان حالات کا سامنا کیا جو بظاہر ناممکن لگتے تھے، لیکن ان کا توکل کامل تھا۔',
        'فرعون کے لشکر اور سمندر کے درمیان گھِرے ہونے کے باوجود ان کا ایمان تھا: "ہرگز نہیں! میرے ساتھ میرا رب ہے، وہ میری رہنمائی فرمائے گا۔"',
        'سبق: حقیقی بہادری خوف کا نہ ہونا نہیں، بلکہ خوف کے باوجود اللہ کے حکم پر قائم رہنا ہے۔'
      ],
      lesson: 'اللہ کی ذات پر کامل توکل'
    }
  },
  {
    slug: 'forgiveness-of-prophet-yusuf',
    title: 'The Forgiveness of Prophet Yusuf (AS)',
    excerpt: 'A story of betrayal, resilience, forgiveness, and choosing mercy over revenge.',
    content: [
      'Prophet Yusuf (AS) endured betrayal by his brothers, separation from his father, and years of imprisonment before being given honor.',
      'When he finally had absolute power over those who had wronged him, he did not choose revenge. He said: "No blame upon you today. May Allah forgive you."',
      'The lesson for us is to release resentment and practice gracious forgiveness while leaving all outcomes to Allah.',
    ],
    img: 'https://images.unsplash.com/photo-1714273709859-fb5613b0aaa7?w=1200&h=720&fit=crop&auto=format',
    alt: 'Desert dunes',
    tag: 'Prophets',
    lesson: 'Power of forgiveness',
    translationUrdu: {
      title: 'حضرت یوسف علیٰہ السلام کا درگزر',
      excerpt: 'بھائیوں کی بے وفائی سے لے کر معافی اور رحم دلی کا ایک لازوال واقعہ۔',
      content: [
        'حضرت یوسف علیہ السلام نے بھائیوں کی بے وفائی، باپ سے جدائی اور قید و بند کی صعوبتیں برداش کیں۔',
        'جب انہیں تمام اختیارات حاصل ہوئے تو انہوں نے بدلہ لینے کے بجائے معافی کو چنا: "آج تم پر کوئی گرفت نہیں۔"',
        'سبق: دلوں کو کینے سے پاک رکھیں اور درگزر کرنا سیکھیں۔'
      ],
      lesson: 'عفو و درگزر کی طاقت'
    }
  },
  {
    slug: 'sincerity-of-hazrat-umar',
    title: 'The Sincerity of Hazrat Umar (RA)',
    excerpt: 'A transformation from strength and opposition to devoted service and justice.',
    content: [
      'Hazrat Umar ibn al-Khattab (RA) became known for unmatched courage, justice, humility, and deep concern for the Ummah.',
      'During his Caliphate, he walked the streets of Medina at night to ensure no family went hungry or uncared for.',
      'His life is a reminder that sincerity in faith directly translates into justice, responsibility, and service to humanity.',
    ],
    img: 'https://images.unsplash.com/photo-1577561426384-62154a1e9457?w=1200&h=720&fit=crop&auto=format',
    alt: 'Mosque interior',
    tag: 'Sahaba',
    lesson: 'Sincerity of faith',
    translationUrdu: {
      title: 'حضرت عمر فاروق رضی اللہ عنہ کا اخلاص',
      excerpt: 'عدل، انکساری اور امت کی فکر کا روشن باب۔',
      content: [
        'حضرت عمر فاروق رضی اللہ عنہ کو ان کے عدل، بہادری اور انکساری کے لیے جانا جاتا ہے۔',
        'آپ راتوں کو مدینہ کی گلیوں میں گشت کرتے تا کہ کوئی غریب یا ضرورت مند بھوکا نہ سوئے۔',
        'سبق: سچا ایمان انسان کی ذات میں عدل اور لوگوں کی خدمت کا جذبہ پیدا کرتا ہے۔'
      ],
      lesson: 'عدل اور اخلاصِ نیت'
    }
  },
  {
    slug: 'kindness-of-prophet-muhammad',
    title: 'The Kindness of Prophet Muhammad ﷺ',
    excerpt: 'A reflection on mercy, gentleness, dignity, and compassion in everyday life.',
    content: [
      'Prophet Muhammad ﷺ is sent as a mercy to all creation. His daily character exemplified gentleness, active listening, and generosity.',
      'He never spoke harshly to those under his care and always treated elders with respect, children with affection, and strangers with honor.',
      'A Noor daily practice: choose one intentional act of quiet kindness every day purely to seek Allah’s pleasure.',
    ],
    img: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1200&h=720&fit=crop&auto=format',
    alt: 'Green dome mosque',
    tag: 'Prophet ﷺ',
    lesson: 'Compassion for all',
    translationUrdu: {
      title: 'نبی کریم ﷺ کا اخلاق وِ حسنہ',
      excerpt: 'رحمت، نرم مزاجی اور پوری انسانیت کے لیے شفقت کا درس۔',
      content: [
        'نبی اکرم ﷺ کو تمام جہانوں کے لیے رحمت بنا کر بھیجا گیا۔ آپ کا اخلاق نرمی اور فیاضی کا اعلیٰ ترین نمونہ تھا۔',
        'آپ نے کبھی کسی سے سخت کلامی نہیں کی اور بچوں، بوڑھوں اور مسافروں کے ساتھ ہمیشہ شفقت کا معاملہ کیا۔',
        'سبق: روزانہ کی زندگی میں کسی ایک انسان کے ساتھ محض اللہ کی رضا کے لیے حسنِ اخلاق کا مظاہرہ کریں۔'
      ],
      lesson: 'تمام مخلوق کے لیے شفقت'
    }
  },
  {
    slug: 'generosity-of-abu-bakr',
    title: 'The Generosity of Hazrat Abu Bakr (RA)',
    excerpt: 'A story of sincere giving, sacrifice, and putting the pleasure of Allah first.',
    content: [
      'Hazrat Abu Bakr as-Siddiq (RA) was renowned for his unwavering devotion and selfless willingness to give everything for Islam.',
      'When asked to contribute for Tabuk, he donated his entire household wealth, leaving Allah and His Messenger ﷺ as his trust.',
      'Generosity begins with a willing heart, whether through sharing wealth, time, knowledge, or sincere words of comfort.',
    ],
    img: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=1200&h=720&fit=crop&auto=format&q=80',
    alt: 'Mountains at sunset',
    tag: 'Sahaba',
    lesson: 'Generosity',
    translationUrdu: {
      title: 'حضرت ابو بکر صدیق رضی اللہ عنہ کی سخاوت',
      excerpt: 'ایثار، قربانی اور اللہ کی راہ میں اپنا سب کچھ پیش کر دینے کا جذبہ۔',
      content: [
        'حضرت ابو بکر صدیق رضی اللہ عنہ اپنی صداقت اور بے مثال سخاوت کے لیے مشہور تھے۔',
        'غزوہ تبوک کے موقع پر آپ نے اپنے گھر کا تمام سامان اللہ کی راہ میں پیش کر دیا اور فرمایا: "گھر والوں کے لیے اللہ اور اس کا رسول کافی ہیں۔"',
        'سبق: سخاوت کا تعلق مال کے زیادہ ہونے سے نہیں بلکہ دل کی وسعت سے ہوتا ہے۔'
      ],
      lesson: 'ایثار اور بے لوث سخاوت'
    }
  }
];

// Helper Functions & Dynamic API Fetcher
export function getStory(slug: string): Story | undefined {
  if (!slug) return undefined;
  return STORIES.find((story) => story.slug.toLowerCase() === slug.toLowerCase());
}

// Fetch Dynamic Stories/Verses using Quran API (Quran.com Public API)
export async function fetchExternalIslamicStories(): Promise<Partial<Story>[]> {
  try {
    const res = await fetch('https://api.quran.com/api/v4/chapters?language=en');
    const data = await res.json();
    if (!data.chapters) return [];

    return data.chapters.slice(0, 5).map((ch: any) => ({
      slug: `surah-${ch.id}`,
      title: `Surah ${ch.name_simple} (${ch.translated_name.name})`,
      excerpt: `Reflections from Surah ${ch.name_simple}, revealed in ${ch.revelation_place}.`,
      content: [
        `Surah ${ch.name_simple} consists of ${ch.verses_count} verses and carries profound spiritual lessons for believers.`,
        `Reading and contemplating Surah ${ch.name_simple} helps strengthen faith, offering divine peace and clarity.`,
      ],
      img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=720&fit=crop&auto=format',
      alt: 'Quran reading',
      tag: 'Quranic Insights',
      lesson: `Contemplation on Surah ${ch.name_simple}`,
    }));
  } catch (err) {
    console.warn('Unable to fetch live Quranic stories, falling back to static stories:', err);
    return [];
  }
}
