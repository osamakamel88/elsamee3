import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import WorkCard from '../components/WorkCard';
import UploadModal from '../components/UploadModal';

export default function MyWorks() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockWorks = [
    { id: 1, title: 'Summer Breeze', type: 'audio' as const, identifier: 'ISRC: US1234567890', isMonitoring: true, matchCount: 2 },
    { id: 2, title: 'Sunset Canvas', type: 'image' as const, identifier: 'ID: IMG-9876', isMonitoring: false, matchCount: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.myWorks')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>{t('works.upload')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockWorks.map(work => (
          <WorkCard key={work.id} {...work} />
        ))}
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
