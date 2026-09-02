import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import AssessmentView from './views/AssessmentView';
import ResultsView from './views/ResultsView';
import StreamsView from './views/StreamsView';
import CareersView from './views/CareersView';

import { getRecommendations } from './services/api';

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [inputName, setInputName] = useState('');

  const [activeView, setActiveView] = useState('home'); // 'home', 'results', 'careers', 'streams'
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (trimmed) {
      setStudentName(trimmed);
      setHasEnteredName(true);
      setActiveView('home');
    }
  };

  const handleResetName = () => {
    setHasEnteredName(false);
    setStudentName('');
    setInputName('');
    setActiveResult(null);
    setActiveView('home');
  };

  const handleAssessmentSubmit = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: studentName,
        subjects: profileData.subjects || [],
        skills: profileData.skills || [],
        interests: profileData.interests || [],
      };
      const res = await getRecommendations(payload);
      setActiveResult(res);
      setActiveView('results');
    } catch (err) {
      console.error('Assessment Submit Error:', err);
      setError('Unable to reach Career Copilot API backend. Ensure FastAPI server is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: INITIAL NAME PROMPT SCREEN
  if (!hasEnteredName) {
    return (
      <div className="min-h-screen bg-[#3B30C8] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center border border-white/20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-3xl font-extrabold shadow-sm border border-indigo-100">
            ✨
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Career Copilot</h1>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-1">Class 10 AI Pathway</p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What's your name?
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-slate-900 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: MAIN ASSESSMENT & NAVIGATION SCREEN
  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <AssessmentView
            studentName={studentName}
            onSubmit={handleAssessmentSubmit}
            loading={loading}
          />
        );
      case 'results':
        return (
          <ResultsView
            activeResult={activeResult}
            studentName={studentName}
            onEditAssessment={() => setActiveView('home')}
          />
        );
      case 'streams':
        return <StreamsView onSelectStream={() => setActiveView('home')} />;
      case 'careers':
        return <CareersView />;
      default:
        return (
          <AssessmentView
            studentName={studentName}
            onSubmit={handleAssessmentSubmit}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto min-h-[calc(100vh-2rem)] flex flex-col lg:flex-row rounded-[32px] overflow-hidden shadow-2xl bg-[#3B30C8] border border-white/10">
      {/* Left Sidebar (Only Home, Explore Careers, Streams & Courses) */}
      <div className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden'} shrink-0`}>
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); }}
          onResetName={handleResetName}
        />
      </div>

      {/* Main White Content Container */}
      <main className="flex-1 bg-white rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-8 m-1 lg:m-2 flex flex-col overflow-x-hidden min-h-0">
        {/* Welcome Header Bar */}
        <Header
          studentName={studentName}
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900 font-bold">Dismiss</button>
          </div>
        )}

        {/* Active Main View */}
        <div className="flex-1">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
