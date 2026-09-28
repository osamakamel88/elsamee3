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
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar() {
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
    <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-brand-blue tracking-wider">{t('app.name')}</h1>
        <p className="text-xs text-slate-400 mt-1">{t('app.tagline')}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-brand-blue text-white' : 'hover:bg-slate-700'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
