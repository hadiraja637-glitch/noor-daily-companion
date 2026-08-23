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

// Quran.com Official API v4
const QURAN_COM_API = 'https://api.quran.com/api/v4';
const RECITER_ID = 7; // Sheikh Mishary Rashid Al-Afasy

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

type Word = {
  id: number;
  position: number;
  text_uthmani: string;
};

type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  audioUrl?: string;
  words: Word[];
  timestamps?: { word_position: number; timestamp_from: number; timestamp_to: number }[];
};

const BASMALA = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

const FALLBACK_SURAHS: Surah[] = [
  { number: 1, name: 'سُورَةُ ٱلْفَاتِحَةِ', englishName: 'Al-Fatihah', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'makkah' },
  { number: 2, name: 'سُورَةُ البَقَرَةِ', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'madinah' },
  { number: 36, name: 'سُورَةُ يسٓ', englishName: 'Ya-Sin', englishNameTranslation: 'Ya-Sin', numberOfAyahs: 83, revelationType: 'makkah' },
  { number: 67, name: 'سُورَةُ المُلۡكِ', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'makkah' },
  { number: 112, name: 'سُورَةُ الإِخۡلَاصِ', englishName: 'Al-Ikhlas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'makkah' },
  { number: 113, name: 'سُورَةُ الفَلَقِ', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'makkah' },
  { number: 114, name: 'سُورَةُ النَّاسِ', englishName: 'An-Nas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'makkah' },
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

  // Load All Chapters from Quran.com API
  useEffect(() => {
    fetch(`${QURAN_COM_API}/chapters?language=en`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.chapters) {
          const formatted = data.chapters.map((ch: any) => ({
            number: ch.id,
            name: ch.name_arabic,
            englishName: ch.name_simple,
            englishNameTranslation: ch.translated_name.name,
            numberOfAyahs: ch.verses_count,
            revelationType: ch.revelation_place,
          }));
          setSurahs(formatted);
        }
      })
      .catch(() => undefined);
  }, []);

  // Fetch Verses with Accurate Words & Audio Timestamps for Selected Surah
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError('');

    const fetchVerses = `${QURAN_COM_API}/verses/by_chapter/${selected.number}?language=en&words=true&word_fields=text_uthmani&translations=131&per_page=300`;
    const fetchAudio = `${QURAN_COM_API}/recitations/${RECITER_ID}/by_chapter/${selected.number}?per_page=300&fields=timestamps`;

    Promise.all([fetch(fetchVerses).then((r) => r.json()), fetch(fetchAudio).then((r) => r.json())])
      .then(([versesRes, audioRes]) => {
        const versesList = versesRes?.verses || [];
        const audioList = audioRes?.audio_files || [];

        const audioMap = new Map();
        audioList.forEach((item: any) => {
          audioMap.set(item.verse_key, {
            url: item.url.startsWith('http') ? item.url : `https://audio.qurancdn.com/${item.url}`,
            timestamps: item.timestamps || [],
          });
        });

        const formattedAyahs: Ayah[] = versesList.map((v: any) => {
          const verseKey = v.verse_key;
          const audioData = audioMap.get(verseKey);

          // Clean non-letter word components
          const wordsList: Word[] = (v.words || [])
            .filter((w: any) => w.char_type_name === 'word')
            .map((w: any) => ({
              id: w.id,
              position: w.position,
              text_uthmani: w.text_uthmani,
            }));

          const cleanArabicText = wordsList.map((w) => w.text_uthmani).join(' ');
          const enTranslation = v.translations?.[0]?.text?.replace(/<[^>]+>/g, '') || '';

          return {
            number: v.id,
            numberInSurah: v.verse_number,
            text: cleanArabicText,
            translation: enTranslation,
            audioUrl: audioData?.url,
            words: wordsList,
            timestamps: audioData?.timestamps || [],
          };
        });

        setAyahs(formattedAyahs);
      })
      .catch(() => setError('Qur’an data could not be retrieved from Quran.com servers.'))
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
      .catch(() => setError('Audio playback failed to start.'));
  };

  const playSurah = () => {
    if (!selected || ayahs.length === 0) return;
    const fullSurahAudio = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${selected.number}.mp3`;
    if (playingSurah === selected.number) {
      audioRef.current?.pause();
      setPlayingSurah(null);
      return;
    }
    playUrl(fullSurahAudio, selected.number);
  };

  const playAyah = (ayah: Ayah) => {
    if (!ayah.audioUrl) return;
    if (playingAyah === ayah.number) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    playUrl(ayah.audioUrl, selected?.number || 0, ayah.number);
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
              <p className="text-noor-muted text-xs capitalize">
                {selected.numberOfAyahs} Ayahs · {selected.revelationType} · {selected.englishNameTranslation}
              </p>

              {/* Audio Player Controls */}
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
                    href={`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${selected.number}.mp3`}
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
                  <Loader2 size={18} className="animate-spin" /> Fetching clean Quranic data...
                </div>
              )}

              {error && (
                <div className="rounded-xl p-4 mb-4 text-sm text-red-400 bg-red-950/30 border border-red-800/40 text-center">
                  {error}
                </div>
              )}

              {/* Bismillah Header (Shown for all surahs EXCEPT Surah At-Tawbah #9) */}
              {!loading && selected.number !== 9 && (
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

              {/* Ayah List */}
              {!loading &&
                ayahs.map((ayah) => {
                  const isBookmarked = bookmarks.includes(ayah.number);
                  const isPlayingThis = playingAyah === ayah.number;

                  // High-Precision Word Timestamp Highlighting from Quran.com
                  const curMs = currentTime * 1000;
                  let activeWordPos = -1;

                  if (isPlayingThis && ayah.timestamps && ayah.timestamps.length > 0) {
                    const activeSegment = ayah.timestamps.find(
                      (ts) => curMs >= ts.timestamp_from && curMs <= ts.timestamp_to
                    );
                    if (activeSegment) {
                      activeWordPos = activeSegment.word_position;
                    }
                  }

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

                      {/* Cleaned Arabic Text + Accurate Quran.com Timestamp Highlighting */}
                      <div
                        className="font-arabic text-2xl sm:text-3xl text-right leading-[2.3] mb-4"
                        style={{ fontFamily: 'Amiri, serif' }}
                        dir="rtl"
                      >
                        {ayah.words.map((word) => {
                          const isCurrent = isPlayingThis && word.position === activeWordPos;
                          return (
                            <span
                              key={word.id}
                              className={`inline-block transition-all duration-75 px-1 ${
                                isCurrent
                                  ? 'text-[#E8BD4B] font-bold scale-105 drop-shadow-[0_0_12px_rgba(232,189,75,0.9)]'
                                  : 'text-noor-ivory'
                              }`}
                            >
                              {word.text_uthmani}
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
          /* Grid View for All Surahs */
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
