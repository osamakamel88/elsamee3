import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function SearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    // Handle file upload search
    console.log(acceptedFiles);
  };

  const { getRootProps: getAudioProps, getInputProps: getAudioInput } = useDropzone({
    onDrop,
    accept: { 'audio/*': [] },
  });

  const { getRootProps: getImageProps, getInputProps: getImageInput } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center gap-2 bg-white p-2 rounded-full shadow-sm border border-slate-200">
      <div className="flex-1 flex items-center px-4">
        <Search className="text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent border-none outline-none px-4 py-2 text-slate-700 placeholder-slate-400"
        />
      </div>
      <div className="flex items-center gap-2 pe-2">
        <div {...getAudioProps()} className="cursor-pointer p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title={t('search.uploadAudio')}>
          <input {...getAudioInput()} />
          <Mic size={20} />
        </div>
        <div {...getImageProps()} className="cursor-pointer p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title={t('search.uploadImage')}>
          <input {...getImageInput()} />
          <ImageIcon size={20} />
        </div>
      </div>
    </div>
  );
}
