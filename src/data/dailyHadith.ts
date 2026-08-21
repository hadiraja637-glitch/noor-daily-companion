export type DailyHadith = {
  arabic: string;
  english: string;
  source: string;
  category: string;
};

// A rotating set from the same concise collection used throughout Noor.
// The selected item changes automatically with the calendar day.
export const DAILY_HADITHS: DailyHadith[] = [
  { arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', english: 'The best among you are those who learn the Qur’an and teach it.', source: 'Bukhari', category: 'Qur’an' },
  { arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', english: 'Actions are judged by intentions.', source: 'Bukhari & Muslim', category: 'Intentions' },
  { arabic: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', english: 'Whoever does not show mercy will not be shown mercy.', source: 'Bukhari & Muslim', category: 'Mercy' },
  { arabic: 'الدِّينُ النَّصِيحَةُ', english: 'The religion is sincere advice.', source: 'Muslim', category: 'Sincerity' },
  { arabic: 'لَا ضَرَرَ وَلَا ضِرَارَ', english: 'There should be neither harm nor reciprocating harm.', source: 'Ibn Majah', category: 'Conduct' },
  { arabic: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا', english: 'Whoever deceives us is not one of us.', source: 'Muslim', category: 'Honesty' },
  { arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ', english: 'Purification is half of faith.', source: 'Muslim', category: 'Purification' },
  { arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', english: 'Whoever guides to a good deed will have a reward like that of its doer.', source: 'Muslim', category: 'Good Deeds' },
  { arabic: 'لَا تَغْضَبْ', english: 'Do not become angry.', source: 'Bukhari', category: 'Character' },
  { arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', source: 'Bukhari & Muslim', category: 'Speech' },
  { arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', english: 'The deeds most beloved to Allah are those done consistently, even if small.', source: 'Bukhari & Muslim', category: 'Consistency' },
  { arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', english: 'A good word is charity.', source: 'Bukhari & Muslim', category: 'Kindness' },
  { arabic: 'يَسِّرُوا وَلَا تُعَسِّرُوا', english: 'Make things easy and do not make them difficult.', source: 'Bukhari & Muslim', category: 'Ease' },
  { arabic: 'مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ', english: 'Whoever does not thank people has not thanked Allah.', source: 'Tirmidhi', category: 'Gratitude' },
  { arabic: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا', english: 'The believer to another believer is like a building, each part strengthening the other.', source: 'Bukhari & Muslim', category: 'Community' },
  { arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', english: 'Whoever travels a path seeking knowledge, Allah makes a path to Paradise easy for him.', source: 'Muslim', category: 'Knowledge' },
  { arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ', english: 'The merciful are shown mercy by the Most Merciful.', source: 'Tirmidhi', category: 'Mercy' },
  { arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ', english: 'The best of people are those who are most beneficial to people.', source: 'Al-Mu’jam al-Awsat', category: 'Service' },
  { arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', english: 'Be mindful of Allah wherever you are.', source: 'Tirmidhi', category: 'Mindfulness' },
  { arabic: 'الطَّاعَةُ فِي الْمَعْرُوفِ', english: 'Obedience is only in what is right and good.', source: 'Bukhari & Muslim', category: 'Goodness' },
];

export function getDailyHadith(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_HADITHS[(day - 1 + DAILY_HADITHS.length) % DAILY_HADITHS.length];
}
