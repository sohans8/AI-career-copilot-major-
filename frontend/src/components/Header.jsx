import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Calendar, Menu, Sparkles } from 'lucide-react';

export default function Header({ studentName = 'Aarav Patel', onTakeAssessment, toggleMobileMenu }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
      {/* Left Greeting */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-200 border-2 border-white shrink-0">
          🎓
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {studentName}!
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Class 10 Student
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Let's discover your ideal career path based on your skills & interests!
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Date / Weather Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{currentDate}</span>
          <span className="text-slate-300">|</span>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* CTA Button */}
        <button
          onClick={onTakeAssessment}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Take Assessment</span>
        </button>

        {/* Notification Icon */}
        <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-600 flex items-center justify-center transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500"></span>
        </button>
      </div>
    </header>
  );
}
