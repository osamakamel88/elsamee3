import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  asLink?: boolean;
}

export default function Logo({
  size = 'md',
  variant = 'full',
  theme = 'auto',
  className = '',
  asLink = true,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isDark = theme === 'dark';

  const iconElement = (
    <div className={`relative shrink-0 ${iconSizes[size]} rounded-2xl bg-slate-950 p-1 flex items-center justify-center shadow-md shadow-blue-900/20 border border-slate-800/80`}>
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="freqGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Shield Contour */}
        <path
          d="M24 5L8 12V22C8 33.5 15.2 40.5 24 43.5C32.8 40.5 40 33.5 40 22V12L24 5Z"
          fill="url(#shieldGrad)"
          opacity="0.18"
        />
        <path
          d="M24 7L10 13V22C10 32.2 16.5 38.8 24 41.5C31.5 38.8 38 32.2 38 22V13L24 7Z"
          stroke="url(#shieldGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Frequency & Fingerprint Wave Bars */}
        <rect x="15" y="20" width="2.5" height="8" rx="1.25" fill="url(#freqGrad)" />
        <rect x="19.5" y="15" width="2.5" height="18" rx="1.25" fill="#38bdf8" />
        <rect x="24" y="11" width="3" height="26" rx="1.5" fill="#ffffff" />
        <rect x="29" y="15" width="2.5" height="18" rx="1.25" fill="#818cf8" />
        <rect x="33.5" y="20" width="2.5" height="8" rx="1.25" fill="url(#freqGrad)" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return asLink ? (
      <Link to="/" className={`inline-flex items-center ${className}`} aria-label="elsamee3 logo">
        {iconElement}
      </Link>
    ) : (
      <div className={`inline-flex items-center ${className}`}>{iconElement}</div>
    );
  }

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {iconElement}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight font-arabic ${textSizes[size]} ${isDark ? 'text-white' : 'text-slate-900'}`}>
            السميع
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className={`font-bold tracking-tight font-sans ${textSizes[size]} text-brand-blue`}>
            elsamee3
          </span>
        </div>
        {size !== 'sm' && (
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wider mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            خزنة الملكية الفكرية والبصمة الصوتية
          </span>
        )}
      </div>
    </div>
  );

  return asLink ? (
    <Link to="/" className="inline-block transition-opacity hover:opacity-95" aria-label="elsamee3 Home">
      {content}
    </Link>
  ) : (
    content
  );
}
