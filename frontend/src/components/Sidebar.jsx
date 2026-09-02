import React from 'react';
import { Home, Compass, BookOpen, GraduationCap } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'careers', label: 'Explore Careers', icon: Compass },
  { id: 'streams', label: 'Streams & Courses', icon: BookOpen },
];

export default function Sidebar({ activeView, setActiveView, onResetName }) {
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

        {/* Navigation Items (Only 3 Items for Mock) */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (activeView === 'results' && item.id === 'home');
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
              </button>
            );
          })}
        </nav>
      </div>

      {/* Change Name Option */}
      {onResetName && (
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onResetName}
            className="text-xs text-indigo-200 hover:text-white flex items-center gap-2 transition-colors px-2 py-1"
          >
            <span>✏️ Change Name</span>
          </button>
        </div>
      )}
    </aside>
  );
}
