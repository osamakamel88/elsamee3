import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Shield, Music, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import WorkCard from '../components/WorkCard';
import UploadModal from '../components/UploadModal';
import api from '../api/client';

export default function MyWorks() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultWorks = [
    {
      id: 'demo-1',
      title: 'Summer Breeze (Master WAV)',
      type: 'audio' as const,
      identifier: 'ISRC: USAT21234567 • ISWC: T-070.783.439-C',
      isMonitoring: true,
      matchCount: 2,
    },
    {
      id: 'demo-2',
      title: 'Cairo Sunset Calligraphy / لوحة شمس القاهرة',
      type: 'image' as const,
      identifier: 'pHash: e3a1f8c2b5d409e1 • Meta PDQ 256',
      isMonitoring: true,
      matchCount: 0,
    },
    {
      id: 'demo-3',
      title: 'Oud Improvisation in Maqam Bayati',
      type: 'audio' as const,
      identifier: 'Chromaprint: AQABz0mSRUkSJR_...',
      isMonitoring: false,
      matchCount: 1,
    }
  ];

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/works');
      if (response.data && response.data.items && response.data.items.length > 0) {
        setWorks(response.data.items.map((w: any) => ({
          id: w.id,
          title: w.title,
          type: w.work_type as 'audio' | 'image',
          identifier: w.isrc ? `ISRC: ${w.isrc}` : (w.iswc ? `ISWC: ${w.iswc}` : 'Acoustic Fingerprint Indexed'),
          isMonitoring: w.monitoring_enabled ?? true,
          matchCount: 0
        })));
      } else {
        setWorks(defaultWorks);
      }
    } catch (err) {
      setWorks(defaultWorks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-brand-blue" size={24} />
            <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.myWorks')}</h1>
          </div>
          <p className="text-slate-500 text-xs">
            {isRTL
              ? 'إدارة محفظة الأعمال المحمية ببصمات رقمية وتفعيل المراقبة الآلية على منصات التواصل والبث.'
              : 'Manage your fingerprinted creative catalog and configure continuous automated platform monitoring.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchWorks}
            disabled={loading}
            className="p-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh works"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-all text-sm"
          >
            <Plus size={18} />
            <span>{t('works.upload')}</span>
          </button>
        </div>
      </div>

      {/* Grid of Protected Works */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <WorkCard key={work.id} {...work} />
        ))}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWorks}
      />
    </div>
  );
}
