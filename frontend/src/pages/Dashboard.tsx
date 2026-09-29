import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Calculator,
  Search,
  Upload,
  Sparkles,
  Coins,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.dashboard')}</h1>
        
        <button
          onClick={() => navigate('/estimator')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <Calculator size={16} />
          <span>{isRTL ? 'حاسبة العائدات والتعويضات 💰' : 'Royalty & Damages Calculator 💰'}</span>
        </button>
      </div>
      
      {/* Featured Estimator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <Sparkles size={13} />
            <span>{isRTL ? 'ميزة جديدة وحصرية' : 'New Feature'}</span>
          </div>
          <h2 className="text-xl font-bold">
            {isRTL ? 'تقدير أرباح المصنفات والمطالبات القضائية' : 'Royalty & Damages Valuation Engine'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {isRTL
              ? 'احسب أرباحك الصافية كشاعر أو ملحن من استماعات Spotify وYouTube وتيك توك، واحصل على تقدير التعويض القانوني العادل لأي استغلال تجاري غير مرخص.'
              : 'Estimate multi-channel royalties across YouTube, DSPs, TikTok UGC, and calculate statutory damages under copyright law.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/estimator')}
          className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-colors shadow-md"
        >
          <span>{isRTL ? 'ابدأ الحساب الآن' : 'Launch Estimator'}</span>
          {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title={t('dashboard.totalWorks')} value={42} icon={<ShieldCheck size={24} />} />
        <StatsCard title={t('dashboard.activeScans')} value={3} icon={<Activity size={24} />} />
        <StatsCard title={t('dashboard.recentAlerts')} value={12} icon={<AlertTriangle size={24} />} />
        <StatsCard title={t('dashboard.breachTrend')} value="-5%" icon={<TrendingDown size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.recentAlerts')}</h2>
          <div className="text-slate-500 text-center py-8">{t('common.noData')}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/estimator')}
              className="w-full text-start px-4 py-3 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 rounded-xl transition-colors border border-emerald-200 flex items-center justify-between font-bold text-sm"
            >
              <div className="flex items-center gap-2.5">
                <Calculator size={18} className="text-emerald-700" />
                <span>{isRTL ? 'تقدير العائدات والتعويضات التقديرية' : 'Royalty & Damages Calculator'}</span>
              </div>
              <span className="text-xs bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
                {isRTL ? 'جديد' : 'New'}
              </span>
            </button>

            <button
              onClick={() => navigate('/works')}
              className="w-full text-start px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 flex items-center gap-2.5 text-slate-700 text-sm font-semibold"
            >
              <Upload size={18} className="text-slate-500" />
              <span>{t('works.upload')}</span>
            </button>

            <button
              onClick={() => navigate('/search')}
              className="w-full text-start px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 flex items-center gap-2.5 text-slate-700 text-sm font-semibold"
            >
              <Search size={18} className="text-slate-500" />
              <span>{t('nav.search')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
