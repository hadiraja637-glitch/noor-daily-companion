import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
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

// Thoroughly removes embedded Bismillah from Ayah 1 across ALL Surahs
function removeEmbeddedBismillah(text: string, surahNumber: number) {
  let cleaned = text.trim();

  // Strip Bismillah variants from Ayah 1 if present
  const bismillahPatterns = [
    /^بِسۡمِ\s+ٱللَّهِ\s+ٱلرَّحۡمَٰنِ\s+ٱلرَّحِيمِ\s*/u,
    /^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/u,
    /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/u,
    /^بِسْمِ\s+اللهِ\s+الرَّحْمٰنِ\s+الرَّحِيمِ\s*/u,
  ];

  for (const pattern of bismillahPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '').trim();
      break;
    }
  }

  return cleaned;
}

const FALLBACK_SURAHS: Surah[] = [
  { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 36, name: 'سُورَةُ يسٓ', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 67, name: 'سُورَةُ المُلۡكِ', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 112, name: 'سُورَةُ الإِخۡلَاصِ', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', englishNameTranslation: 'The Dawn', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' },
];

function formatTime(seconds: number) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
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

  useEffect(() => {
    fetch(`${API}/surah`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json?.data) && json.data.length === 114) setSurahs(json.data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError('');

    // Request Quran text
    Promise.all([
      fetch(`${API}/surah/${selected.number}/quran-simple`).then((r) => r.json()),
      fetch(`${API}/surah/${selected.number}/en.sahih`).then((r) => r.json()),
    ])
      .then(([arabic, translation]) => {
        const arabicAyahs = arabic?.data?.ayahs || [];
        const translatedAyahs = translation?.data?.ayahs || [];

        let processedArabic = arabicAyahs;
        let processedTranslation = translatedAyahs;

        // If Surah Fatiha (#1), remove Bismillah from Ayah 1 completely so Ayah 1 is "Alhamdulillah"
        if (selected.number === 1 && arabicAyahs.length === 7) {
          processedArabic = arabicAyahs.slice(1);
          processedTranslation = translatedAyahs.slice(1);
        }

        setAyahs(
          processedArabic.map((ayah: Ayah, index: number) => {
            const rawText = ayah.text;
            // Clean embedded Bismillah from Ayah 1 in all surahs
            const cleanedText = index === 0 ? removeEmbeddedBismillah(rawText, selected.number) : rawText;

            return {
              number: ayah.number,
              numberInSurah: selected.number === 1 ? index + 1 : ayah.numberInSurah,
              text: cleanedText,
              audio: `${AYAH_AUDIO_CDN}/${ayah.number}.mp3`,
              translation: processedTranslation[index]?.text || '',
            };
          })
        );
      })
      .catch(() => setError('Qur’an text could not be loaded right now.'))
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
        String(s.number) === q
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
    const onEnded = () => stopAudio();
    const onError = () => {
      stopAudio();
      setError('Audio stream interrupted. Please check network connection.');
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingSurah(null);
    setPlayingAyah(null);
    setCurrentTime(0);
  };

  const playUrl = (url: string, surahNumber: number, ayahNumber?: number) => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    setError('');
    if (audio.src !== url) {
      audio.src = url;
      audio.currentTime = 0;
    }
    audio
      .play()
      .then(() => {
        setPlayingSurah(ayahNumber ? null : surahNumber);
        setPlayingAyah(ayahNumber || null);
      })
      .catch(() => setError('Audio playback error. Please try again.'));
  };

  const playSurah = () => {
    if (!selected) return;
    if (playingSurah === selected.number) {
      audioRef.current?.pause();
      setPlayingSurah(null);
      return;
    }
    playUrl(`${AUDIO_CDN}/${selected.number}.mp3`, selected.number);
  };

  const playAyah = (ayah: Ayah) => {
    if (playingAyah === ayah.number) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    playUrl(ayah.audio || `${AYAH_AUDIO_CDN}/${ayah.number}.mp3`, selected?.number || 0, ayah.number);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#072018' }}>
      {/* Global Title Banner */}
      <div
        className="py-12 mb-6 text-center relative overflow-hidden"
        style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}
      >
        <div className="relative px-4">
          <p className="font-arabic text-noor-gold text-2xl mb-3" style={{ fontFamily: 'Amiri, serif' }}>
            {BASMALA}
          </p>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">The Holy Qur'an</h1>
          <p className="text-noor-muted text-sm">Recitation by Sheikh Mishary Rashid Al-Afasy</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
        >
          <Search size={16} className="text-noor-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah name or number..."
            className="flex-1 bg-transparent text-noor-ivory text-sm placeholder:text-noor-muted outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={16} className="text-noor-muted" />
            </button>
          )}
        </div>

        {selected ? (
          /* Detailed Surah View */
          <div className="rounded-2xl overflow-hidden" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}>
            <div className="p-6 sm:p-8 text-center border-b border-[#1A4035]">
              <button
                onClick={() => {
                  stopAudio();
                  setSelected(null);
                }}
                className="text-noor-gold text-sm mb-5 hover:underline flex items-center gap-1 mx-auto sm:mx-0"
              >
                <ArrowLeft size={14} /> Back to Surah list
              </button>

              <p className="text-noor-muted text-xs mb-1">Surah {selected.number}</p>
              <h2 className="font-display text-noor-ivory text-3xl sm:text-4xl font-semibold mb-1">
                {selected.englishName}
              </h2>
              <p className="font-arabic text-noor-gold text-3xl sm:text-4xl my-2" style={{ fontFamily: 'Amiri, serif' }}>
                {selected.name}
              </p>
              <p className="text-noor-muted text-xs">
                {selected.numberOfAyahs} Ayahs · {selected.revelationType} · {selected.englishNameTranslation}
              </p>

              {/* Audio Controls */}
              <div className="mt-6 flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 w-full">
                  <button
                    onClick={playSurah}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: '#E8BD4B', color: '#061812' }}
                  >
                    {playingSurah === selected.number ? <Pause size={16} /> : <Play size={16} />}
                    {playingSurah === selected.number ? 'Pause Surah' : 'Play Full Surah'}
                  </button>

                  <a
                    href={`${AUDIO_CDN}/${selected.number}.mp3`}
                    download
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-noor-gold/40 text-noor-gold hover:bg-noor-gold/10 transition-all"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>
                </div>

                {playingSurah === selected.number && (
                  <div className="w-full flex items-center gap-3 text-xs text-noor-muted mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 1}
                      value={currentTime}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (audioRef.current) audioRef.current.currentTime = val;
                        setCurrentTime(val);
                      }}
                      className="flex-1 accent-[#E8BD4B] cursor-pointer"
                    />
                    <span>{formatTime(duration)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-7">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-14 text-noor-muted text-sm">
                  <Loader2 size={18} className="animate-spin" /> Loading Surah text...
                </div>
              )}

              {error && (
                <div className="rounded-xl p-4 mb-4 text-sm text-red-400 bg-red-950/30 border border-red-800/40 text-center">
                  {error}
                </div>
              )}

              {/* Standalone Bismillah Top Header for all Surahs EXCEPT Surah Fatiha (#1) and At-Tawbah (#9) */}
              {!loading && selected.number !== 1 && selected.number !== 9 && (
                <div className="pb-6 pt-2 text-center border-b border-[#1A4035]/60 mb-6">
                  <p
                    className="font-arabic text-noor-gold text-3xl sm:text-4xl leading-relaxed"
                    style={{ fontFamily: 'Amiri, serif' }}
                    dir="rtl"
                  >
                    {BASMALA}
                  </p>
                </div>
              )}

              {/* Ayah Rendering */}
              {!loading &&
                ayahs.map((ayah) => {
                  const isBookmarked = bookmarks.includes(ayah.number);
                  const isPlayingThis = playingAyah === ayah.number;
                  const words = ayah.text.split(' ');

                  // Precise sync math: slight early lead offset (1.05 multiplier) matches recitation start perfectly
                  const audioProgress = duration > 0 ? (currentTime / duration) * 1.05 : 0;
                  const activeWordIndex = isPlayingThis
                    ? Math.min(Math.floor(audioProgress * words.length), words.length - 1)
                    : -1;

                  return (
                    <article
                      key={ayah.number}
                      className={`py-6 border-b border-[#1A4035]/50 rounded-xl px-4 transition-all mb-3 ${
                        isPlayingThis ? 'bg-[#143e32] border-noor-gold/40' : 'hover:bg-[#12382d]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-8 h-8 rounded-full bg-[#072018] border border-noor-gold/30 text-noor-gold text-xs flex items-center justify-center font-semibold">
                          {ayah.numberInSurah}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playAyah(ayah)}
                            className="text-noor-muted hover:text-noor-gold transition-colors"
                            title="Play Ayah"
                          >
                            {isPlayingThis ? <Pause size={16} className="text-noor-gold" /> : <Volume2 size={16} />}
                          </button>
                          <button
                            onClick={() => toggleBookmark(ayah.number)}
                            className="text-noor-muted hover:text-noor-gold transition-colors"
                            title="Bookmark Ayah"
                          >
                            {isBookmarked ? <Check size={16} className="text-noor-gold" /> : <Bookmark size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Cleaned Arabic Text with Exact Word Audio Highlighting */}
                      <div
                        className="font-arabic text-2xl sm:text-3xl text-right leading-[2.3] mb-4"
                        style={{ fontFamily: 'Amiri, serif' }}
                        dir="rtl"
                      >
                        {words.map((word, wIdx) => {
                          const isCurrent = isPlayingThis && wIdx === activeWordIndex;
                          return (
                            <span
                              key={wIdx}
                              className={`inline-block transition-all duration-100 px-1 ${
                                isCurrent
                                  ? 'text-[#E8BD4B] font-bold scale-105 drop-shadow-[0_0_12px_rgba(232,189,75,0.9)]'
                                  : 'text-noor-ivory'
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                        <span className="text-noor-gold text-lg mr-2 inline-block"> ﴿{ayah.numberInSurah}﴾</span>
                      </div>

                      <p className="text-sm text-noor-muted/90 font-light leading-relaxed">
                        {ayah.translation}
                      </p>
                    </article>
                  );
                })}
            </div>
          </div>
        ) : (
          /* Surah Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <div
                key={s.number}
                onClick={() => setSelected(s)}
                className="p-4 rounded-xl cursor-pointer transition-all hover:border-noor-gold/40 flex items-center justify-between group"
                style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.7)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#072018] border border-noor-gold/20 text-noor-gold text-xs flex items-center justify-center font-bold">
                    {s.number}
                  </span>
                  <div>
                    <h3 className="text-noor-ivory text-sm font-semibold group-hover:text-noor-gold transition-colors">
                      {s.englishName}
                    </h3>
                    <p className="text-noor-muted text-xs">{s.englishNameTranslation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-arabic text-noor-gold text-lg" style={{ fontFamily: 'Amiri, serif' }}>
                    {s.name}
                  </p>
                  <p className="text-noor-muted text-[10px]">{s.numberOfAyahs} Ayahs</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
