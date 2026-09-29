import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageToggle from './LanguageToggle';
import { Menu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from './Footer';

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isRTL } = useLanguage();

  return (
    <div className="flex min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-smoke flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 text-ash hover:text-ink rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block" />

          <LanguageToggle />
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto flex flex-col justify-between">
          <Outlet />
          <Footer variant="compact" className="mt-12" />
        </main>
      </div>
    </div>
  );
}
