import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, Image as ImageIcon, FileText, X, ArrowRight, Loader2, Music, Feather, Building2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface SearchBarProps {
  onSearch: (query: string, filterCategory?: string) => void;
  onFileSearch?: (file: File, type: 'audio' | 'image') => void;
  onLyricsSearch?: (lyrics: string) => void;
  onClear?: () => void;
  initialQuery?: string;
  initialFilter?: string;
  isLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  onFileSearch,
  onLyricsSearch,
  onClear,
  initialQuery = '',
  initialFilter = 'all',
  isLoading
}: SearchBarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [lyricsInput, setLyricsInput] = useState('');

  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  React.useEffect(() => {
    if (initialFilter !== undefined) {
      setActiveFilter(initialFilter);
    }
  }, [initialFilter]);

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), activeFilter);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query.trim(), activeFilter);
      }
    }
  };

  const handleLyricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lyricsInput.trim() && onLyricsSearch) {
      onLyricsSearch(lyricsInput.trim());
      setShowLyricsModal(false);
    }
  };

  // Dropzone for Audio (Composers / Performers)
  const { getRootProps: getAudioProps, getInputProps: getAudioInput } = useDropzone({
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a'] },
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0 && onFileSearch) {
        onFileSearch(files[0], 'audio');
      }
    },
  });

  // Dropzone for Image (Visual Artists)
  const { getRootProps: getImageProps, getInputProps: getImageInput } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg'] },
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0 && onFileSearch) {
        onFileSearch(files[0], 'image');
      }
    },
  });

  const filterTabs = [
    { id: 'all', label: isRTL ? 'جميع المصادر' : 'All Sources', icon: null },
    { id: 'composer', label: isRTL ? '🎼 الملحنون والألحان (Composers)' : '🎼 Composers & Works', icon: Music },
    { id: 'lyricist', label: isRTL ? '✍️ الشعراء وكتاب الكلمات (Lyricists)' : '✍️ Lyricists & Poets', icon: Feather },
    { id: 'arab_cmo', label: isRTL ? '🏛️ الجمعيات والهيئات العربية (Arab CMOs)' : '🏛️ Arab Societies & SACERAU', icon: Building2 },
    { id: 'music', label: isRTL ? '🎵 التسجيلات والأغاني' : '🎵 Songs & Recordings', icon: null },
    { id: 'visual', label: isRTL ? '🖼️ الفنون البصرية' : '🖼️ Visual Art', icon: null },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center bg-white rounded-2xl shadow-sm border-2 border-slate-200 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100 transition-all p-1 sm:p-1.5">
        <div className="ps-2 sm:ps-4 text-slate-400 shrink-0">
          <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.placeholder') || "Search by composer, lyricist, track title, ISWC, or paste lyrics..."}
          className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 sm:px-4 py-2 sm:py-3 text-slate-800 placeholder-slate-400 font-medium text-sm sm:text-base"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors me-1 shrink-0"
          >
            <X size={16} />
          </button>
        )}

        {/* Media & Lyrics Buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 border-s border-slate-200 ps-1 sm:ps-2 pe-1 sm:pe-2 shrink-0">
          {/* Dedicated Lyrics Paste Button for Lyricists */}
          <button
            type="button"
            onClick={() => setShowLyricsModal(true)}
            className="p-1.5 sm:p-2 hover:bg-purple-50 hover:text-purple-600 rounded-xl text-slate-500 transition-colors"
            title={isRTL ? 'فحص كلمات الأغاني والقصائد من السرقة' : 'Check lyrics & poetry for plagiarism'}
          >
            <Feather size={17} className="sm:w-[19px] sm:h-[19px]" />
          </button>

          {/* Audio Upload for Composers / Performers */}
          <div
            {...getAudioProps()}
            className="cursor-pointer p-1.5 sm:p-2 hover:bg-blue-50 hover:text-brand-blue rounded-xl text-slate-500 transition-colors"
            title={isRTL ? 'رفع مقطع لحني أو صوتي لمطابقة البصمة' : 'Upload melody or audio clip for fingerprinting'}
          >
            <input {...getAudioInput()} />
            <Mic size={17} className="sm:w-[19px] sm:h-[19px]" />
          </div>

          {/* Image Upload for Visual Artists */}
          <div
            {...getImageProps()}
            className="cursor-pointer p-1.5 sm:p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-slate-500 transition-colors"
            title={isRTL ? 'رفع عمل بصري للبحث العكسي' : 'Upload visual artwork for reverse image matching'}
          >
            <input {...getImageInput()} />
            <ImageIcon size={17} className="sm:w-[19px] sm:h-[19px]" />
          </div>
        </div>

        {/* Dedicated Search Action Button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-3 sm:px-6 py-2 sm:py-3 bg-brand-blue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-1 sm:gap-2 shadow-sm transition-all text-sm sm:text-base shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">{isRTL ? 'جاري البحث...' : 'Searching...'}</span>
            </>
          ) : (
            <>
              <span>{isRTL ? 'بحث' : 'Search'}</span>
              <ArrowRight size={16} className={`shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </form>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveFilter(tab.id);
              if (query.trim()) {
                onSearch(query.trim(), tab.id);
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modal for Lyricists to Paste Lyrics */}
      {showLyricsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Feather size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {isRTL ? 'فحص نصوص الكلمات والقصائد الشعرية' : 'Scan Lyrics & Poetry for Infringement'}
                </h3>
              </div>
              <button onClick={() => setShowLyricsModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {isRTL
                ? 'الصق كلمات الأغنية أو أبيات القصيدة لحساب البصمة النصية وفحص السرقات أو الاقتباسات غير المرخصة في الأغاني والأعمال المنشورة.'
                : 'Paste song lyrics or poetry stanzas to compute cryptographic text fingerprints and scan for unlicensed usage or theft.'}
            </p>

            <form onSubmit={handleLyricsSubmit} className="space-y-4">
              <textarea
                value={lyricsInput}
                onChange={(e) => setLyricsInput(e.target.value)}
                rows={6}
                required
                placeholder={isRTL ? 'اكتب أو الصق نص الكلمات أو المقطع الشعري هنا...' : 'Type or paste lyrics verses / chorus here...'}
                className="w-full p-4 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLyricsModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Search size={14} />
                  <span>{isRTL ? 'بدء فحص الكلمات' : 'Scan Lyrics Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
