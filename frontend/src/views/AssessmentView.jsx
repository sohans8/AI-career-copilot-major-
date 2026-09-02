import React, { useState } from 'react';
import { Sparkles, Check, BookOpen, Brain, Heart, ArrowRight, Loader2, Zap } from 'lucide-react';
import { POPULAR_SUBJECTS, POPULAR_SKILLS, POPULAR_INTERESTS } from '../data/optionsData';

const STEPS = [
  {
    id: 0, key: 'subjects', label: 'Favourite Subjects', icon: BookOpen,
    emoji: '📚', hint: 'Which subjects do you enjoy the most?',
    color: 'indigo', activeColor: '#4f46e5', lightBg: '#eef2ff', chipActive: 'bg-indigo-600 text-white shadow-indigo-200',
  },
  {
    id: 1, key: 'skills', label: 'Key Skills & Strengths', icon: Brain,
    emoji: '🧠', hint: 'What are your strongest abilities?',
    color: 'violet', activeColor: '#7c3aed', lightBg: '#f5f3ff', chipActive: 'bg-violet-600 text-white shadow-violet-200',
  },
  {
    id: 2, key: 'interests', label: 'Areas of Interest', icon: Heart,
    emoji: '❤️', hint: 'What topics excite your curiosity?',
    color: 'rose', activeColor: '#e11d48', lightBg: '#fff1f2', chipActive: 'bg-rose-600 text-white shadow-rose-200',
  },
];

const DATA_MAP = {
  subjects: POPULAR_SUBJECTS,
  skills:   POPULAR_SKILLS,
  interests: POPULAR_INTERESTS,
};

export default function AssessmentView({ studentName, onSubmit, loading }) {
  const [selected, setSelected] = useState({ subjects: [], skills: [], interests: [] });
  const [activeStep, setActiveStep] = useState(0);

  const toggle = (key, item) =>
    setSelected(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item],
    }));

  const totalSelected = selected.subjects.length + selected.skills.length + selected.interests.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: studentName, ...selected });
  };

  const currentStep = STEPS[activeStep];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in-up">

      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
        style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-3"
              style={{background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)'}}>
              <Zap className="w-3 h-3" /> Hybrid AI + Rule Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Build Your Profile
            </h2>
            <p className="text-indigo-200 text-sm mt-1">
              Select across all 3 categories for the most accurate recommendation.
            </p>
          </div>
          {totalSelected > 0 && (
            <div className="flex items-center gap-3 glass rounded-2xl px-5 py-3 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-black text-white">{totalSelected}</div>
                <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Selected</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const count = selected[step.key].length;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-lg scale-[1.02]'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <span>{step.emoji}</span>
              <span>{step.label}</span>
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                  isActive ? 'bg-white/20 text-white' : 'text-white'
                }`} style={!isActive ? {background: step.activeColor} : {}}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active step card */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card-light overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-6 pb-4" style={{background: currentStep.lightBg}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{background: `linear-gradient(135deg, ${currentStep.activeColor}, ${currentStep.activeColor}cc)`}}>
                  <currentStep.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{currentStep.emoji} {currentStep.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentStep.hint}</p>
                </div>
              </div>
              {selected[currentStep.key].length > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-black text-white"
                  style={{background: currentStep.activeColor}}>
                  {selected[currentStep.key].length} picked
                </span>
              )}
            </div>
          </div>

          {/* Chips */}
          <div className="p-6">
            <div className="flex flex-wrap gap-2.5">
              {DATA_MAP[currentStep.key].map((item) => {
                const isSelected = selected[currentStep.key].includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(currentStep.key, item)}
                    className={`chip-hover px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      isSelected
                        ? `${currentStep.chipActive} shadow-md scale-[1.02]`
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation row */}
          <div className="px-6 pb-6 flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStep(s.id)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStep === s.id ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {activeStep < 2 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(79,70,229,0.3)'}}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 6px 20px rgba(249,115,22,0.35)'}}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Get Recommendation</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary + final submit (when all 3 done) */}
        {totalSelected >= 3 && (
          <div className="mt-4 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="text-base">{s.emoji}</span>
                  <span className="font-semibold text-white">{selected[s.key].length}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 6px 20px rgba(249,115,22,0.4)'}}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing profile...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> ✨ Generate My Career Path</>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
