import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.settings')}</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{t('settings.profile')}</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.fullName')}</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-brand-blue" />
          </div>
          <button className="px-6 py-2 bg-brand-blue text-white rounded-lg">{t('common.save')}</button>
        </div>
      </div>
    </div>
  );
}
