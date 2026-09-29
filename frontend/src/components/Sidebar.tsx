import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Music,
  Search,
  Calculator,
  Radar,
  Bell,
  FileText,
  Settings,
  LogOut,
  X,
  Home,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { isRTL } = useLanguage();

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: t('nav.dashboard') },
    { to: '/search', icon: <Search size={18} />, label: t('nav.search') },
    { to: '/estimator', icon: <Calculator size={18} />, label: t('nav.estimator') },
    { to: '/works', icon: <Music size={18} />, label: t('nav.myWorks') },
    { to: '/monitoring', icon: <Radar size={18} />, label: t('nav.monitoring') },
    { to: '/alerts', icon: <Bell size={18} />, label: t('nav.alerts') },
    { to: '/takedowns', icon: <FileText size={18} />, label: t('nav.takedowns') },
    { to: '/settings', icon: <Settings size={18} />, label: t('nav.settings') },
    { to: '/', icon: <Home size={18} />, label: isRTL ? 'الرئيسية' : 'Home' },
  ];

  return (
    <aside
      className={`
        fixed md:static inset-y-0 start-0 z-50
        w-64 bg-white border-e border-smoke text-ink flex flex-col min-h-screen
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0'}
      `}
    >
      {/* Header */}
      <div className="px-4 h-16 flex items-center justify-between border-b border-smoke">
        <Logo size="sm" />
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-ash hover:text-ink rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => { if (onClose) onClose(); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[13px] font-medium ${
                isActive
                  ? 'bg-mist text-ink'
                  : 'text-ash hover:text-ink hover:bg-mist/60'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-smoke">
        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-start rounded-lg text-ash hover:text-ink hover:bg-mist/60 transition-colors text-[13px] font-medium"
        >
          <LogOut size={18} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
