import React from 'react';
import { Home, Compass, BookOpen, GraduationCap, LogOut, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',    label: 'Assessment',      icon: Home,    color: 'from-indigo-500 to-purple-500' },
  { id: 'careers', label: 'Explore Careers', icon: Compass, color: 'from-pink-500 to-rose-500' },
  { id: 'streams', label: 'Stream Catalog',  icon: BookOpen,color: 'from-cyan-500 to-blue-500' },
];

export default function Sidebar({ activeView, setActiveView, onResetName, studentName }) {
  const initials = studentName
    ? studentName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'CC';

  return (
    <aside className="w-full lg:w-64 flex flex-col rounded-[24px] overflow-hidden"
      style={{background: 'linear-gradient(180deg, rgba(30,27,74,0.98) 0%, rgba(20,17,60,0.98) 100%)', border: '1px solid rgba(255,255,255,0.08)'}}>

      {/* Brand */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-70" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">Career Copilot</h1>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">AI Pathway Engine</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (activeView === 'results' && item.id === 'home');
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-white/12 text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/6'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isActive
                  ? `bg-gradient-to-br ${item.color} shadow-md`
                  : 'bg-white/8 group-hover:bg-white/12'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
              </div>
              <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* AI badge */}
      <div className="mx-4 mb-4 mt-4 p-4 rounded-2xl" style={{background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)'}}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-300">AI Recommendation</span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">
          Hybrid Rule + ML engine scores 12 streams for your profile.
        </p>
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xs font-black shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{studentName || 'Student'}</p>
            <p className="text-[10px] text-white/40 font-medium">Class 10 Student</p>
          </div>
          <button
            onClick={onResetName}
            title="Switch user"
            className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
