import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';

export default function Search() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.search')}</h1>
      
      <div className="py-8">
        <SearchBar />
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold">{t('search.results')}</h2>
        <div className="text-center text-slate-500 py-12">
          {t('search.noResults')}
        </div>
      </div>
    </div>
  );
}
