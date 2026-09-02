import React from 'react';
import { Menu, Bell, Sparkles, ChevronRight } from 'lucide-react';

const VIEW_LABELS = {
  home:    { title: 'Career Assessment', sub: 'Select your subjects, skills & interests' },
  results: { title: 'Your Results',       sub: 'AI-generated career pathway recommendation' },
  streams: { title: 'Stream Catalog',     sub: 'Explore all 12 Class 11–12 academic streams' },
  careers: { title: 'Career Explorer',    sub: 'Browse 200+ career options by domain' },
};

export default function Header({ studentName, activeView, toggleMobileMenu }) {
  const { title, sub } = VIEW_LABELS[activeView] || VIEW_LABELS.home;

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100/80 shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page breadcrumb */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Career Copilot</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">
            {activeView === 'home' ? `Hi, ${studentName} 👋` : title}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5 hidden sm:block">{sub}</p>
        </div>
      </div>

      {/* Right: AI badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', color: '#4f46e5', border: '1px solid #c7d2fe'}}>
          <Sparkles className="w-3.5 h-3.5" />
          AI Powered
        </div>

        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center relative cursor-pointer hover:bg-slate-200 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-black shadow-md">
          {studentName ? studentName[0].toUpperCase() : 'S'}
        </div>
      </div>
    </header>
  );
}
