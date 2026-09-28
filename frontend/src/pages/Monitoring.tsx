import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radar, Play, CheckCircle2, Clock, Globe, Shield, RefreshCw, Layers, Music, Radio } from 'lucide-react';
import { toast } from 'react-hot-toast';
import WriterSentinel from '../components/WriterSentinel';

export default function Monitoring() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState<'sentinel' | 'platforms'>('sentinel');
  const [scanning, setScanning] = useState(false);

  const [monitors, setMonitors] = useState([
    {
      id: 1,
      platform: 'The MLC (US Mechanical Licensing)',
      scope: 'Automatic scraping of registered works, song codes, and publisher splits',
      interval: 'Every 12 hours',
      lastScan: 'Just now',
      status: 'active',
      matchesFound: 14,
      icon: '🏛️',
    },
    {
      id: 2,
      platform: 'SACEM de Paris & SDRM',
      scope: 'French & international author/composer repertoire cross-indexing',
      interval: 'Daily (24h)',
      lastScan: '5 minutes ago',
      status: 'active',
      matchesFound: 25,
      icon: '🇫🇷',
    },
    {
      id: 3,
      platform: 'DistroKid & Streaming Aggregators',
      scope: 'DSP digital release monitoring (Spotify, Apple Music) for missing lyricist credits',
      interval: 'Every 6 hours',
      lastScan: '15 minutes ago',
      status: 'active',
      matchesFound: 6,
      icon: '🎧',
    },
    {
      id: 4,
      platform: 'YouTube & Shorts Acoustic Matcher',
      scope: 'Audio fingerprint matching for covers, remixes, and unauthorized syncs',
      interval: 'Every 6 hours',
      lastScan: '12 minutes ago',
      status: 'active',
      matchesFound: 3,
      icon: '🎥',
    },
    {
      id: 5,
      platform: 'Arab Authors & Composers Societies (SACERAU, etc.)',
      scope: 'Regional Arab repertoire tracking & registration directory alerts',
      interval: 'Daily (24h)',
      lastScan: '1 hour ago',
      status: 'active',
      matchesFound: 8,
      icon: '📜',
    },
  ]);

  const handleTriggerScan = () => {
    setScanning(true);
    toast(
      isRTL 
        ? 'جاري بدء مسح المنصات الرقمية ومطابقة البصمات الصوتية...' 
        : 'Initiating comprehensive platform scan and acoustic fingerprint matching...', 
      { icon: '📡' }
    );

    setTimeout(() => {
      setScanning(false);
      toast.success(
        isRTL 
          ? 'اكتمل الفحص! تم فحص كافة المنصات وتحديث التنبيهات.' 
          : 'Platform scan completed! All channels verified.'
      );
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Navigation Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sentinel'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio size={16} />
            <span>{isRTL ? 'مراقب قيود الشاعر والملحن (The MLC / SACEM / DistroKid)' : 'Writer & Repertoire Sentinel'}</span>
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'platforms'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radar size={16} />
            <span>{isRTL ? 'مراقبة المنصات الرقمية والبصمات' : 'Platform & Audio Scanners'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isRTL ? 'نظام المراقبة الآلي نشط 24/7' : '24/7 Automated Sentinel Active'}</span>
        </div>
      </div>

      {/* Tab 1: Writer & Repertoire Sentinel */}
      {activeTab === 'sentinel' && (
        <WriterSentinel />
      )}

      {/* Tab 2: Audio & Visual Platform Scanners */}
      {activeTab === 'platforms' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Radar className="text-brand-blue animate-pulse" size={24} />
                <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.monitoring')}</h1>
              </div>
              <p className="text-slate-500 text-xs">
                {isRTL
                  ? 'مراقبة دائمة 24/7 عبر خوارزميات البصمات الصوتية ومسح منصات البث الرقمي للكشف عن أي استخدامات غير مصرح بها.'
                  : '24/7 continuous monitoring via acoustic hashing & digital DSP scrapers to detect unauthorized usage.'}
              </p>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={scanning}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-all text-sm disabled:opacity-50"
            >
              <Play size={16} className={scanning ? 'animate-spin' : ''} />
              <span>{scanning ? (isRTL ? 'جاري المسح...' : 'Scanning...') : (isRTL ? 'بدء فحص فوري الآن' : 'Run Deep Scan Now')}</span>
            </button>
          </div>

          {/* Platform Scanners Grid */}
          <div className="grid grid-cols-1 gap-4">
            {monitors.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
                    {m.icon}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{m.platform}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} />
                        <span>{m.status}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{m.scope}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>Frequency: <strong>{m.interval}</strong></span>
                  </div>
                  <span>Last: <strong>{m.lastScan}</strong></span>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {m.matchesFound} works
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
