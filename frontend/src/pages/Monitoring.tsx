import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Monitoring() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.monitoring')}</h1>
      
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500">{t('common.noData')}</p>
      </div>
    </div>
  );
}
