import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ShieldCheck, FileText, Music, User, Disc, Image as ImageIcon } from 'lucide-react';
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
  description?: string;
  isrc?: string;
  iswc?: string;
  license?: string;
  confidence?: number;
}

interface ResultCardProps {
  item: ResultItem;
  onMonitor?: (item: ResultItem) => void;
  onTakedown?: (item: ResultItem) => void;
}

export default function ResultCard({ item, onMonitor, onTakedown }: ResultCardProps) {
  const { t } = useTranslation();

  const getSourceBadgeStyle = (source: string) => {
    if (source.includes('MusicBrainz')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (source.includes('Discogs')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (source.includes('Openverse')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getSourceIcon = (type?: string, source?: string) => {
    if (type === 'artist') return <User size={15} className="text-blue-600" />;
    if (type === 'release' || source?.includes('Discogs')) return <Disc size={15} className="text-amber-600" />;
    if (type === 'visual_artwork' || source?.includes('Openverse')) return <ImageIcon size={15} className="text-emerald-600" />;
    return <Music size={15} className="text-blue-600" />;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getSourceBadgeStyle(item.source)}`}>
              {getSourceIcon(item.type, item.source)}
              {item.source}
            </span>
            {item.type && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wider">
                {item.type.replace('_', ' ')}
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
              <span><strong className="text-slate-700">Creator/Artist:</strong> {item.author || item.artist}</span>
            ) : null}
          </p>

          {item.description && (
            <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Identifiers */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            {item.isrc && (
              <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-100">
                ISRC: {item.isrc}
              </span>
            )}
            {item.iswc && (
              <span className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold border border-purple-100">
                ISWC: {item.iswc}
              </span>
            )}
          </div>
        </div>

        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
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
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-blue hover:text-blue-700 hover:underline"
            >
              <span>View Repertoire Entry</span>
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
                toast.success(`Monitoring activated for "${item.title}"`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue border border-blue-200 rounded-lg text-xs font-semibold hover:bg-brand-blue hover:text-white transition-colors"
          >
            <ShieldCheck size={14} />
            <span>Monitor Asset</span>
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
            <span>Draft DMCA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
