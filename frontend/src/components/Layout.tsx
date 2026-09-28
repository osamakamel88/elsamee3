import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageToggle from './LanguageToggle';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6">
          <LanguageToggle />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
