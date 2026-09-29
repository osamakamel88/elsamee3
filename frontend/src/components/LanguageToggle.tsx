import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-xs font-medium text-ash hover:text-ink border border-smoke rounded-full hover:border-ink/20 transition-colors"
    >
      {currentLanguage === 'en' ? 'عربي' : 'EN'}
    </button>
  );
}
