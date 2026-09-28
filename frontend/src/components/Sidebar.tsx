import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Music,
  Search,
  Radar,
  Bell,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { isRTL } = useLanguage();

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: t('nav.dashboard') },
    { to: '/works', icon: <Music size={20} />, label: t('nav.myWorks') },
    { to: '/search', icon: <Search size={20} />, label: t('nav.search') },
    { to: '/monitoring', icon: <Radar size={20} />, label: t('nav.monitoring') },
    { to: '/alerts', icon: <Bell size={20} />, label: t('nav.alerts') },
    { to: '/takedowns', icon: <FileText size={20} />, label: t('nav.takedowns') },
    { to: '/settings', icon: <Settings size={20} />, label: t('nav.settings') },
  ];

  return (
    <aside
      className={`
        fixed md:static inset-y-0 start-0 z-50
        w-72 md:w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0'}
      `}
    >
      {/* Sidebar Header with Close button on mobile */}
      <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-brand-blue tracking-wider">{t('app.name')}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('app.tagline')}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => {
              if (onClose) onClose();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-brand-blue text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="font-medium text-sm sm:text-base">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-start rounded-xl text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm sm:text-base">{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
