import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  className?: string;
  asLink?: boolean;
  showArabic?: boolean;
}

export default function Logo({
  size = 'md',
  theme = 'light',
  className = '',
  asLink = true,
  showArabic = false,
}: LogoProps) {

  const sizes = {
    sm: { icon: 28, text: 'text-[15px]', gap: 'gap-2' },
    md: { icon: 32, text: 'text-lg', gap: 'gap-2.5' },
    lg: { icon: 38, text: 'text-xl', gap: 'gap-3' },
    xl: { icon: 48, text: 'text-2xl', gap: 'gap-3' },
  };

  const s = sizes[size];
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-ink';
  const barFill = isDark ? '#ffffff' : '#0f0f0f';
  const barFillMuted = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,15,15,0.25)';

  const logoMark = (
    <div className={`inline-flex items-center ${s.gap} select-none ${className}`}>
      {/* Waveform icon — the brand signature */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0"
      >
        <rect x="2"  y="11" width="2" height="10" rx="1" fill={barFillMuted} />
        <rect x="7"  y="7"  width="2" height="18" rx="1" fill={barFillMuted} />
        <rect x="12" y="4"  width="2.5" height="24" rx="1.25" fill="#6366f1" />
        <rect x="17" y="2"  width="3" height="28" rx="1.5" fill={barFill} />
        <rect x="22.5" y="4"  width="2.5" height="24" rx="1.25" fill="#6366f1" />
        <rect x="27" y="7"  width="2" height="18" rx="1" fill={barFillMuted} />
      </svg>

      {/* Integrated wordmark */}
      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-display ${s.text} ${textColor}`}>
          elsamee3
        </span>
        {showArabic && (
          <span className={`font-arabic text-[10px] font-medium mt-0.5 ${isDark ? 'text-white/50' : 'text-ash'}`}>
            السميع
          </span>
        )}
      </div>
    </div>
  );

  if (!asLink) return logoMark;

  return (
    <Link to="/" className="inline-block" aria-label="elsamee3 Home">
      {logoMark}
    </Link>
  );
}
