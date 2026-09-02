import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  BookOpen, 
  BrainCircuit, 
  BarChart3, 
  MessageSquareText, 
  Settings, 
  LogOut,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assessment', label: 'My Assessment', icon: BrainCircuit },
  { id: 'results', label: 'My Results', icon: BarChart3 },
  { id: 'streams', label: 'Streams & Courses', icon: BookOpen },
  { id: 'careers', label: 'Explore Careers', icon: Compass },
  { id: 'assistant', label: 'Career Assistant', icon: MessageSquareText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-full lg:w-64 bg-[#3B30C8] text-white flex flex-col justify-between p-4 lg:p-6 shrink-0 rounded-2xl lg:rounded-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              Career Copilot<span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </h1>
            <p className="text-[11px] font-medium text-indigo-200 uppercase tracking-widest">Class 10 AI Pathway</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-500/30 font-semibold transform translate-x-1'
                    : 'text-indigo-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-200'}`} />
                <span>{item.label}</span>
                {item.id === 'assessment' && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 space-y-4">
        {/* Promo / Action Card */}
        <div className="bg-white rounded-2xl p-4 text-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-100 rounded-full blur-xl opacity-50"></div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Sparkles className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 leading-tight">AI Career Assessment</h4>
          <p className="text-xs text-slate-500 mt-1">Discover your perfect stream & career options.</p>
          <button 
            onClick={() => setActiveView('assessment')}
            className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Take Assessment</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Sign Out / Reset Button */}
        <button 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 text-indigo-200 hover:text-white text-xs font-medium px-2 py-1 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
