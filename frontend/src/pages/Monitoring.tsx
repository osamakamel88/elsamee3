import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radar, Play, CheckCircle2, Clock, Globe, Shield, RefreshCw, AlertTriangle, Sparkles, GitBranch } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Monitoring() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [scanning, setScanning] = useState(false);

  const [monitors, setMonitors] = useState([
    {
      id: 1,
      platform: 'YouTube & Shorts',
      scope: 'Acoustic waveform matching & metadata scraper',
      interval: 'Every 6 hours',
      lastScan: '12 minutes ago',
      status: 'active',
      matchesFound: 3,
      icon: '🎥',
    },
    {
      id: 2,
      platform: 'Spotify & Streaming Aggregators',
      scope: 'ISRC lookup & unauthorized re-releases',
      interval: 'Daily (24h)',
      lastScan: '1 hour ago',
      status: 'active',
      matchesFound: 1,
      icon: '🎧',
    },
    {
      id: 3,
      platform: 'Hugging Face AI Hub',
      scope: 'Fine-tuned LoRA models & voice checkpoints',
      interval: 'Every 12 hours',
      lastScan: '4 hours ago',
      status: 'active',
      matchesFound: 2,
      icon: '🤖',
    },
    {
      id: 4,
      platform: 'GitHub & Code Repositories',
      scope: 'Public audio sample packs & leaked stems',
      interval: 'Daily (24h)',
      lastScan: 'Yesterday',
      status: 'active',
      matchesFound: 1,
      icon: '💻',
    },
    {
      id: 5,
      platform: 'Print-on-Demand (Redbubble, TeePublic)',
      scope: 'Reverse image visual perceptual hashing (pHash)',
      interval: 'Every 48 hours',
      lastScan: '2 days ago',
      status: 'idle',
      matchesFound: 4,
      icon: '🖼️',
    },
  ]);

  const handleTriggerScan = () => {
    setScanning(true);
    toast(isRTL ? 'جاري بدء المسح الشامل عبر المنصات ونماذج الذكاء الاصطناعي...' : 'Initiating comprehensive scan across platforms and AI models...', { icon: '📡' });

    setTimeout(() => {
      setScanning(false);
      toast.success(isRTL ? 'اكتمل الفحص! تم فحص 5 منصات وتحديث التنبيهات.' : 'Scan completed! 5 platforms checked and alerts updated.');
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radar className="text-brand-blue animate-pulse" size={24} />
            <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.monitoring')}</h1>
          </div>
          <p className="text-slate-500 text-xs">
            {isRTL
              ? 'مراقبة دائمة 24/7 عبر خوارزميات البصمات الصوتية والصورية ومسح نماذج Hugging Face ومستودعات GitHub.'
              : '24/7 continuous monitoring via acoustic & visual hashing, scanning Hugging Face models and GitHub repositories.'}
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Active Monitors</span>
          <p className="text-2xl font-black text-slate-900">5 Platforms</p>
          <span className="text-xs text-emerald-600 font-medium">● 100% Operational</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Catalog Protected</span>
          <p className="text-2xl font-black text-slate-900">3 Works</p>
          <span className="text-xs text-slate-500">Audio & Visual Assets</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">AI Model Scans (HF)</span>
          <p className="text-2xl font-black text-amber-600">Active</p>
          <span className="text-xs text-slate-500">Voice & Style Check</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Detected Matches</span>
          <p className="text-2xl font-black text-rose-600">11 Flags</p>
          <span className="text-xs text-slate-500">Ready for review</span>
        </div>
      </div>

      {/* Monitors List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          {isRTL ? 'محركات المسح النشطة والمنصات المغطاة' : 'Active Platform Scanners'}
        </h2>

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
                <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  {m.matchesFound} matches
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
