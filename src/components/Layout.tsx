import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Sprout, CloudRain, TrendingUp, MessageCircle, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import VoiceAssistant from './VoiceAssistant';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/yield", icon: Sprout, label: t("nav.yield") },
    { to: "/climate", icon: CloudRain, label: t("nav.climate") },
    { to: "/market", icon: TrendingUp, label: t("nav.market") },
    { to: "/chat", icon: MessageCircle, label: t("nav.chat") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-700 text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
          <span>{t("app.title")}</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-10 w-64 bg-emerald-800 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen shrink-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-emerald-700 hidden md:flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-lg object-contain bg-white p-1" />
          <h1 className="font-bold text-xl tracking-tight">{t("app.title")}</h1>
        </div>

        <div className="px-4 pt-4">
          <div className="bg-emerald-900/50 p-1 rounded-lg flex">
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                language === 'en' ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-200 hover:text-white"
              )}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                language === 'ta' ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-200 hover:text-white"
              )}
            >
              தமிழ்
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-white text-emerald-800 shadow-lg font-medium"
                  : "text-emerald-100 hover:bg-emerald-700/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-emerald-900/50 rounded-xl p-4 text-xs text-emerald-200">
            <p className="font-medium text-white mb-1">{t("ai.status")}</p>
            <p>{t("ai.powered")}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <VoiceAssistant />
    </div>
  );
}
