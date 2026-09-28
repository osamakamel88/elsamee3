import React from 'react';
import { useTranslation } from 'react-i18next';
import AlertCard from '../components/AlertCard';

export default function Alerts() {
  const { t } = useTranslation();

  const mockAlerts = [
    { id: 1, title: 'Summer Breeze (Copy)', severity: 'high' as const, matchType: 'exactCopy', confidence: 99, url: 'https://example.com/breach1', date: '2024-01-01' },
    { id: 2, title: 'Sunset Canvas Remix', severity: 'medium' as const, matchType: 'modified', confidence: 75, url: 'https://example.com/breach2', date: '2024-01-02' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.alerts')}</h1>
      
      <div className="space-y-4">
        {mockAlerts.map(alert => (
          <AlertCard key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  );
}
