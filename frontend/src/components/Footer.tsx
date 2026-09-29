import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Globe2, Shield } from 'lucide-react';

interface FooterProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export default function Footer({ className = '', variant = 'full' }: FooterProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  if (variant === 'compact') {
    return (
      <footer className={`py-4 text-center text-xs text-slate-500 border-t border-slate-100 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>
            © {currentYear} <strong>elsamee3</strong> (السميع). {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 font-medium text-slate-600">
            <span>{isRTL ? 'تصميم وتطوير بواسطة' : 'Designed & Developed by'}</span>
            <a
              href="https://o3.instafeed.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-blue hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 transition-colors"
            >
              <span>O3 Smart Solutions</span>
              <ExternalLink size={12} />
            </a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-slate-200/80 bg-white py-10 text-xs text-slate-600 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-50 text-brand-blue">
              <Globe2 size={16} />
            </span>
            <p className="text-slate-600 font-medium">
              {isRTL
                ? 'السميع (elsamee3) — درع الملكية الفكرية والبصمة الصوتية للفنانين والمبدعين حول العالم.'
                : 'elsamee3 — Global Copyright Protection & Forensic Fingerprinting Vault for Creators Worldwide.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold">
              <Shield size={13} className="text-emerald-600" />
              <span>{isRTL ? 'معايير NIST FIPS 180-4 العالمية' : 'NIST FIPS 180-4 Global Standard'}</span>
            </span>
          </div>
        </div>

        {/* Mandatory O3 Attribution and Copyright Row */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div>
            © {currentYear} <strong className="text-slate-700 font-bold">elsamee3</strong> (السميع). {isRTL ? 'جميع الحقوق محفوظة للمبدعين والمؤلفين.' : 'All rights reserved.'}
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors">
            <span>{isRTL ? 'تم التصميم والتطوير بواسطة' : 'Designed & Developed by'}</span>
            <a
              href="https://o3.instafeed.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-blue hover:text-blue-700 hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <span>O3 Smart Solutions</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
