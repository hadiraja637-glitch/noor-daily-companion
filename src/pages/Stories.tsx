import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, BookOpen, Search, Sparkles, Clock, Library, ShieldCheck } from 'lucide-react';

export type StoryLesson = { title: string; text: string };
export type StorySource = { label: string; reference: string };

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  tag: 'Prophets' | 'Sahabah' | 'Prophet ﷺ' | 'Qur’anic Stories';
  lesson: string;
  img: string;
  alt: string;
  readingTime: number;
  content: string[];
  lessons: StoryLesson[];
  sources: StorySource[];
  reflection: string;
  takeaway: string;
  relatedSlugs: string[];
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`;

export const STORIES: Story[] = [
  {
    slug: 'yusuf-patience-through-trials',
    title: 'Prophet Yusuf: Patience Through Trials',
    excerpt: 'A journey from a painful family betrayal to prison, forgiveness, and a position of responsibility — showing how Allah can unfold wisdom through years of hardship.',
    tag: 'Prophets',
    lesson: 'Patience & trust in Allah',
    img: img('photo-1500534623283-312aade485b7'),
    alt: 'A quiet desert landscape under a wide sky',
    readingTime: 7,
    content: [
      'The Qur’an presents the story of Yusuf عليه السلام as one of its most complete narratives. Yusuf was a young boy when he saw a remarkable dream and told his father, Ya‘qub عليه السلام. His father understood that the dream was significant and advised him carefully.',
      'Yusuf’s brothers became jealous of him. Their jealousy led them to take him away and cast him into a well, then return to their father with a false account. Yusuf’s life changed suddenly: the security of his home was replaced by danger, separation, and uncertainty.',
      'He was later taken to Egypt and eventually imprisoned after refusing to compromise his integrity. Even in prison, Yusuf did not allow hardship to erase his character. He continued to speak with wisdom and called people toward the worship of Allah.',
      'Allah eventually opened a path for Yusuf. He was brought before the ruler because of his ability to interpret a dream. Yusuf did not simply seek personal status; he explained the coming years of harvest and hardship and offered a practical plan for preserving the country’s resources.',
      'The story then reaches a powerful moment of reconciliation. Yusuf’s brothers came before him without recognizing him. When the truth became clear, Yusuf chose forgiveness rather than revenge. His response shows that strength is not only the ability to overcome an enemy; it is also the ability to control what one does after gaining power over someone who once caused pain.',
      'The Qur’an closes the narrative by showing how Yusuf’s early dream was ultimately fulfilled. The long road was not meaningless. What looked like a series of disconnected losses became part of a larger plan known fully only to Allah.'
    ],
    lessons: [
      { title: 'Stay patient without becoming passive', text: 'Yusuf continued to act with integrity while circumstances were outside his control.' },
      { title: 'Protect your character in difficulty', text: 'Hardship did not become an excuse for Yusuf to abandon truth or principle.' },
      { title: 'Use ability for public good', text: 'When given authority, Yusuf focused on responsible stewardship rather than personal glory.' },
      { title: 'Forgiveness can be a form of strength', text: 'When Yusuf finally had power over his brothers, he did not turn old pain into revenge.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Yusuf 12:4–6, 12:15–18, 12:23–35, 12:43–57, 12:88–101' }
    ],
    reflection: 'A difficult chapter is not necessarily the final chapter. Yusuf’s story teaches us to judge a situation with humility because we cannot see the complete plan that Allah is unfolding.',
    takeaway: 'Keep your character steady while you wait for Allah to open the next door.',
    relatedSlugs: ['prophet-ayyub-patience-in-hardship', 'prophet-yunus-from-darkness-to-dua', 'prophet-musa-when-the-sea-was-ahead']
  },
  {
    slug: 'ibrahim-and-the-fire',
    title: 'Prophet Ibrahim: Faith When the Crowd Stands Against You',
    excerpt: 'Ibrahim عليه السلام challenged false worship with clarity and courage, then trusted Allah when his people turned against him.',
    tag: 'Prophets',
    lesson: 'Courage with conviction',
    img: img('photo-1500530855697-b586d89ba3ee'),
    alt: 'A rocky landscape representing a difficult journey',
    readingTime: 6,
    content: [
      'Ibrahim عليه السلام is repeatedly presented in the Qur’an as a person of deep conviction. He questioned the worship of created things and called his people toward the One who created the heavens and the earth.',
      'The Qur’an records his reasoning against the worship of celestial bodies. The point was not that Ibrahim believed the stars, moon, or sun were divine and then changed his mind. Rather, the passage presents an argument demonstrating that things which rise, set, change, and disappear cannot be the ultimate Lord.',
      'Ibrahim then confronted the idols of his people. He wanted them to recognize the weakness of objects that could neither speak nor defend themselves. His people responded with anger instead of accepting the argument.',
      'The confrontation became severe. Ibrahim was threatened with being burned. Yet the Qur’an records Allah’s command to the fire to become cool and safe for Ibrahim. His rescue was not the result of social approval; it came from Allah.',
      'The story is especially relevant when a person feels alone for holding onto a principle. Ibrahim’s example does not teach reckless confrontation. It teaches that truth should be followed with knowledge, courage, and reliance upon Allah, even when popularity is against you.'
    ],
    lessons: [
      { title: 'Think carefully about what you follow', text: 'Faith is not meant to be inherited as an unexamined habit; Ibrahim called people to evidence and reflection.' },
      { title: 'Truth is not measured by popularity', text: 'A large crowd cannot turn falsehood into truth.' },
      { title: 'Courage needs wisdom', text: 'Ibrahim argued and reasoned rather than relying on anger or empty slogans.' },
      { title: 'Allah controls the outcome', text: 'The command concerning the fire reminds believers that created causes remain under Allah’s command.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Al-Anbiya 21:51–70; Surah Al-An‘am 6:74–83' }
    ],
    reflection: 'Sometimes the hardest part of doing what is right is accepting that people may not immediately understand it. Ibrahim’s example turns that loneliness into an opportunity for sincerity.',
    takeaway: 'Let conviction be guided by knowledge, and let courage be anchored in trust in Allah.',
    relatedSlugs: ['companions-of-the-cave-faith-under-pressure', 'prophet-musa-when-the-sea-was-ahead', 'abu-bakr-in-the-cave']
  },
  {
    slug: 'prophet-musa-when-the-sea-was-ahead',
    title: 'Prophet Musa: When the Sea Was Ahead',
    excerpt: 'When Musa عليه السلام and the believers were trapped between the sea and Pharaoh’s army, certainty in Allah replaced panic.',
    tag: 'Prophets',
    lesson: 'Tawakkul in a crisis',
    img: img('photo-1507525428034-b723cf961d3e'),
    alt: 'A vast sea stretching toward the horizon',
    readingTime: 5,
    content: [
      'Musa عليه السلام was leading the Children of Israel away from Pharaoh when a terrifying situation developed. Pharaoh and his forces pursued them, while the sea stood before them.',
      'From an ordinary human perspective, the situation looked impossible. The people with Musa feared that the pursuers would catch them. The Qur’an records Musa’s answer: he was certain that his Lord would guide them.',
      'Allah then instructed Musa to strike the sea with his staff. The sea parted, creating a path for the believers. Musa and those with him crossed, while Pharaoh’s pursuing forces were drowned.',
      'The key lesson is not simply that a miracle happened. The passage places Musa’s certainty before the visible solution appeared. His confidence was rooted in Allah’s promise and command, not in a visible escape route.',
      'For believers, this does not mean ignoring practical danger. It means that fear should not be allowed to erase trust in Allah. We take the means available to us while remembering that the final outcome is in His hands.'
    ],
    lessons: [
      { title: 'Do not confuse fear with failure', text: 'Feeling afraid in a crisis is human; allowing fear to destroy trust in Allah is the danger.' },
      { title: 'Tawakkul comes before the visible answer', text: 'Musa expressed confidence while the sea was still in front of them.' },
      { title: 'Follow Allah’s guidance', text: 'The rescue came through obedience to the command Allah gave Musa.' },
      { title: 'Remember the limits of your perspective', text: 'What looks like a dead end to us is never a limitation upon Allah.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Ash-Shu‘ara 26:60–68; Surah Ta-Ha 20:77–79' }
    ],
    reflection: 'There are moments when every option seems blocked. The story of Musa reminds us that Allah does not need the path to exist before He creates it.',
    takeaway: 'When you cannot see the way forward, keep obeying Allah and keep your heart anchored to Him.',
    relatedSlugs: ['prophet-yunus-from-darkness-to-dua', 'ibrahim-and-the-fire', 'abu-bakr-in-the-cave']
  },
  {
    slug: 'prophet-yunus-from-darkness-to-dua',
    title: 'Prophet Yunus: A Dua from the Depths of Darkness',
    excerpt: 'Yunus عليه السلام turned back to Allah in a moment of layered darkness, and his sincere supplication became a lasting lesson in repentance.',
    tag: 'Prophets',
    lesson: 'Repentance & hope',
    img: img('photo-1500534314209-a25ddb2bd429'),
    alt: 'Dark ocean water beneath a cloudy sky',
    readingTime: 5,
    content: [
      'The Qur’an describes Yunus عليه السلام as the companion of the fish and records the supplication he made after reaching a place of intense distress. The story is a lesson in returning to Allah when a person recognizes their own weakness.',
      'Yunus called upon Allah from darkness. The Qur’an records his declaration of Allah’s perfection and his acknowledgment that he had been among those who had done wrong.',
      'The story does not teach despair. Instead, it shows that recognizing one’s mistake can become the beginning of sincere return. A believer does not need to pretend to be perfect before turning to Allah.',
      'Allah answered Yunus’s call and saved him from distress. The Qur’an then connects this event to a wider principle: Allah responds to believing people when they call upon Him.',
      'This makes the story especially meaningful for anyone carrying regret. Repentance is not a statement that the past never happened. It is a decision to turn back to Allah and move forward with humility.'
    ],
    lessons: [
      { title: 'Admit your weakness before Allah', text: 'Yunus’s supplication combined glorifying Allah with acknowledging his own wrong.' },
      { title: 'Never let regret become despair', text: 'The door of returning to Allah is not closed because you made a mistake.' },
      { title: 'Dua is an act of dependence', text: 'Calling upon Allah is itself a recognition that we need Him.' },
      { title: 'A difficult moment can transform you', text: 'The experience became a lasting lesson in humility, remembrance, and hope.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Al-Anbiya 21:87–88; Surah As-Saffat 37:139–148' }
    ],
    reflection: 'If you are ashamed of something you did, do not allow shame to convince you that you should stay far from Allah. The right response to sin is return, not surrender.',
    takeaway: 'Turn back to Allah quickly, honestly, and with hope.',
    relatedSlugs: ['prophet-ayyub-patience-in-hardship', 'yusuf-patience-through-trials', 'companions-of-the-cave-faith-under-pressure']
  },
  {
    slug: 'maryam-strength-in-solitude',
    title: 'Maryam: Strength, Modesty and Trust',
    excerpt: 'Maryam عليها السلام faced an overwhelming situation alone, yet the Qur’an portrays her with devotion, dignity, and reliance upon Allah.',
    tag: 'Qur’anic Stories',
    lesson: 'Dignity in hardship',
    img: img('photo-1519817650390-64a93db51149'),
    alt: 'A peaceful path through a natural landscape',
    readingTime: 6,
    content: [
      'The Qur’an gives Maryam عليها السلام a remarkable place in its narrative. Her story begins with devotion and worship and later describes a test that placed her under enormous emotional and social pressure.',
      'Maryam withdrew from her family to an eastern place and took a screen between herself and others. The Qur’an then describes the arrival of the angel who appeared to her in the form of a man. Maryam immediately sought refuge in the Most Merciful.',
      'She was given the news of a son, Isa عليه السلام, despite the fact that no man had touched her. Maryam was naturally overwhelmed by the impossibility of the situation from an ordinary human perspective.',
      'When the birth became near, she experienced intense distress. Allah did not abandon her. She was directed toward a palm tree, provided with water, and told not to grieve. The passage then shows how Allah provided for her and instructed her regarding what to say when she returned to her people.',
      'Maryam’s story teaches that dignity does not require a person to avoid every painful circumstance. Sometimes a righteous person can be placed in a situation they did not choose. What matters is remaining truthful, turning to Allah, and trusting His care.'
    ],
    lessons: [
      { title: 'Protect your relationship with Allah', text: 'Maryam’s response to an overwhelming situation was rooted in worship and seeking Allah’s protection.' },
      { title: 'Hardship does not erase dignity', text: 'The Qur’anic account treats Maryam with honor while describing the difficulty she endured.' },
      { title: 'Allah can provide from unexpected means', text: 'The water and dates in the passage remind us that provision can arrive in ways we did not expect.' },
      { title: 'Do not carry tomorrow’s fear today', text: 'Maryam was guided through the immediate step before her rather than being left to solve the entire future at once.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Maryam 19:16–36; Surah Aal ‘Imran 3:35–47' }
    ],
    reflection: 'Some tests feel frightening because we cannot control what other people will think. Maryam’s story reminds us that Allah knows the truth even when people do not.',
    takeaway: 'Protect your faith and dignity, then leave what you cannot control to Allah.',
    relatedSlugs: ['prophet-yunus-from-darkness-to-dua', 'companions-of-the-cave-faith-under-pressure', 'prophet-ayyub-patience-in-hardship']
  },
  {
    slug: 'companions-of-the-cave-faith-under-pressure',
    title: 'The Companions of the Cave: Faith Under Pressure',
    excerpt: 'A group of believing youths withdrew to protect their faith, and Allah made their story a sign of His power and care.',
    tag: 'Qur’anic Stories',
    lesson: 'Protecting faith',
    img: img('photo-1511497584788-876760111969'),
    alt: 'A rocky cave entrance surrounded by trees',
    readingTime: 6,
    content: [
      'Surah Al-Kahf tells of a group of young believers who stood firm in their faith. They lived in circumstances where their belief was under pressure, so they sought refuge in a cave and asked Allah for mercy and right guidance.',
      'Their prayer is significant: they did not only ask Allah to remove difficulty. They asked for mercy and for the right outcome in their affair. Their hearts were concerned with remaining guided.',
      'Allah then caused them to sleep in the cave for a long period. The Qur’an describes their awakening and the way their story became a sign. The exact details that people may argue about are deliberately not the focus; the Qur’an itself warns against speculative arguments over matters such as their number.',
      'The passage also teaches believers to say “if Allah wills” when speaking about future plans. This is connected to remembering that human plans remain dependent upon Allah’s will.',
      'The story is therefore not simply about a miraculous sleep. It is about young people protecting faith, asking Allah for guidance, and trusting Him when they cannot control the wider environment around them.'
    ],
    lessons: [
      { title: 'Protect your faith intentionally', text: 'The youths did not treat their beliefs as something to compromise casually.' },
      { title: 'Ask Allah for guidance, not only comfort', text: 'Their prayer asked for mercy and a rightly guided outcome.' },
      { title: 'Avoid unnecessary speculation', text: 'The Qur’an itself redirects attention away from arguments about details that do not carry the main lesson.' },
      { title: 'Remember Allah when making plans', text: 'The passage teaches believers to acknowledge Allah’s will when speaking about the future.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Al-Kahf 18:9–26' }
    ],
    reflection: 'Young people often feel pressure to fit in. The Companions of the Cave show that faith sometimes requires deliberate choices about the environment we keep around ourselves.',
    takeaway: 'When your faith is under pressure, ask Allah for guidance and choose what protects it.',
    relatedSlugs: ['ibrahim-and-the-fire', 'maryam-strength-in-solitude', 'abu-bakr-in-the-cave']
  },
  {
    slug: 'prophet-ayyub-patience-in-hardship',
    title: 'Prophet Ayyub: Patience Without Losing Hope',
    excerpt: 'Ayyub عليه السلام called upon his Lord during severe hardship, showing that patience does not mean pretending pain does not exist.',
    tag: 'Prophets',
    lesson: 'Sabr with hope',
    img: img('photo-1501785888041-af3ef285b470'),
    alt: 'Mountain landscape with a long path',
    readingTime: 5,
    content: [
      'The Qur’an remembers Ayyub عليه السلام as a servant of Allah who endured severe hardship. The passage does not require believers to deny pain. Instead, it shows Ayyub turning to his Lord while remaining within the boundaries of faith and patience.',
      'Ayyub called upon Allah and described his suffering. His words were not a complaint against Allah’s wisdom; they were a humble plea for mercy. He recognized Allah as the Most Merciful.',
      'Allah answered him and removed the hardship. The Qur’an also describes Ayyub as a patient servant and praises him for his devotion.',
      'This is an important distinction: sabr is not emotional numbness. A person can hurt, ask Allah for relief, and still remain patient. Patience means refusing to let suffering destroy faith, worship, or moral character.',
      'For anyone going through a long difficulty, Ayyub’s story offers a balanced form of hope: acknowledge what hurts, ask Allah for help, continue doing what is right, and trust that relief is ultimately under Allah’s control.'
    ],
    lessons: [
      { title: 'You may ask Allah for relief', text: 'Ayyub turned to Allah about his suffering instead of hiding his need.' },
      { title: 'Sabr is not pretending everything is easy', text: 'Patience can exist alongside pain, tears, and sincere dua.' },
      { title: 'Keep your worship alive', text: 'Hardship should not become a reason to abandon your relationship with Allah.' },
      { title: 'Hope remains meaningful during delay', text: 'A long test does not mean Allah has forgotten His servant.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah Al-Anbiya 21:83–84; Surah Sad 38:41–44' }
    ],
    reflection: 'When relief is delayed, it is easy to think that nothing is changing. Ayyub’s story teaches that a believer can keep asking, keep worshipping, and keep hoping without knowing the exact timing of relief.',
    takeaway: 'Be patient without becoming hopeless, and keep your dua alive.',
    relatedSlugs: ['prophet-yunus-from-darkness-to-dua', 'yusuf-patience-through-trials', 'maryam-strength-in-solitude']
  },
  {
    slug: 'sulayman-and-the-ant',
    title: 'Prophet Sulayman: The Ant and the Gratitude of Power',
    excerpt: 'Sulayman عليه السلام was given extraordinary authority, yet the Qur’an highlights his gratitude when he noticed the smallest creatures.',
    tag: 'Qur’anic Stories',
    lesson: 'Gratitude with power',
    img: img('photo-1470770841072-f978cf4d019e'),
    alt: 'A green valley and mountain landscape',
    readingTime: 5,
    content: [
      'Sulayman عليه السلام was given an extraordinary kingdom and abilities by Allah. The Qur’an describes his knowledge of the speech of birds and his ability to understand the communication of creatures.',
      'During a journey, Sulayman and his forces came to a valley of ants. One ant warned the others to enter their dwellings so they would not be crushed unknowingly by the army.',
      'Sulayman smiled at the ant’s words and immediately turned the moment into gratitude. He asked Allah to enable him to be thankful for His favor and to do righteous deeds that please Him.',
      'The lesson is striking because Sulayman had immense authority. Yet greater power did not make him careless about small creatures or proud of himself. His response to blessing was to recognize its source.',
      'The story also gives a broader principle: blessings are tests. Knowledge, money, influence, intelligence, or leadership can either increase a person’s gratitude or increase their arrogance. The believer should use every blessing as a reason to return praise to Allah and serve creation responsibly.'
    ],
    lessons: [
      { title: 'Recognize the source of blessings', text: 'Sulayman attributed his ability and success to Allah rather than treating them as self-created achievements.' },
      { title: 'Power should increase responsibility', text: 'Authority is a trust, not permission to become careless or arrogant.' },
      { title: 'Notice the small things', text: 'The Qur’anic story draws attention to a tiny creature and a significant lesson.' },
      { title: 'Turn blessings into worship', text: 'Sulayman responded to a moment of awareness with dua and a desire to do righteous deeds.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah An-Naml 27:15–19' }
    ],
    reflection: 'We often ask Allah for more while forgetting to ask Him to make us grateful for what we already have. Sulayman’s dua puts gratitude and righteous action together.',
    takeaway: 'The best response to a blessing is not pride — it is gratitude followed by good action.',
    relatedSlugs: ['ibrahim-and-the-fire', 'prophet-musa-when-the-sea-was-ahead', 'yusuf-patience-through-trials']
  },
  {
    slug: 'abu-bakr-in-the-cave',
    title: 'Abu Bakr in the Cave: “Allah Is With Us”',
    excerpt: 'During the Hijrah, the Prophet ﷺ and Abu Bakr رضي الله عنه were in the cave when danger was close. The Qur’an preserves a powerful lesson in calm reliance upon Allah.',
    tag: 'Sahabah',
    lesson: 'Calm reliance on Allah',
    img: img('photo-1464822759023-fed622ff2c3b'),
    alt: 'A rugged mountain landscape representing a difficult journey',
    readingTime: 5,
    content: [
      'The Qur’an refers to the moment when the Prophet Muhammad ﷺ was driven from Makkah and was one of two in the cave. His companion was Abu Bakr رضي الله عنه.',
      'The danger was real. Yet the Prophet ﷺ told his companion not to grieve because Allah was with them. The verse then mentions the tranquillity Allah sent down and His support for His Messenger.',
      'This is an important example of tawakkul. Reliance upon Allah did not mean that the Prophet ﷺ and Abu Bakr ignored practical means. They were in the middle of a carefully undertaken journey. Their trust existed alongside effort, planning, and movement.',
      'The Qur’anic account focuses our attention on where the heart should turn when circumstances become frightening. The believer may feel fear, but fear does not need to become the final authority over the heart.',
      'Abu Bakr’s companionship in this moment also reminds us that righteous companionship matters. A person facing difficulty needs people who strengthen faith rather than increase panic.'
    ],
    lessons: [
      { title: 'Take means and trust Allah', text: 'Tawakkul is not abandoning practical effort; it is refusing to believe that effort controls the final outcome independently of Allah.' },
      { title: 'Calm can be an act of faith', text: 'The Prophet’s words redirected attention from immediate danger to Allah’s presence and care.' },
      { title: 'Good companionship matters', text: 'Abu Bakr was present in one of the most difficult moments of the Hijrah.' },
      { title: 'Do not let fear make your decisions', text: 'Fear can be real while still being placed beneath trust in Allah.' }
    ],
    sources: [
      { label: 'Qur’an', reference: 'Surah At-Tawbah 9:40' }
    ],
    reflection: 'Sometimes we want certainty that every danger has disappeared before we feel calm. This verse teaches a deeper kind of calm: knowing that Allah is with His servants even while the danger is still present.',
    takeaway: 'Do what you can, then place the outcome with Allah.',
    relatedSlugs: ['prophet-musa-when-the-sea-was-ahead', 'companions-of-the-cave-faith-under-pressure', 'ibrahim-and-the-fire']
  },
  {
    slug: 'prophet-muhammad-and-anas',
    title: 'The Prophet ﷺ and Anas: Gentle Character in Everyday Life',
    excerpt: 'Anas رضي الله عنه served the Prophet ﷺ for years and described a pattern of gentleness that turns ordinary interactions into a lesson in character.',
    tag: 'Prophet ﷺ',
    lesson: 'Gentleness & character',
    img: img('photo-1497250681960-ef046c08a56e'),
    alt: 'A quiet green path symbolizing gentle character',
    readingTime: 4,
    content: [
      'Some of the strongest lessons about the Prophet Muhammad’s ﷺ character come through everyday interactions rather than dramatic events. Anas ibn Malik رضي الله عنه served the Prophet ﷺ for many years and narrated what he experienced personally.',
      'In Sahih al-Bukhari, Anas reports that the Prophet ﷺ never said “Uf” to him and never repeatedly blamed him by asking why he had done something or why he had failed to do something. This is a powerful description because it concerns ordinary human mistakes and daily life.',
      'Sahih Muslim also records an incident in which the Prophet ﷺ approached Anas after he had delayed carrying out an errand. The Prophet ﷺ smiled and asked him about it rather than responding with humiliation or harshness.',
      'Gentleness does not mean that mistakes never need correction. It means correction can preserve a person’s dignity. A teacher, parent, older sibling, manager, or friend can hold someone accountable without turning every mistake into an attack on their character.',
      'The Sunnah therefore gives us a practical question: when someone makes a small mistake around us, do we make the situation heavier than it needs to be? Good character is often revealed in these small moments.'
    ],
    lessons: [
      { title: 'Correct without humiliating', text: 'A person can be guided without being crushed by harsh words.' },
      { title: 'Small interactions reveal character', text: 'The way we respond to ordinary mistakes can be more revealing than our public behavior.' },
      { title: 'Gentleness and accountability can coexist', text: 'Mercy does not mean ignoring mistakes; it means handling them with wisdom.' },
      { title: 'Make people feel safe around you', text: 'Good character creates an environment where people can learn and improve.' }
    ],
    sources: [
      { label: 'Sahih al-Bukhari', reference: 'Hadith 6038' },
      { label: 'Sahih Muslim', reference: 'Hadith 2310a / 2309e' }
    ],
    reflection: 'We often remember the big things people did for us, but relationships are shaped by hundreds of small interactions. Gentle speech can be one of the quietest forms of mercy.',
    takeaway: 'Let your correction improve people, not humiliate them.',
    relatedSlugs: ['abu-bakr-in-the-cave', 'prophet-ayyub-patience-in-hardship', 'yusuf-patience-through-trials']
  }
];

const CATEGORIES = ['All Stories', 'Prophets', 'Sahabah', 'Prophet ﷺ', 'Qur’anic Stories'] as const;

export default function Stories() {
  const [activeTag, setActiveTag] = useState<string>('All Stories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STORIES.filter((story) => {
      const categoryMatch = activeTag === 'All Stories' || story.tag === activeTag;
      if (!categoryMatch) return false;
      if (!q) return true;
      return [story.title, story.excerpt, story.lesson, story.tag]
        .some((value) => value.toLowerCase().includes(q));
    });
  }, [activeTag, searchQuery]);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-12" style={{ background: '#072018' }}>
      <section className="relative overflow-hidden border-b border-[#1A4035] bg-[#0B2820]">
        <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium mb-4" style={{ background: 'rgba(232,189,75,.12)', color: '#E8BD4B', border: '1px solid rgba(232,189,75,.28)' }}>
              <Sparkles size={13} /> Qur’an & Sunnah based · Life lessons
            </div>
            <h1 className="font-display text-noor-ivory text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">Islamic Stories</h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-noor-muted leading-7">Lessons from the lives of the Prophets, Sahabah, and righteous people — presented with clear source references and original reflection.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Qur’an & Sunnah based', 'Meaningful lessons', 'English collection'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-[#1A4035] bg-[#072018]/70 px-3 py-1.5 text-[11px] text-noor-muted"><ShieldCheck size={12} className="text-noor-accent" />{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-[#1A4035] bg-[#103329] shadow-xl shadow-black/10 overflow-hidden">
          {[
            ['10', 'Stories'],
            ['4', 'Collections'],
            ['40+', 'Life lessons'],
            ['100%', 'Source referenced']
          ].map(([value, label], i) => (
            <div key={label} className={`px-4 py-4 sm:py-5 text-center ${i < 3 ? 'border-r border-[#1A4035]' : ''} ${i === 1 ? 'max-lg:border-r-0' : ''} ${i === 2 ? 'max-lg:border-t border-[#1A4035]' : ''} ${i === 3 ? 'max-lg:border-t border-[#1A4035]' : ''}`}>
              <div className="font-display text-xl sm:text-2xl font-semibold text-noor-gold">{value}</div>
              <div className="mt-1 text-[10px] sm:text-xs text-noor-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-end mb-9">
          <div>
            <p className="text-[11px] uppercase tracking-[.18em] text-noor-accent font-semibold mb-2">Explore & reflect</p>
            <h2 className="font-display text-2xl sm:text-3xl text-noor-ivory font-semibold">Stories with a lesson, not just a headline</h2>
            <p className="mt-2 max-w-2xl text-sm text-noor-muted leading-6">Each story is written as an educational reading experience: the narrative is followed by practical lessons, source references, reflection, and a concise takeaway.</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stories, lessons, or topics..." className="w-full rounded-xl border border-[#1A4035] bg-[#103329] text-noor-ivory text-sm pl-10 pr-4 py-3 outline-none focus:border-[#E8BD4B]/60 placeholder:text-noor-muted/60" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-7 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button key={category} onClick={() => setActiveTag(category)} className="shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all" style={{ background: activeTag === category ? '#E8BD4B' : '#103329', color: activeTag === category ? '#061812' : '#A9B8B1', border: activeTag === category ? '1px solid #E8BD4B' : '1px solid #1A4035' }}>{category}</button>
          ))}
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredStories.map((story) => (
              <Link key={story.slug} to={`/stories/${story.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A4035] bg-[#103329] transition duration-300 hover:-translate-y-1 hover:border-[#2D6655] hover:shadow-2xl hover:shadow-black/15">
                <div className="relative h-52 overflow-hidden bg-[#072018]">
                  <img src={story.img} alt={story.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#103329] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full border border-[#E8BD4B]/30 bg-[#E8BD4B]/15 px-2.5 py-1 text-[10px] font-semibold text-noor-gold">{story.tag}</span>
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-sm"><Clock size={11} /> {story.readingTime} min</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-noor-accent"><span className="h-1.5 w-1.5 rounded-full bg-[#18B98A]" /> Key lesson: {story.lesson}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-noor-ivory transition-colors group-hover:text-noor-gold">{story.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-noor-muted line-clamp-3">{story.excerpt}</p>
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-[#1A4035]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-noor-gold">Read full story <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" /></span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-noor-muted"><Library size={11} /> {story.lessons.length} lessons</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1A4035] bg-[#103329]/70 py-16 text-center">
            <BookOpen size={30} className="mx-auto mb-3 text-noor-gold opacity-70" />
            <h3 className="text-sm font-semibold text-noor-ivory">No stories found</h3>
            <p className="mt-1 text-xs text-noor-muted">Try another keyword or choose All Stories.</p>
          </div>
        )}
      </main>
    </div>
  );
}
