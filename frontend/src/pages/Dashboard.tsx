import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ShieldCheck, AlertTriangle, TrendingDown } from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title={t('dashboard.totalWorks')} value={42} icon={<ShieldCheck size={24} />} />
        <StatsCard title={t('dashboard.activeScans')} value={3} icon={<Activity size={24} />} />
        <StatsCard title={t('dashboard.recentAlerts')} value={12} icon={<AlertTriangle size={24} />} />
        <StatsCard title={t('dashboard.breachTrend')} value="-5%" icon={<TrendingDown size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.recentAlerts')}</h2>
          <div className="text-slate-500 text-center py-8">{t('common.noData')}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
              {t('works.upload')}
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
              {t('nav.search')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
