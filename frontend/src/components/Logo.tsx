import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  theme?: 'dark' | 'light';
  className?: string;
  asLink?: boolean;
}

export default function Logo({
  size = 'md',
  variant = 'full',
  theme = 'light',
  className = '',
  asLink = true,
}: LogoProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-ink';

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Minimal mark — just a refined dot */}
      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-ink'}`} />
      <span className={`font-bold tracking-display ${textSizes[size]} ${textColor}`}>
        elsamee3
      </span>
    </div>
  );

  if (!asLink) return content;

  return (
    <Link to="/" className="inline-block" aria-label="elsamee3 Home">
      {content}
    </Link>
  );
}
