import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
    >
      {currentLanguage === 'en' ? 'عربي' : 'English'}
    </button>
  );
}
