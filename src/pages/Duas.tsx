import { useState, useEffect, useMemo } from 'react';
import { Copy, Share2, Check, Sparkles, BookOpen, Search } from 'lucide-react';

interface DuaItem {
  id?: string;
  arabic: string;
  translation: string;
  reference: string;
  transliteration?: string;
  category: string;
  keywords?: string[];
  significance?: string;
  whenToRecite?: string;
}

const CATEGORIES = [
  'All Duas',
  'Daily Featured',
  'Anxiety & Stress',
  'Exams & Success',
  'Health & Healing',
  'Parents & Family',
  'Rizq & Wealth',
  'Forgiveness',
  'Protection',
  'Morning',
  'Evening',
  'After Prayer',
  'Before Sleeping',
  'Travel',
  'Guidance & Faith',
  'Daily Essentials',
  'Life & Hardship',
];

const EXTENDED_DUAS: DuaItem[] = [
  // Anxiety & Stress
  {
    category: 'Anxiety & Stress',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: 'Surah Al-Anbiya 21:87 (Dua of Prophet Yunus)',
    keywords: ['anxiety', 'stress', 'distress', 'depression', 'difficulty', 'hardship'],
  },
  {
    category: 'Anxiety & Stress',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal",
    translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.',
    reference: 'Sahih al-Bukhari 6369',
    keywords: ['anxiety', 'worry', 'debt', 'sadness', 'laziness'],
  },
  {
    category: 'Anxiety & Stress',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal-wakeel',
    translation: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    reference: 'Surah Ali \'Imran 3:173',
    keywords: ['fear', 'stress', 'trust', 'anxiety'],
  },

  // Exams & Success
  {
    category: 'Exams & Success',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: "Rabbi zidni 'ilma",
    translation: 'My Lord, increase me in knowledge.',
    reference: 'Surah Taha 20:114',
    keywords: ['study', 'exam', 'knowledge', 'student', 'success', 'test'],
  },
  {
    category: 'Exams & Success',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
    transliteration: "Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatam-mil-lisani yafqahu qawli",
    translation: 'My Lord, expand for me my breast and ease for me my task and untie the knot from my tongue that they may understand my speech.',
    reference: 'Surah Taha 20:25-28',
    keywords: ['speech', 'interview', 'exam', 'confidence', 'presentation'],
  },
  {
    category: 'Exams & Success',
    arabic: 'اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla",
    translation: 'O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy.',
    reference: 'Sahih Ibn Hibban 974',
    keywords: ['difficult test', 'exam', 'hardship'],
  },

  // Health & Healing
  {
    category: 'Health & Healing',
    arabic: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ واشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا',
    transliteration: "Adhibil-ba'sa Rabban-nas, ishfi antash-Shafi, la shifa'a illa shifa'uka shifa'an la yughadiru saqama",
    translation: 'Remove the suffering, O Lord of mankind, and heal; You are the Healer, there is no healing except Your healing.',
    reference: 'Sahih al-Bukhari 5743',
    keywords: ['sick', 'shifa', 'pain', 'healing', 'health', 'illness'],
  },
  {
    category: 'Health & Healing',
    arabic: 'بِسْمِ اللَّهِ (٣×) أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧×)',
    transliteration: "Bismillah (3x), A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir (7x)",
    translation: 'In the Name of Allah (3 times). I seek refuge in Allah and His Might from the evil of what I feel and fear (7 times).',
    reference: 'Sahih Muslim 2202',
    keywords: ['body pain', 'healing', 'shifa'],
  },

  // Parents & Family
  {
    category: 'Parents & Family',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-hamhuma kama rabbayani sagheira',
    translation: 'My Lord, have mercy upon them [my parents] as they brought me up [when I was] small.',
    reference: 'Surah Al-Isra 17:24',
    keywords: ['parents', 'mother', 'father', 'family', 'mercy'],
  },
  {
    category: 'Parents & Family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    translation: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
    reference: 'Surah Al-Furqan 25:74',
    keywords: ['family', 'children', 'spouse', 'marriage'],
  },

  // Rizq & Wealth
  {
    category: 'Rizq & Wealth',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allahummak-fini bi-halalika an haramika wa aghnini bi-fadlika amman siwak',
    translation: 'O Allah, suffice me with what You have made lawful against what You have made unlawful, and make me independent of all those besides You.',
    reference: 'Jami at-Tirmidhi 3563',
    keywords: ['rizq', 'wealth', 'money', 'business', 'halal', 'job'],
  },
  {
    category: 'Rizq & Wealth',
    arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transliteration: 'Rabbi inni lima anzalta ilayya min khayrin faqir',
    translation: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
    reference: 'Surah Al-Qasas 28:24',
    keywords: ['need', 'poverty', 'blessing', 'provision', 'marriage'],
  },

  // Forgiveness
  {
    category: 'Forgiveness',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    transliteration: 'Rabbana dhalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasirin',
    translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.',
    reference: "Surah Al-A'raf 7:23",
    keywords: ['sin', 'forgiveness', 'astagfirullah', 'repentance'],
  },
  {
    category: 'Forgiveness',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    translation: 'O Allah, You are Forgiving and You love forgiveness, so forgive me.',
    reference: 'Jami at-Tirmidhi 3513',
    keywords: ['laylatul qadr', 'forgiveness', 'ramadan'],
  },

  // Protection
  {
    category: 'Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    reference: 'Sahih Muslim 2708',
    keywords: ['evil eye', 'protection', 'fear', 'harm', 'safety'],
  },
  {
    category: 'Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
    translation: 'In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heaven, and He is the All-Hearing, the All-Knowing.',
    reference: 'Sunan Abu Dawud 5088',
    keywords: ['daily protection', 'safety', 'morning protection'],
  },

  // Morning & Evening
  {
    category: 'Morning',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur',
    translation: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
    reference: 'Abu Dawud 5068',
    keywords: ['morning', 'azkar', 'start day'],
  },
  {
    category: 'Evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa amsal-mulku lillahi wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: 'We have entered the evening and the kingdom belongs to Allah; all praise is due to Allah. There is no deity worthy of worship except Allah alone.',
    reference: 'Sahih Muslim 2723',
    keywords: ['evening azkar', 'night'],
  },

  // After Prayer
  {
    category: 'After Prayer',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation: 'O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner.',
    reference: 'Abu Dawud 1522',
    keywords: ['namaz', 'after prayer', 'dhikr'],
  },

  // Before Sleeping
  {
    category: 'Before Sleeping',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'O Allah, in Your name I die and I live.',
    reference: 'Sahih al-Bukhari 6312',
    keywords: ['sleep', 'night', 'bedtime'],
  },

  // Travel
  {
    category: 'Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
    transliteration: 'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun',
    translation: 'Glory be to He who has subjected this to us, and we could not have otherwise subdued it. And indeed to our Lord we will return.',
    reference: 'Surah Az-Zukhruf 43:13-14',
    keywords: ['travel', 'journey', 'flight', 'drive'],
  },

  // Guidance & Faith
  {
    category: 'Guidance & Faith',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana milladunka rahmah, innaka antal-Wahhab",
    translation: 'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from You. Indeed, You are the Bestower.',
    reference: 'Surah Aal-Imran 3:8',
    keywords: ['guidance', 'faith', 'heart', 'steadfastness', 'mercy'],
    significance: 'A Qur’anic supplication for remaining firm after receiving guidance and asking Allah for mercy.',
    whenToRecite: 'When seeking steadfastness, stronger faith, or protection from spiritual deviation.',
  },
  {
    category: 'Guidance & Faith',
    arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
    transliteration: 'Rabbi hab li milladunka dhurriyyatan tayyibah, innaka samiud-dua',
    translation: 'My Lord, grant me from You a righteous offspring. Indeed, You are the Hearer of supplication.',
    reference: 'Surah Aal-Imran 3:38',
    keywords: ['children', 'offspring', 'family', 'righteous children'],
    significance: 'The supplication of Prophet Zakariyya عليه السلام for righteous offspring.',
    whenToRecite: 'When asking Allah for righteous children and a blessed family.',
  },
  // Daily Essentials
  {
    category: 'Daily Essentials',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya wa abu'u laka bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa anta",
    translation: 'O Allah, You are my Lord; there is no deity except You. You created me and I am Your servant. I acknowledge Your blessing upon me and my sin, so forgive me, for none forgives sins except You.',
    reference: 'Sahih al-Bukhari 6306',
    keywords: ['forgiveness', 'morning', 'evening', 'istighfar', 'repentance'],
    significance: 'The Prophet ﷺ described this as the most superior way of seeking Allah’s forgiveness.',
    whenToRecite: 'In the morning and evening; the hadith specifically mentions reciting it with firm faith.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
    translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    reference: 'Sahih Muslim; Riyad as-Salihin 1468',
    keywords: ['guidance', 'piety', 'chastity', 'contentment', 'self sufficiency'],
    significance: 'A short prophetic supplication bringing together guidance, piety, modesty, and contentment.',
    whenToRecite: 'As a general daily dua when seeking guidance, taqwa, purity, and independence from people.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyah fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyah fi dini wa dunyaya wa ahli wa mali. Allahummastur 'awrati wa amin raw'ati, wahfazni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi 'azamatika an ughtala min tahti",
    translation: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, worldly life, family and wealth. Conceal my faults, calm my fears, and protect me from every direction.',
    reference: 'Sunan Ibn Majah 3871',
    keywords: ['morning', 'evening', 'wellbeing', 'protection', 'family', 'wealth'],
    significance: 'Ibn Umar reported that the Messenger of Allah ﷺ did not abandon this supplication morning and evening.',
    whenToRecite: 'Morning and evening.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا أَنْتَ وَلِيُّهَا وَمَوْلَاهَا',
    transliteration: "Allahumma ati nafsi taqwaha wa zakkiha anta khayru man zakkaha anta waliyyuha wa mawlaha",
    translation: 'O Allah, grant my soul its piety and purify it; You are the best to purify it. You are its Guardian and Master.',
    reference: 'Sahih Muslim 2722',
    keywords: ['purification', 'taqwa', 'heart', 'soul', 'faith'],
    significance: 'A prophetic supplication asking Allah to purify the soul and grant it taqwa.',
    whenToRecite: 'When working on character, sincerity, self-discipline, and spiritual growth.',
  },

  // Life & Hardship
  {
    category: 'Life & Hardship',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
    translation: 'Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.',
    reference: 'Surah Al-Baqarah 2:201; Sahih al-Bukhari 6389',
    keywords: ['world', 'hereafter', 'success', 'protection', 'comprehensive dua'],
    significance: 'A comprehensive Qur’anic supplication asking for good in this life and the Hereafter and protection from the Fire.',
    whenToRecite: 'As a general dua in daily life and when asking Allah for balanced worldly and spiritual good.',
  },
  {
    category: 'Life & Hardship',
    arabic: 'رَبِّي إِنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
    transliteration: "Rabbi anni massaniyad-durru wa anta arhamur-rahimin",
    translation: 'My Lord, indeed adversity has touched me, and You are the Most Merciful of the merciful.',
    reference: 'Surah Al-Anbiya 21:83',
    keywords: ['hardship', 'illness', 'pain', 'mercy', 'difficulty'],
    significance: 'The supplication of Prophet Ayyub عليه السلام during hardship, turning to Allah’s mercy.',
    whenToRecite: 'During illness, hardship, pain, or any difficult period when seeking Allah’s mercy.',
  },
  {
    category: 'Life & Hardship',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ',
    transliteration: "Allahumma inni a'udhu bika min zawali ni'matika wa tahawwuli 'afiyatika wa fuja'ati niqmatika wa jami'i sakhatika",
    translation: 'O Allah, I seek refuge in You from the loss of Your blessing, the change of the well-being You have granted, the suddenness of Your punishment, and all that displeases You.',
    reference: 'Sahih Muslim; Riyad as-Salihin 1478',
    keywords: ['blessings', 'protection', 'wellbeing', 'gratitude', 'safety'],
    significance: 'A prophetic supplication seeking protection for blessings and well-being.',
    whenToRecite: 'As a general dua when asking Allah to preserve blessings, safety, and well-being.',
  },
  {
    category: 'Life & Hardship',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ وَالْعَزِيمَةَ عَلَى الرُّشْدِ، وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ وَحُسْنَ عِبَادَتِكَ، وَأَسْأَلُكَ لِسَانًا صَادِقًا وَقَلْبًا سَلِيمًا',
    transliteration: "Allahumma inni as'alukath-thabata fil-amri wal-'azimata 'alar-rushdi, wa as'aluka shukra ni'matika wa husna 'ibadatik, wa as'aluka lisanan sadiqan wa qalban salima",
    translation: 'O Allah, I ask You for steadfastness in the matter, determination upon guidance, gratitude for Your blessing, excellent worship, a truthful tongue, and a sound heart.',
    reference: 'Jami at-Tirmidhi 3407',
    keywords: ['steadfastness', 'guidance', 'gratitude', 'worship', 'truth', 'heart'],
    significance: 'A prophetic supplication asking for steadfastness, sound worship, gratitude, truthfulness, and a sound heart.',
    whenToRecite: 'When seeking consistency in faith, worship, character, and difficult decisions.',
  },

  // Health & Healing
  // Protection
  {
    category: 'Protection',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ النَّارِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: "Allahumma inni a'udhu bika min 'adhabil-qabr, wa min 'adhabin-nar, wa min fitnatil-mahya wal-mamat, wa min fitnatil-masihid-dajjal",
    translation: 'O Allah, I seek refuge in You from the punishment of the grave, the punishment of the Fire, the trials of life and death, and the trial of the False Messiah.',
    reference: 'Sahih al-Bukhari 1377',
    keywords: ['protection', 'grave', 'fire', 'trials', 'afterlife'],
    significance: 'A prophetic supplication seeking refuge from major trials and punishments.',
    whenToRecite: 'In salah, particularly in the final part of the prayer before salam.',
  },

  // Forgiveness
  {
    category: 'Forgiveness',
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration: "Allahumma inni zalamtu nafsi zulman kathiran, wa la yaghfirudh-dhunuba illa anta, faghfir li maghfiratan min 'indika warhamni, innaka antal-Ghafurur-Rahim",
    translation: 'O Allah, I have greatly wronged myself, and none forgives sins except You. So forgive me with forgiveness from You and have mercy on me. You are the Most Forgiving, Most Merciful.',
    reference: 'Sahih al-Bukhari 6326',
    keywords: ['forgiveness', 'repentance', 'salah', 'mercy', 'sins'],
    significance: 'The Prophet ﷺ taught this supplication to Abu Bakr رضي الله عنه for use in prayer.',
    whenToRecite: 'In salah and when sincerely seeking Allah’s forgiveness and mercy.',
  },

  // Parents & Family
  // Travel
  {
    category: 'Travel',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى',
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda",
    translation: 'O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You.',
    reference: 'Sahih Muslim 1342',
    keywords: ['travel', 'journey', 'road', 'flight', 'trip', 'piety'],
    significance: 'Part of the authentic supplication the Prophet ﷺ would say when setting out on a journey.',
    whenToRecite: 'When beginning a journey.',
  },


  // Daily Essentials — everyday Sunnah moments
  {
    category: 'Daily Essentials',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur',
    translation: 'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
    reference: 'Sahih al-Bukhari 6312',
    keywords: ['waking up', 'morning', 'sleep', 'gratitude'],
    significance: 'The Prophet ﷺ would say this upon waking.',
    whenToRecite: 'Immediately after waking up.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirahu',
    translation: 'In the name of Allah at its beginning and at its end.',
    reference: 'Sunan Abi Dawud 3767',
    keywords: ['food', 'eating', 'forgot bismillah'],
    significance: 'The Prophet ﷺ taught this wording for someone who forgot to mention Allah’s name at the beginning of a meal.',
    whenToRecite: 'If you began eating and forgot to say Bismillah at the start.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranaka',
    translation: 'I seek Your forgiveness.',
    reference: 'Sunan Ibn Majah 300',
    keywords: ['toilet', 'after toilet', 'forgiveness'],
    significance: 'A short authentic supplication reported from the Prophet ﷺ after leaving the toilet.',
    whenToRecite: 'After leaving the toilet.',
  },
  {
    category: 'Rizq & Wealth',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْمَأْثَمِ وَالْمَغْرَمِ',
    transliteration: "Allahumma inni a'udhu bika minal-ma'thami wal-maghram",
    translation: 'O Allah, I seek refuge in You from sin and from debt.',
    reference: 'Sahih al-Bukhari 832',
    keywords: ['debt', 'money', 'sin', 'financial difficulty'],
    significance: 'The Prophet ﷺ sought refuge in Allah from debt in prayer and explained why he frequently did so.',
    whenToRecite: 'In prayer and when asking Allah for protection from debt and its burdens.',
  },
  {
    category: 'Daily Essentials',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَالْعَمَلَ الَّذِي يُبَلِّغُنِي حُبَّكَ',
    transliteration: "Allahumma inni as'aluka hubbaka wa hubba man yuhibbuka wal-'amalalladhi yuballighuni hubbak",
    translation: 'O Allah, I ask You for Your love, the love of those who love You, and deeds that bring me to Your love.',
    reference: 'Jami at-Tirmidhi 3490',
    keywords: ['love of Allah', 'faith', 'worship', 'spiritual growth'],
    significance: 'A supplication attributed to the supplication of Prophet Dawud عليه السلام and reported as a hasan narration in Jami at-Tirmidhi.',
    whenToRecite: 'When seeking stronger love for Allah and deeds that draw you closer to Him.',
  },

];

export default function Duas() {
  const [activeCategory, setActiveCategory] = useState<string>('All Duas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dailyDua, setDailyDua] = useState<DuaItem | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [sharedIndex, setSharedIndex] = useState<string | null>(null);

  // Daily Dynamic Dua selection
  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    setDailyDua(EXTENDED_DUAS[dayOfYear % EXTENDED_DUAS.length]);
  }, []);

  // Filter Duas based on Category and Search Query
  const filteredDuas = useMemo(() => {
    return EXTENDED_DUAS.filter((dua) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.transliteration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (searchQuery.trim() !== '') return true;

      if (activeCategory === 'All Duas') return true;
      if (activeCategory === 'Daily Featured') return dailyDua ? dua === dailyDua : true;
      return dua.category === activeCategory;
    });
  }, [activeCategory, searchQuery, dailyDua]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleShare = async (dua: DuaItem, id: string) => {
    const shareData = {
      title: `${dua.category} Dua`,
      text: `${dua.arabic}\n\n"${dua.translation}"\n— ${dua.reference}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      handleCopy(`${shareData.text}\n\n${shareData.url}`, id);
      setSharedIndex(id);
      setTimeout(() => setSharedIndex(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-24 lg:pb-12 bg-[#061812] text-noor-ivory">
      {/* Header Banner */}
      <div className="py-8 sm:py-10 mb-6 text-center relative overflow-hidden bg-[#0B2820] border-b border-[#1A4035]/50 px-4">
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8BD4B]/10 border border-[#E8BD4B]/30 text-[#E8BD4B] text-xs font-medium">
            <BookOpen size={13} /> Blessed Supplications & Azkar
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-wide">Sacred Duas</h1>
          <p className="text-noor-muted text-xs sm:text-sm">Qur'anic and Sunnah supplications for health, exams, anxiety, rizq & protection</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noor-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword (e.g., anxiety, exam, shifa, debt, parents)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#103329] border border-[#1A4035] text-xs sm:text-sm text-noor-ivory placeholder-noor-muted/60 focus:outline-none focus:border-[#E8BD4B]/50 transition-all"
          />
        </div>

        {!searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl bg-[#103329]/70 border border-[#1A4035] px-3 py-2.5">
              <p className="text-lg font-display text-[#E8BD4B] font-bold">{EXTENDED_DUAS.length}</p>
              <p className="text-[10px] text-noor-muted">Sourced duas</p>
            </div>
            <div className="rounded-xl bg-[#103329]/70 border border-[#1A4035] px-3 py-2.5">
              <p className="text-lg font-display text-[#E8BD4B] font-bold">{CATEGORIES.length - 2}</p>
              <p className="text-[10px] text-noor-muted">Topics</p>
            </div>
            <div className="rounded-xl bg-[#103329]/70 border border-[#1A4035] px-3 py-2.5">
              <p className="text-lg font-display text-[#E8BD4B] font-bold">Qur'an</p>
              <p className="text-[10px] text-noor-muted">& Sunnah sources</p>
            </div>
            <div className="rounded-xl bg-[#103329]/70 border border-[#1A4035] px-3 py-2.5">
              <p className="text-lg font-display text-[#E8BD4B] font-bold">Daily</p>
              <p className="text-[10px] text-noor-muted">Featured dua</p>
            </div>
          </div>
        )}

        {/* Daily Featured Highlight Box */}
        {dailyDua && activeCategory !== 'Daily Featured' && !searchQuery && (
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#103329] to-[#0B2820] border border-[#E8BD4B]/40 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-[#1A4035]/60 pb-2.5">
              <span className="flex items-center gap-1.5 text-[#E8BD4B] font-display font-semibold text-xs sm:text-sm">
                <Sparkles size={15} /> Featured Dua of the Day
              </span>
              <span className="text-[11px] text-noor-muted bg-[#061812]/40 px-2.5 py-0.5 rounded-full border border-[#1A4035]">
                {dailyDua.category}
              </span>
            </div>

            <p className="font-arabic text-noor-gold text-lg sm:text-xl leading-loose text-right mb-3" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
              {dailyDua.arabic}
            </p>
            {dailyDua.transliteration && (
              <p className="text-noor-muted/90 text-xs italic mb-1.5">{dailyDua.transliteration}</p>
            )}
            <p className="text-noor-ivory/90 text-xs sm:text-sm leading-relaxed mb-2">"{dailyDua.translation}"</p>
            <p className="text-noor-muted/70 text-[11px]">— {dailyDua.reference}</p>
          </div>
        )}

        {!searchQuery && activeCategory === 'All Duas' && (
          <section className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#103329] to-[#0B2820] border border-[#1A4035] shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-[#E8BD4B]/10 p-2 text-[#E8BD4B]"><BookOpen size={16} /></div>
              <div>
                <h2 className="text-sm sm:text-base font-display font-semibold text-noor-ivory">A curated collection for real moments</h2>
                <p className="mt-1.5 text-xs sm:text-sm leading-6 text-noor-muted">
                  Explore supplications from the Qur'an and authentic or well-established hadith collections, organized around situations people actually face: worry, study, healing, family, rizq, forgiveness, protection, worship and travel. Each entry includes its source and a short context note so you can understand why it is included—not just copy the words.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat && !searchQuery;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E8BD4B]/20 border border-[#E8BD4B]/50 text-[#E8BD4B] shadow-sm'
                    : 'bg-[#103329]/60 border border-[#1A4035]/60 text-noor-muted hover:text-noor-ivory'
                }`}
              >
                {cat === 'Daily Featured' && <Sparkles size={12} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-12 text-noor-muted text-xs sm:text-sm bg-[#103329]/30 rounded-2xl border border-[#1A4035]/40">
              No supplications match your search query.
            </div>
          ) : (
            filteredDuas.map((dua, i) => {
              const duaId = `${dua.category}-${i}`;
              const isCopied = copiedIndex === duaId;
              const isShared = sharedIndex === duaId;

              return (
                <div
                  key={duaId}
                  className="rounded-2xl p-5 sm:p-6 bg-[#103329] border border-[#1A4035]/70 hover:border-[#E8BD4B]/30 transition-all shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between text-xs border-b border-[#1A4035]/40 pb-2">
                    <span className="text-[#E8BD4B] font-medium bg-[#E8BD4B]/10 px-2.5 py-0.5 rounded-full border border-[#E8BD4B]/20">
                      {dua.category}
                    </span>
                    <span className="text-noor-muted text-[11px]">— {dua.reference}</span>
                  </div>

                  <p
                    className="font-arabic text-noor-gold text-xl sm:text-2xl leading-loose text-right"
                    style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                  >
                    {dua.arabic}
                  </p>

                  {dua.transliteration && (
                    <p className="text-noor-muted/80 text-xs sm:text-sm italic border-l-2 border-[#E8BD4B]/40 pl-3 py-0.5">
                      {dua.transliteration}
                    </p>
                  )}

                  <p className="text-noor-ivory/90 text-xs sm:text-sm leading-relaxed">
                    "{dua.translation}"
                  </p>

                  {(dua.significance || dua.whenToRecite) && (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {dua.significance && (
                        <div className="rounded-xl bg-[#061812]/35 border border-[#1A4035]/60 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-[#E8BD4B] font-semibold">Significance</p>
                          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-noor-muted">{dua.significance}</p>
                        </div>
                      )}
                      {dua.whenToRecite && (
                        <div className="rounded-xl bg-[#061812]/35 border border-[#1A4035]/60 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-[#E8BD4B] font-semibold">When to recite</p>
                          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-noor-muted">{dua.whenToRecite}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Clean Accessible Actions Bar (Copy & Native Share) */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1A4035]/50 text-xs">
                    <button
                      onClick={() => handleCopy(`${dua.arabic}\n\n"${dua.translation}"\n— ${dua.reference}`, duaId)}
                      className="p-2 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#061812]/40 transition-all flex items-center gap-1.5"
                      aria-label="Copy Dua"
                    >
                      {isCopied ? (
                        <>
                          <Check size={15} className="text-emerald-400" />
                          <span className="text-emerald-400 text-[11px] font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          <span className="hidden sm:inline text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShare(dua, duaId)}
                      className="p-2 rounded-xl text-noor-muted hover:text-noor-gold hover:bg-[#061812]/40 transition-all flex items-center gap-1.5"
                      aria-label="Share Dua"
                    >
                      {isShared ? (
                        <>
                          <Check size={15} className="text-emerald-400" />
                          <span className="text-emerald-400 text-[11px] font-medium">Shared!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={15} />
                          <span className="hidden sm:inline text-[11px]">Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-2xl border border-[#1A4035]/60 bg-[#0B2820]/70 p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8BD4B]">Source & editorial note</p>
          <p className="mt-1.5 text-[11px] sm:text-xs leading-5 text-noor-muted">
            Noor lists the Qur’anic verses and hadith references alongside each dua so readers can check the source. Context notes are editorial explanations of when a supplication fits; they are not additional hadith or promises of guaranteed outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
