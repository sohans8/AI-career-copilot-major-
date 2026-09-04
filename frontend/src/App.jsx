import React, { useState } from 'react';
import logoImg from './assets/logo.png';
import { ArrowRight, Zap, Star, Brain } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AssessmentView from './views/AssessmentView';
import ResultsView from './views/ResultsView';
import StreamsView from './views/StreamsView';
import CareersView from './views/CareersView';
import { getRecommendations } from './services/api';

// ─── Floating orb background ─────────────────────────────────────────────────
function OrbBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[90px]" />
    </div>
  );
}

// ─── Landing / Name Entry Screen ─────────────────────────────────────────────
function LandingScreen({ inputName, setInputName, onSubmit }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'}}>
      <OrbBg />

      {/* Floating badges */}
      <div className="absolute top-12 left-8 hidden lg:flex items-center gap-2 glass rounded-2xl px-4 py-2.5 animate-float" style={{animationDelay:'0s'}}>
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-white/80">AI-Powered</span>
      </div>
      <div className="absolute top-24 right-12 hidden lg:flex items-center gap-2 glass rounded-2xl px-4 py-2.5 animate-float" style={{animationDelay:'1s'}}>
        <Star className="w-4 h-4 text-pink-400" />
        <span className="text-xs font-semibold text-white/80">12 Stream Options</span>
      </div>
      <div className="absolute bottom-20 left-16 hidden lg:flex items-center gap-2 glass rounded-2xl px-4 py-2.5 animate-float" style={{animationDelay:'2s'}}>
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-white/80">200+ Careers</span>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {/* Glow ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[36px] blur-sm opacity-50" />

        <div className="relative bg-[#1a1740]/95 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 shadow-card-dark">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img 
              src={logoImg} 
              alt="Career Copilot Logo" 
              className="w-64 sm:w-72 h-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Subtitle */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-indigo-300">
              AI-Powered Class 10 → Class 11 Pathway
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { val: '12', label: 'Streams' },
              { val: '200+', label: 'Careers' },
              { val: 'AI', label: 'Engine' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-3 text-center">
                <div className="text-lg font-black text-white">{s.val}</div>
                <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-2 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter your full name..."
                required
                autoFocus
                className="w-full px-4 py-4 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 font-medium text-sm focus:outline-none focus:border-indigo-400 focus:bg-white/12 transition-all"
                style={{background: 'rgba(255,255,255,0.07)'}}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
              style={{background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)'}}
            >
              <span>Get My Career Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-white/30 mt-5 font-medium">
            Hybrid AI + Domain Rule Engine • Free • No account needed
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [studentName, setStudentName]       = useState('');
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [inputName, setInputName]           = useState('');
  const [activeView, setActiveView]         = useState('home');
  const [activeResult, setActiveResult]     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (trimmed) {
      setStudentName(trimmed);
      setHasEnteredName(true);
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
      const res = await getRecommendations({
        name: studentName,
        subjects: profileData.subjects || [],
        skills: profileData.skills || [],
        interests: profileData.interests || [],
      });
      setActiveResult(res);
      setActiveView('results');
    } catch (err) {
      setError('Cannot reach the backend. Make sure the FastAPI server is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  // ── Landing screen ──────────────────────────────────────────────────────────
  if (!hasEnteredName) {
    return <LandingScreen inputName={inputName} setInputName={setInputName} onSubmit={handleNameSubmit} />;
  }

  // ── Main dashboard ──────────────────────────────────────────────────────────
  const renderView = () => {
    switch (activeView) {
      case 'home':    return <AssessmentView studentName={studentName} onSubmit={handleAssessmentSubmit} loading={loading} />;
      case 'results': return <ResultsView activeResult={activeResult} studentName={studentName} onEditAssessment={() => setActiveView('home')} />;
      case 'streams': return <StreamsView onSelectStream={() => setActiveView('home')} />;
      case 'careers': return <CareersView />;
      default:        return <AssessmentView studentName={studentName} onSubmit={handleAssessmentSubmit} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen relative" style={{background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'}}>
      <OrbBg />
      <div className="relative z-10 max-w-[1600px] mx-auto p-2 sm:p-3 lg:p-4 min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row gap-3 flex-1">

          {/* Sidebar */}
          <div className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden'} shrink-0`}>
            <Sidebar
              activeView={activeView}
              setActiveView={(v) => { setActiveView(v); setMobileMenuOpen(false); }}
              onResetName={handleResetName}
              studentName={studentName}
            />
          </div>

          {/* Main content */}
          <main className="flex-1 glass-white rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-2rem)]">
            <Header
              studentName={studentName}
              activeView={activeView}
              toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            />

            {error && (
              <div className="mx-6 mt-0 mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-black text-red-500 hover:text-red-700 ml-4">✕</button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
