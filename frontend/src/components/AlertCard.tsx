import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface AlertCardProps {
  title: string;
  severity: 'high' | 'medium' | 'low';
  matchType: string;
  confidence: number;
  url: string;
  date: string;
  onDismiss?: () => void;
}

export default function AlertCard({ title, severity, matchType, confidence, url, date, onDismiss }: AlertCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const colors = {
    high: 'text-red-700 bg-red-50 border-red-200',
    medium: 'text-orange-700 bg-orange-50 border-orange-200',
    low: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  };

  const getHostname = (link: string) => {
    try {
      return new URL(link).hostname;
    } catch {
      return link;
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[severity]}`}>
            {t(`alerts.${severity}`)}
          </span>
          <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {t(`alerts.${matchType}`) || matchType}
          </span>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
            {confidence}% Match
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-base mb-1">{title}</h4>

        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-brand-blue font-medium hover:underline"
          >
            <span>{getHostname(url)}</span>
            <ExternalLink size={12} />
          </a>
          <span>Detected: {date}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={() => {
            navigate('/takedowns');
            toast.success(`Preparing DMCA notice for "${title}"`);
          }}
          className="px-4 py-2 bg-brand-blue text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          {t('alerts.takeAction')}
        </button>
        <button
          onClick={() => {
            if (onDismiss) {
              onDismiss();
            } else {
              toast('Alert dismissed', { icon: '🗑️' });
            }
          }}
          className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          {t('alerts.dismiss')}
        </button>
      </div>
    </div>
  );
}
