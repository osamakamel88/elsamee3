import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import { Menu, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-40 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30">
          {/* Mobile hamburger menu & branding */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ms-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <Logo size="sm" />
          </div>

          {/* Desktop trust indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>{isRTL ? 'نظام حماية المصنفات وحقوق المؤلفين نشط' : 'Real-time Copyright Guardian Active'}</span>
          </div>

          {/* Header Actions (Language Toggle) */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
