import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ studentName = '', toggleMobileMenu }) {
  return (
    <header className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white shrink-0">
          🎓
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {studentName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Let's discover your ideal career path.
          </p>
        </div>
      </div>
    </header>
  );
}
