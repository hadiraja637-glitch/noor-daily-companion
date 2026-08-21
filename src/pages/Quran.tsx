import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Search,
  Volume2,
  X,
} from 'lucide-react';

const API = 'https://api.alquran.cloud/v1';
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy';
const AYAH_AUDIO_CDN = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
};

type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  audio?: string;
};


const BASMALA = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

function stripLeadingBasmala(text: string) {
  // Some Quran editions include the basmala at the start of the first ayah.
  // Noor renders it separately, so remove only a leading basmala and preserve the ayah text.
  return text
    .replace(/^\s*بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/u, '')
    .replace(/^\s*بسم\s+الله\s+الرحمن\s+الرحيم\s*/u, '')
    .trim();
}

const FALLBACK_SURAHS: Surah[] = [
  { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'سُورَةُ آلِ عِمۡرَانَ', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'سُورَةُ النِّسَاءِ', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'سُورَةُ المَائـِدَةِ', englishName: 'Al-Maaida', englishNameTranslation: 'The Table', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: 'سُورَةُ الأَنۡعَامِ', englishName: "Al-An'aam", englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: 'سُورَةُ الأَعۡرَافِ', englishName: "Al-A'raaf", englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'سُورَةُ الأَنفَالِ', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'سُورَةُ التَّوۡبَةِ', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'سُورَةُ يُونُسَ', englishName: 'Yunus', englishNameTranslation: 'Jonas', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'سُورَةُ هُودٍ', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'سُورَةُ يُوسُفَ', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: 'سُورَةُ الرَّعۡدِ', englishName: "Ar-Ra'd", englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'سُورَةُ إِبۡرَاهِيمَ', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'سُورَةُ الحِجۡرِ', englishName: 'Al-Hijr', englishNameTranslation: 'The Rock', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 16, name: 'سُورَةُ النَّحۡلِ', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan' },
  { number: 17, name: 'سُورَةُ الإِسۡرَاءِ', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 18, name: 'سُورَةُ الكَهۡفِ', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan' },
  { number: 19, name: 'سُورَةُ مَرۡيَمَ', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan' },
  { number: 20, name: 'سُورَةُ طه', englishName: 'Taa-Haa', englishNameTranslation: 'Taa-Haa', numberOfAyahs: 135, revelationType: 'Meccan' },
  { number: 21, name: 'سُورَةُ الأَنبِيَاءِ', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan' },
  { number: 22, name: 'سُورَةُ الحَجِّ', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 23, name: 'سُورَةُ المُؤۡمِنُونَ', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan' },
  { number: 24, name: 'سُورَةُ النُّورِ', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan' },
  { number: 25, name: 'سُورَةُ الفُرۡقَانِ', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan' },
  { number: 26, name: 'سُورَةُ الشُّعَرَاءِ', englishName: "Ash-Shu'araa", englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan' },
  { number: 27, name: 'سُورَةُ النَّمۡلِ', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan' },
  { number: 28, name: 'سُورَةُ القَصَصِ', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 29, name: 'سُورَةُ العَنكَبُوتِ', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan' },
  { number: 30, name: 'سُورَةُ الرُّومِ', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 31, name: 'سُورَةُ لُقۡمَانَ', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan' },
  { number: 32, name: 'سُورَةُ السَّجۡدَةِ', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 33, name: 'سُورَةُ الأَحۡزَابِ', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Clans', numberOfAyahs: 73, revelationType: 'Medinan' },
  { number: 34, name: 'سُورَةُ سَبَإٍ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 35, name: 'سُورَةُ فَاطِرٍ', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 36, name: 'سُورَةُ يسٓ', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 37, name: 'سُورَةُ الصَّافَّاتِ', englishName: 'As-Saaffaat', englishNameTranslation: 'Those drawn up in Ranks', numberOfAyahs: 182, revelationType: 'Meccan' },
  { number: 38, name: 'سُورَةُ صٓ', englishName: 'Saad', englishNameTranslation: 'The letter Saad', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 39, name: 'سُورَةُ الزُّمَرِ', englishName: 'Az-Zumar', englishNameTranslation: 'The Groups', numberOfAyahs: 75, revelationType: 'Meccan' },
  { number: 40, name: 'سُورَةُ غَافِرٍ', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan' },
  { number: 41, name: 'سُورَةُ فُصِّلَتۡ', englishName: 'Fussilat', englishNameTranslation: 'Explained in detail', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 42, name: 'سُورَةُ الشُّورَىٰ', englishName: 'Ash-Shura', englishNameTranslation: 'Consultation', numberOfAyahs: 53, revelationType: 'Meccan' },
  { number: 43, name: 'سُورَةُ الزُّخۡرُفِ', englishName: 'Az-Zukhruf', englishNameTranslation: 'Ornaments of gold', numberOfAyahs: 89, revelationType: 'Meccan' },
  { number: 44, name: 'سُورَةُ الدُّخَانِ', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan' },
  { number: 45, name: 'سُورَةُ الجَاثِيَةِ', englishName: 'Al-Jaathiya', englishNameTranslation: 'Crouching', numberOfAyahs: 37, revelationType: 'Meccan' },
  { number: 46, name: 'سُورَةُ الأَحۡقَافِ', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Dunes', numberOfAyahs: 35, revelationType: 'Meccan' },
  { number: 47, name: 'سُورَةُ مُحَمَّدٍ', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan' },
  { number: 48, name: 'سُورَةُ الفَتۡحِ', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 49, name: 'سُورَةُ الحُجُرَاتِ', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Inner Apartments', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 50, name: 'سُورَةُ قٓ', englishName: 'Qaaf', englishNameTranslation: 'The letter Qaaf', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 51, name: 'سُورَةُ الذَّارِيَاتِ', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 52, name: 'سُورَةُ الطُّورِ', englishName: 'At-Tur', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan' },
  { number: 53, name: 'سُورَةُ النَّجۡمِ', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan' },
  { number: 54, name: 'سُورَةُ القَمَرِ', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan' },
  { number: 55, name: 'سُورَةُ الرَّحۡمَٰن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'سُورَةُ الوَاقِعَةِ', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 57, name: 'سُورَةُ الحَدِيدِ', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 58, name: 'سُورَةُ المُجَادِلَةِ', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan' },
  { number: 59, name: 'سُورَةُ الحَشۡرِ', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan' },
  { number: 60, name: 'سُورَةُ المُمۡتَحَنَةِ', englishName: 'Al-Mumtahana', englishNameTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan' },
  { number: 61, name: 'سُورَةُ الصَّفِّ', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan' },
  { number: 62, name: 'سُورَةُ الجُمُعَةِ', englishName: "Al-Jumu'a", englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 63, name: 'سُورَةُ المُنَافِقُونَ', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 64, name: 'سُورَةُ التَّغَابُنِ', englishName: 'At-Taghaabun', englishNameTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 65, name: 'سُورَةُ الطَّلَاقِ', englishName: 'At-Talaaq', englishNameTranslation: 'Divorce', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 66, name: 'سُورَةُ التَّحۡرِيمِ', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 67, name: 'سُورَةُ المُلۡكِ', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 68, name: 'سُورَةُ القَلَمِ', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 69, name: 'سُورَةُ الحَاقَّةِ', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 70, name: 'سُورَةُ المَعَارِجِ', englishName: "Al-Ma'aarij", englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan' },
  { number: 71, name: 'سُورَةُ نُوحٍ', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 72, name: 'سُورَةُ الجِنِّ', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 73, name: 'سُورَةُ المُزَّمِّلِ', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 74, name: 'سُورَةُ المُدَّثِّرِ', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan' },
  { number: 75, name: 'سُورَةُ القِيَامَةِ', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 76, name: 'سُورَةُ الإِنسَانِ', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'Medinan' },
  { number: 77, name: 'سُورَةُ المُرۡسَلَاتِ', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan' },
  { number: 78, name: 'سُورَةُ النَّبَإِ', englishName: 'An-Naba', englishNameTranslation: 'The Announcement', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 79, name: 'سُورَةُ النَّازِعَاتِ', englishName: "An-Naazi'aat", englishNameTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan' },
  { number: 80, name: 'سُورَةُ عَبَسَ', englishName: 'Abasa', englishNameTranslation: 'He frowned', numberOfAyahs: 42, revelationType: 'Meccan' },
  { number: 81, name: 'سُورَةُ التَّكۡوِيرِ', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan' },
  { number: 82, name: 'سُورَةُ الانفِطَارِ', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 83, name: 'سُورَةُ المُطَفِّفِينَ', englishName: 'Al-Mutaffifin', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan' },
  { number: 84, name: 'سُورَةُ الانشِقَاقِ', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'Meccan' },
  { number: 85, name: 'سُورَةُ البُرُوجِ', englishName: 'Al-Burooj', englishNameTranslation: 'The Constellations', numberOfAyahs: 22, revelationType: 'Meccan' },
  { number: 86, name: 'سُورَةُ الطَّارِقِ', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan' },
  { number: 87, name: 'سُورَةُ الأَعۡلَىٰ', englishName: "Al-A'laa", englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 88, name: 'سُورَةُ الغَاشِيَةِ', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan' },
  { number: 89, name: 'سُورَةُ الفَجۡرِ', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 90, name: 'سُورَةُ البَلَدِ', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 91, name: 'سُورَةُ الشَّمۡسِ', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan' },
  { number: 92, name: 'سُورَةُ اللَّيۡلِ', englishName: 'Al-Lail', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan' },
  { number: 93, name: 'سُورَةُ الضُّحَىٰ', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 94, name: 'سُورَةُ الشَّرۡحِ', englishName: 'Ash-Sharh', englishNameTranslation: 'The Consolation', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 95, name: 'سُورَةُ التِّينِ', englishName: 'At-Tin', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 96, name: 'سُورَةُ العَلَقِ', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 97, name: 'سُورَةُ القَدۡرِ', englishName: 'Al-Qadr', englishNameTranslation: 'The Power, Fate', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 98, name: 'سُورَةُ البَيِّنَةِ', englishName: 'Al-Bayyina', englishNameTranslation: 'The Evidence', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 99, name: 'سُورَةُ الزَّلۡزَلَةِ', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 100, name: 'سُورَةُ العَادِيَاتِ', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Chargers', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 101, name: 'سُورَةُ القَارِعَةِ', englishName: "Al-Qaari'a", englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 102, name: 'سُورَةُ التَّكَاثُرِ', englishName: 'At-Takaathur', englishNameTranslation: 'Competition', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 103, name: 'سُورَةُ العَصۡرِ', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day, Epoch', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 104, name: 'سُورَةُ الهُمَزَةِ', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan' },
  { number: 105, name: 'سُورَةُ الفِيلِ', englishName: 'Al-Fil', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 106, name: 'سُورَةُ قُرَيۡشٍ', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 107, name: 'سُورَةُ المَاعُونِ', englishName: "Al-Maa'un", englishNameTranslation: 'Almsgiving', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 108, name: 'سُورَةُ الكَوۡثَرِ', englishName: 'Al-Kawthar', englishNameTranslation: 'Abundance', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 109, name: 'سُورَةُ الكَافِرُونَ', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan' },
  { number: 110, name: 'سُورَةُ النَّصۡرِ', englishName: 'An-Nasr', englishNameTranslation: 'Divine Support', numberOfAyahs: 3, revelationType: 'Medinan' },
  { number: 111, name: 'سُورَةُ المَسَدِ', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fibre', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 112, name: 'سُورَةُ الإِخۡلَاصِ', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', englishNameTranslation: 'The Dawn', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' },
];

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>(FALLBACK_SURAHS);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('noor-quran-bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahQueueRef = useRef<string[]>([]);
  const surahQueueIndexRef = useRef(0);
  const pendingPlaySurahRef = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API}/surah`)
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load Surah list');
        return res.json();
      })
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length === 114) setSurahs(json.data);
      })
      .catch(() => undefined)
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`${API}/surah/${selected.number}/quran-uthmani`).then((r) => r.json()),
      fetch(`${API}/surah/${selected.number}/en.sahih`).then((r) => r.json()),
    ])
      .then(([arabic, translation]) => {
        const arabicAyahs = arabic?.data?.ayahs || [];
        const translatedAyahs = translation?.data?.ayahs || [];
        setAyahs(
          arabicAyahs.map((ayah: Ayah, index: number) => ({
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: index === 0 ? stripLeadingBasmala(ayah.text) : ayah.text,
            audio: ayah.audio || `${AYAH_AUDIO_CDN}/${ayah.number}.mp3`,
            translation: translatedAyahs[index]?.text || '',
          })),
        );
      })
      .catch(() => setError('Qur’an text could not be loaded right now. Please try again.'))
      .finally(() => setLoading(false));
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(query) ||
        String(s.number) === q,
    );
  }, [query, surahs]);

  const toggleBookmark = (ayahNumber: number) => {
    setBookmarks((current) => {
      const next = current.includes(ayahNumber)
        ? current.filter((n) => n !== ayahNumber)
        : [...current, ayahNumber];
      localStorage.setItem('noor-quran-bookmarks', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => {
      const queue = surahQueueRef.current;
      const nextIndex = surahQueueIndexRef.current + 1;
      if (queue.length && nextIndex < queue.length) {
        surahQueueIndexRef.current = nextIndex;
        audio.src = queue[nextIndex];
        setCurrentTime(0);
        audio.play().catch(() => {
          surahQueueRef.current = [];
          setPlayingSurah(null);
          setPlayingAyah(null);
          setError('Audio could not continue. Please check your internet connection.');
        });
        return;
      }
      surahQueueRef.current = [];
      surahQueueIndexRef.current = 0;
      setPlayingSurah(null);
      setPlayingAyah(null);
      setCurrentTime(0);
    };
    const onError = () => {
      setPlayingSurah(null);
      setPlayingAyah(null);
      setCurrentTime(0);
      setError('Audio could not start. Please check your internet connection.');
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, []);

  const stopAudio = () => {
    surahQueueRef.current = [];
    surahQueueIndexRef.current = 0;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlayingSurah(null);
    setPlayingAyah(null);
    setCurrentTime(0);
  };

  const playUrl = (url: string, surahNumber: number, ayahNumber?: number) => {
    const audio = audioRef.current;
    if (!audio || !url) {
      setError('Audio is not ready yet. Please try again.');
      return;
    }
    surahQueueRef.current = [];
    surahQueueIndexRef.current = 0;
    setError('');
    if (audio.src !== url) {
      audio.src = url;
      audio.currentTime = 0;
    }
    audio.play().then(() => {
      setPlayingSurah(ayahNumber ? null : surahNumber);
      setPlayingAyah(ayahNumber || null);
    }).catch(() => setError('Audio could not start. Please check your internet connection.'));
  };

  const playSurah = () => {
    if (!selected) return;
    const audio = audioRef.current;

    if (playingSurah === selected.number) {
      audio?.pause();
      setPlayingSurah(null);
      return;
    }

    // If the user paused the current full-surah queue, resume it instead of restarting.
    if (audio && surahQueueRef.current.length && audio.paused) {
      setError('');
      setPlayingSurah(selected.number);
      audio.play().catch(() => {
        setPlayingSurah(null);
        setError('Surah audio could not resume. Please check your internet connection.');
      });
      return;
    }

    const queue = ayahs
      .map((ayah) => ayah.audio || `${AYAH_AUDIO_CDN}/${ayah.number}.mp3`)
      .filter(Boolean);

    if (!audio) {
      setError('Audio is not ready yet. Please try again.');
      return;
    }

    setError('');
    setPlayingAyah(null);
    surahQueueRef.current = queue;
    surahQueueIndexRef.current = 0;

    if (queue.length) {
      audio.src = queue[0];
      audio.currentTime = 0;
      setPlayingSurah(selected.number);
      audio.play().catch(() => {
        surahQueueRef.current = [];
        setPlayingSurah(null);
        setError('Surah audio could not start. Please check your internet connection.');
      });
      return;
    }

    playUrl(`${AUDIO_CDN}/${selected.number}.mp3`, selected.number);
  };

  useEffect(() => {
    if (!selected || !ayahs.length || pendingPlaySurahRef.current !== selected.number) return;
    pendingPlaySurahRef.current = null;
    const id = window.setTimeout(() => playSurah(), 0);
    return () => window.clearTimeout(id);
  }, [selected, ayahs]);

  const playAyah = (ayah: Ayah) => {
    if (playingAyah === ayah.number) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    playUrl(ayah.audio || `${AYAH_AUDIO_CDN}/${ayah.number}.mp3`, selected?.number || 0, ayah.number);
  };

  useEffect(() => () => {
    surahQueueRef.current = [];
    audioRef.current?.pause();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      <div
        className="py-12 mb-6 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative px-4">
          <p className="font-arabic text-noor-gold text-2xl mb-3">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">The Holy Qur'an</h1>
          <p className="text-noor-muted text-sm">Read, Listen & Learn the Words of Allah</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
          <Search size={16} className="text-noor-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah name or number..."
            className="flex-1 bg-transparent text-noor-ivory text-sm placeholder:text-noor-muted outline-none"
          />
          {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} className="text-noor-muted" /></button>}
        </div>

        {selected ? (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
            <div className="p-5 sm:p-7 text-center border-b border-noor-border">
              <button onClick={() => { stopAudio(); setSelected(null); }} className="text-noor-gold text-sm mb-5 hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Surah list
              </button>
              <p className="text-noor-muted text-xs mb-1">Surah {selected.number}</p>
              <h2 className="font-display text-noor-ivory text-3xl sm:text-4xl font-semibold">{selected.englishName}</h2>
              <p className="font-arabic text-noor-gold text-3xl sm:text-4xl mt-1">{selected.name}</p>
              <p className="text-noor-muted text-xs mt-2">{selected.numberOfAyahs} Ayahs · {selected.revelationType} · {selected.englishNameTranslation}</p>
              <p className="text-noor-muted text-[10px] mt-2">English translation: Saheeh International</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={playSurah}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: '#E8BD4B', color: '#061812' }}
                >
                  {playingSurah === selected.number ? <Pause size={15} /> : <Play size={15} />}
                  {playingSurah === selected.number ? 'Pause Surah' : 'Play Surah'}
                </button>
                {playingSurah === selected.number && (
                  <span className="text-noor-muted text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
                )}
              </div>
              {playingSurah === selected.number && (
                <input
                  type="range"
                  min="0"
                  max={duration || 1}
                  value={Math.min(currentTime, duration || 1)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = value;
                    setCurrentTime(value);
                  }}
                  className="w-full max-w-md mt-4 accent-[color:var(--color-noor-gold)]"
                  aria-label="Audio progress"
                />
              )}
            </div>

            <div className="p-4 sm:p-7">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-14 text-noor-muted text-sm">
                  <Loader2 size={18} className="animate-spin" /> Loading Qur'an...
                </div>
              )}
              {error && (
                <div className="rounded-xl p-4 mb-4 text-sm text-noor-muted" style={{ background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.2)' }}>
                  {error}
                </div>
              )}
              {!loading && selected.number !== 9 && (
                <div className="pb-5 pt-1 text-center border-b border-noor-border">
                  <p
                    className="font-arabic text-noor-gold text-2xl sm:text-3xl leading-loose"
                    dir="rtl"
                    aria-label="Bismillah"
                  >
                    {BASMALA}
                  </p>
                </div>
              )}

              {!loading && ayahs.map((ayah) => (
                <article
                  key={ayah.number}
                  className="py-6 border-b border-noor-border last:border-b-0"
                  id={`ayah-${ayah.numberInSurah}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-noor-gold shrink-0" style={{ background: 'rgba(232,189,75,0.12)' }}>
                      {ayah.numberInSurah}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => playAyah(ayah)}
                        className="p-2 rounded-full text-noor-muted hover:text-noor-gold hover:bg-white/5"
                        aria-label={`Play ayah ${ayah.numberInSurah}`}
                      >
                        {playingAyah === ayah.number ? <Pause size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button
                        onClick={() => toggleBookmark(ayah.number)}
                        className={`p-2 rounded-full hover:bg-white/5 ${bookmarks.includes(ayah.number) ? 'text-noor-gold' : 'text-noor-muted'}`}
                        aria-label={`Bookmark ayah ${ayah.numberInSurah}`}
                      >
                        {bookmarks.includes(ayah.number) ? <Check size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>
                  </div>
                  <p className="font-arabic text-noor-ivory text-2xl sm:text-3xl leading-[2.2] text-right" dir="rtl">
                    {ayah.text}
                    <span className="text-noor-gold text-lg mr-2">﴿{ayah.numberInSurah}﴾</span>
                  </p>
                  {ayah.translation && (
                    <div className="mt-4 text-left"><p className="text-noor-muted text-sm leading-7">{ayah.translation}</p><p className="text-noor-muted/60 text-[10px] mt-2">Saheeh International</p></div>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-noor-muted text-xs">{listLoading ? 'Loading all 114 Surahs…' : `${filtered.length} of ${surahs.length} Surahs`}</p>
              {bookmarks.length > 0 && <span className="text-noor-gold text-xs">🔖 {bookmarks.length} saved ayahs</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((s) => (
                <button
                  key={s.number}
                  onClick={() => setSelected(s)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.5)' }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-noor-gold shrink-0" style={{ background: 'rgba(232,189,75,0.12)' }}>
                    {s.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-noor-ivory font-medium text-sm truncate">{s.englishName}</p>
                    <p className="text-noor-muted text-xs">{s.numberOfAyahs} Ayahs · {s.revelationType}</p>
                  </div>
                  <p className="font-arabic text-noor-gold text-lg shrink-0">{s.name.replace(/^سُورَةُ\s*/u, '')}</p>
                  <span
                    role="button"
                    tabIndex={0}
                    title={`Play full Surah ${s.englishName}`}
                    aria-label={`Play full Surah ${s.englishName}`}
                    onClick={(e) => { e.stopPropagation(); pendingPlaySurahRef.current = s.number; setSelected(s); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); pendingPlaySurahRef.current = s.number; setSelected(s); } }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-noor-gold border border-noor-gold/25 hover:bg-noor-gold/10 shrink-0"
                  ><Play size={13} fill="currentColor" /></span>
                  <ChevronRight size={14} className="text-noor-muted shrink-0" />
                </button>
              ))}
            </div>
            {!filtered.length && <div className="text-center py-12 text-noor-muted text-sm">No Surahs found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
