import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ResultCard({ title, artist, identifiers }: any) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-slate-600 text-sm mt-1">{artist}</p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm">{t('works.monitoringEnabled')}</button>
      </div>
    </div>
  );
}
