import React from 'react';
import { useTranslation } from 'react-i18next';
import { Music, Image as ImageIcon } from 'lucide-react';

interface WorkCardProps {
  title: string;
  type: 'audio' | 'image';
  identifier: string;
  isMonitoring: boolean;
  matchCount: number;
}

export default function WorkCard({ title, type, identifier, isMonitoring, matchCount }: WorkCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400">
        {type === 'audio' ? <Music size={48} /> : <ImageIcon size={48} />}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 truncate" title={title}>{title}</h3>
          <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${isMonitoring ? 'bg-brand-green' : 'bg-slate-300'}`} title={t('works.monitoringEnabled')} />
        </div>
        <p className="text-sm text-slate-500 mb-4">{identifier}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
            {type === 'audio' ? t('works.audio') : t('works.image')}
          </span>
          <span className="text-slate-500">
            {matchCount} {t('search.results')}
          </span>
        </div>
      </div>
    </div>
  );
}
