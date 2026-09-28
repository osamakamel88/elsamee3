import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold">{t('works.upload')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
            <input {...getInputProps()} />
            <Upload className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 font-medium">Drag & drop your files here, or click to select</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('works.title')}</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('works.type')}</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue">
                <option value="audio">{t('works.audio')}</option>
                <option value="image">{t('works.image')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('works.isrc')}</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('works.iswc')}</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="monitoring" className="w-4 h-4 text-brand-blue rounded border-slate-300" />
            <label htmlFor="monitoring" className="text-sm font-medium text-slate-700">{t('works.monitoringEnabled')}</label>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
            {t('common.cancel')}
          </button>
          <button className="px-6 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
