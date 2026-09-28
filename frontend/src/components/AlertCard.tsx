import React from 'react';
import { useTranslation } from 'react-i18next';

interface AlertCardProps {
  title: string;
  severity: 'high' | 'medium' | 'low';
  matchType: string;
  confidence: number;
  url: string;
  date: string;
}

export default function AlertCard({ title, severity, matchType, confidence, url, date }: AlertCardProps) {
  const { t } = useTranslation();

  const colors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    low: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[severity]}`}>
            {t(`alerts.${severity}`)}
          </span>
          <h4 className="font-medium text-slate-900">{title}</h4>
        </div>
        <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>{t(`alerts.${matchType}`)}</span>
          <span>{t('alerts.confidence')}: {confidence}%</span>
          <a href={url} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">
            {new URL(url).hostname}
          </a>
          <span>{date}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {t('alerts.takeAction')}
        </button>
        <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
          {t('alerts.dismiss')}
        </button>
      </div>
    </div>
  );
}
