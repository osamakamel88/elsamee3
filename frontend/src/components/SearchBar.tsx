import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, Image as ImageIcon, X, ArrowRight, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface SearchBarProps {
  onSearch: (query: string, filterCategory?: string) => void;
  onFileSearch?: (file: File, type: 'audio' | 'image') => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, onFileSearch, isLoading }: SearchBarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

  // Dropzone for Audio
  const { getRootProps: getAudioProps, getInputProps: getAudioInput } = useDropzone({
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a'] },
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0 && onFileSearch) {
        onFileSearch(files[0], 'audio');
      }
    },
  });

  // Dropzone for Image
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
    { id: 'all', label: isRTL ? 'جميع الأعمال والفنانين' : 'All Works & Artists' },
    { id: 'artist', label: isRTL ? '🎤 الفنانون والمبدعون' : '🎤 Artists & Creators' },
    { id: 'music', label: isRTL ? '🎵 التسجيلات والأغاني' : '🎵 Music & Recordings' },
    { id: 'visual', label: isRTL ? '🖼️ الفنون البصرية والصور' : '🖼️ Visual Art & Images' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center bg-white rounded-2xl shadow-sm border-2 border-slate-200 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100 transition-all p-1.5">
        <div className="ps-4 text-slate-400">
          <Search size={22} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.placeholder') || "Search by artist name, track title, ISRC, ISWC, or paste URL..."}
          className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-slate-800 placeholder-slate-400 font-medium text-base"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors me-1"
          >
            <X size={18} />
          </button>
        )}

        {/* Media Upload Buttons */}
        <div className="flex items-center gap-1.5 border-s border-slate-200 ps-2 pe-2">
          <div
            {...getAudioProps()}
            className="cursor-pointer p-2 hover:bg-blue-50 hover:text-brand-blue rounded-xl text-slate-500 transition-colors"
            title={isRTL ? 'رفع ملف صوتي لمطابقة البصمة' : 'Upload audio for acoustic fingerprint matching'}
          >
            <input {...getAudioInput()} />
            <Mic size={19} />
          </div>

          <div
            {...getImageProps()}
            className="cursor-pointer p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-slate-500 transition-colors"
            title={isRTL ? 'رفع صورة للبحث العكسي' : 'Upload artwork for reverse perceptual image matching'}
          >
            <input {...getImageInput()} />
            <ImageIcon size={19} />
          </div>
        </div>

        {/* Dedicated Search Action Button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-brand-blue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{isRTL ? 'جاري البحث...' : 'Searching...'}</span>
            </>
          ) : (
            <>
              <span>{isRTL ? 'بحث' : 'Search'}</span>
              <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
