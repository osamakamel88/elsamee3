import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ShieldCheck, FileText, Music, User, Disc, Image as ImageIcon, Feather, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface ResultItem {
  id?: string;
  title: string;
  artist?: string;
  author?: string;
  source: string;
  type?: string;
  url?: string;
  thumbnail?: string;
  image_url?: string;
  description?: string;
  isrc?: string;
  iswc?: string;
  license?: string;
  confidence?: number;
  metadata?: any;
}

interface ResultCardProps {
  item: ResultItem;
  onMonitor?: (item: ResultItem) => void;
  onTakedown?: (item: ResultItem) => void;
}

export default function ResultCard({ item, onMonitor, onTakedown }: ResultCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isArabCMO = item.type === 'arab_cmo' || item.source.includes('Arab Repertoire');

  const getSourceBadgeStyle = (source: string, type?: string) => {
    if (source.includes('Apple Music') || source.includes('DSP')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (source.includes('The MLC')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (source.includes('SACEM')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (type === 'arab_cmo' || source.includes('Arab')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
    if (source.includes('MusicBrainz')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (source.includes('Discogs')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (source.includes('Openverse')) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getSourceIcon = (type?: string, source?: string) => {
    if (source?.includes('Apple Music') || source?.includes('DSP')) return <Music size={15} className="text-rose-600" />;
    if (source?.includes('The MLC')) return <Building2 size={15} className="text-indigo-600" />;
    if (source?.includes('SACEM')) return <Building2 size={15} className="text-purple-600" />;
    if (type === 'arab_cmo' || source?.includes('Arab')) return <Building2 size={15} className="text-emerald-700" />;
    if (type === 'lyricist' || type === 'lyrics') return <Feather size={15} className="text-purple-600" />;
    if (type === 'composer' || type === 'work' || type === 'songwriter_profile') return <Music size={15} className="text-indigo-600" />;
    if (type === 'artist') return <User size={15} className="text-blue-600" />;
    if (type === 'release' || source?.includes('Discogs')) return <Disc size={15} className="text-amber-600" />;
    if (type === 'visual_artwork' || source?.includes('Openverse')) return <ImageIcon size={15} className="text-teal-600" />;
    return <Music size={15} className="text-blue-600" />;
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${
      isArabCMO
        ? 'bg-gradient-to-r from-emerald-50/50 to-white border-emerald-200 shadow-sm'
        : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getSourceBadgeStyle(item.source, item.type)}`}>
              {getSourceIcon(item.type, item.source)}
              {item.source}
            </span>

            {item.type && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wider">
                {item.type === 'arab_cmo' ? (isRTL ? 'هيئة / جمعية حقوق مؤلفين وملحنين' : 'Authors & Composers CMO') : item.type.replace('_', ' ')}
              </span>
            )}

            {item.license && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                {item.license}
              </span>
            )}
          </div>

          <h3 className="font-bold text-lg text-slate-900 leading-snug">
            {item.title}
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            {item.author || item.artist ? (
              <span><strong className="text-slate-700">{isRTL ? 'الجهة / الصانع:' : 'Creator / Country:'}</strong> {item.artist || item.author}</span>
            ) : null}
          </p>

          {item.description && (
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Arab CMO Services & Registration Guide */}
          {isArabCMO && item.metadata && (
            <div className="mt-3.5 pt-3 border-t border-emerald-100 space-y-2">
              {item.metadata.services && (
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 uppercase">
                    {isRTL ? 'الخدمات والحماية للملحنين والشعراء:' : 'Key Services for Composers & Lyricists:'}
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1 text-xs text-slate-600">
                    {item.metadata.services.map((srv: string, sIdx: number) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.metadata.guide && (
                <p className="text-[11px] text-slate-500 bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <strong className="text-emerald-800">{isRTL ? 'دليل الانضمام والتوثيق: ' : 'Registration Guide: '}</strong>
                  {item.metadata.guide}
                </p>
              )}
            </div>
          )}

          {/* Identifiers (ISWC for Composers/Lyricists & ISRC for Recordings) */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            {item.iswc && (
              <span className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold border border-purple-200">
                🎼 ISWC (العمل واللحن): {item.iswc}
              </span>
            )}
            {item.isrc && (
              <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                🎤 ISRC (التسجيل الصوتي): {item.isrc}
              </span>
            )}
          </div>
        </div>

        {(item.thumbnail || item.image_url) && (
          <img
            src={item.image_url || item.thumbnail}
            alt={item.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-blue-700 hover:underline"
            >
              <span>{isArabCMO ? (isRTL ? 'زيارة البوابة الرسمية والتسجيل' : 'Visit Official Society Portal') : (isRTL ? 'معاينة القيد والتوثيق' : 'View Repertoire Entry')}</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onMonitor) {
                onMonitor(item);
              } else {
                toast.success(isRTL ? `تم تفعيل المراقبة لـ "${item.title}"` : `Monitoring activated for "${item.title}"`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue border border-blue-200 rounded-lg text-xs font-semibold hover:bg-brand-blue hover:text-white transition-colors"
          >
            <ShieldCheck size={14} />
            <span>{isRTL ? 'مراقبة حقوق هذا العمل' : 'Monitor Asset'}</span>
          </button>

          <button
            onClick={() => {
              if (onTakedown) {
                onTakedown(item);
              } else {
                toast(`DMCA draft ready for "${item.title}"`, { icon: '📄' });
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <FileText size={14} />
            <span>{isRTL ? 'إشعار إزالة للملحن/الشاعر' : 'Draft DMCA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
