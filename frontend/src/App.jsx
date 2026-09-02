import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RightPanel from './components/RightPanel';

import DashboardView from './views/DashboardView';
import AssessmentView from './views/AssessmentView';
import ResultsView from './views/ResultsView';
import StreamsView from './views/StreamsView';
import CareersView from './views/CareersView';
import CareerAssistantView from './views/CareerAssistantView';
import SettingsView from './views/SettingsView';

import { getRecommendations } from './services/api';
import { PRESET_PROFILES } from './data/presetProfiles';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-load default Aarav STEM profile on initial launch
  useEffect(() => {
    const fetchDefaultProfile = async () => {
      setLoading(true);
      try {
        const res = await getRecommendations(PRESET_PROFILES[0].data);
        setActiveResult(res);
      } catch (err) {
        console.error('Initial auto-load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDefaultProfile();
  }, []);

  const handleAssessmentSubmit = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecommendations(profileData);
      setActiveResult(res);
      setActiveView('results');
    } catch (err) {
      console.error('Assessment Submit Error:', err);
      setError('Unable to reach Career Copilot API backend. Ensure FastAPI server is running on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = async (presetData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecommendations(presetData);
      setActiveResult(res);
      setActiveView('results');
    } catch (err) {
      console.error('Preset Load Error:', err);
      setError('Unable to connect to FastAPI backend at http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            activeResult={activeResult}
            onTakeAssessment={() => setActiveView('assessment')}
            onLoadPreset={handleLoadPreset}
            onViewResults={() => setActiveView('results')}
          />
        );
      case 'assessment':
        return (
          <AssessmentView
            onSubmit={handleAssessmentSubmit}
            loading={loading}
            initialProfile={activeResult?.student_profile}
          />
        );
      case 'results':
        return (
          <ResultsView
            activeResult={activeResult}
            onTakeAssessment={() => setActiveView('assessment')}
            onAnswerQuestion={() => setActiveView('assessment')}
          />
        );
      case 'streams':
        return <StreamsView onSelectStream={() => setActiveView('results')} />;
      case 'careers':
        return <CareersView />;
      case 'assistant':
        return <CareerAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            activeResult={activeResult}
            onTakeAssessment={() => setActiveView('assessment')}
            onLoadPreset={handleLoadPreset}
            onViewResults={() => setActiveView('results')}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto min-h-[calc(100vh-2rem)] flex flex-col lg:flex-row rounded-[32px] overflow-hidden shadow-2xl bg-[#3B30C8] border border-white/10">
      {/* Left Sidebar */}
      <div className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden'} shrink-0`}>
        <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); }} />
      </div>

      {/* Main White Content Container (Matching Reference UI Design) */}
      <main className="flex-1 bg-white rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-8 m-1 lg:m-2 flex flex-col xl:flex-row justify-between gap-6 overflow-x-hidden min-h-0">
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Header Bar */}
            <Header
              studentName={activeResult?.student_profile?.name || 'Aarav Patel'}
              onTakeAssessment={() => setActiveView('assessment')}
              toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            />

            {/* Global Error Banner */}
            {error && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900 font-bold">Dismiss</button>
              </div>
            )}

            {/* Active View */}
            {renderActiveView()}
          </div>
        </div>

        {/* Right Dashboard Widget Panel */}
        <RightPanel
          activeResult={activeResult}
          selectedCourseId={selectedCourseId}
          onSelectCourse={(cid) => { setSelectedCourseId(cid); setActiveView('results'); }}
        />
      </main>
    </div>
  );
}
