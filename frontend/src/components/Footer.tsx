import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

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
      <footer className={`py-5 text-center text-xs text-ash ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
          <span>
            &copy; {currentYear} elsamee3
          </span>
          <span className="hidden sm:inline text-smoke">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <span>{isRTL ? 'تصميم وتطوير' : 'Designed & Developed by'}</span>
            <a
              href="https://o3.instafeed.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:underline underline-offset-2 inline-flex items-center gap-0.5 transition-colors"
            >
              O3 Smart Solutions
              <ExternalLink size={10} />
            </a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-smoke bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-lg font-bold tracking-display">
              {isRTL ? 'السميع' : 'elsamee3'}
            </span>
            <p className="text-sm text-ash max-w-sm">
              {isRTL
                ? 'حماية الملكية الفكرية والبصمة الصوتية للمبدعين والفنانين حول العالم.'
                : 'Copyright protection and forensic fingerprinting for creators worldwide.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ash">
            {['SACERAU', 'SAIP', 'ONDA', 'BMDA', 'ISWC', 'The MLC'].map((org) => (
              <span key={org} className="font-mono text-xs">{org}</span>
            ))}
          </div>
        </div>

        <div className="h-px bg-smoke" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ash">
          <span>
            &copy; {currentYear} elsamee3 ({isRTL ? 'السميع' : 'elsamee3'}). {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
          <span className="inline-flex items-center gap-1">
            <span>{isRTL ? 'تصميم وتطوير بواسطة' : 'Designed & Developed by'}</span>
            <a
              href="https://o3.instafeed.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:underline underline-offset-2 inline-flex items-center gap-0.5 transition-colors"
            >
              O3 Smart Solutions
              <ExternalLink size={11} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
