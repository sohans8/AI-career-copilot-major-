import React, { useState } from 'react';
import { Sparkles, Check, Plus, Trash2, User, BookOpen, Brain, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { POPULAR_SUBJECTS, POPULAR_SKILLS, POPULAR_INTERESTS } from '../data/optionsData';
import { PRESET_PROFILES } from '../data/presetProfiles';

export default function AssessmentView({ onSubmit, loading, initialProfile }) {
  const [name, setName] = useState(initialProfile?.name || 'Aarav Patel');
  const [selectedSubjects, setSelectedSubjects] = useState(initialProfile?.subjects || ['Mathematics', 'Physics', 'Chemistry', 'Computer Science']);
  const [selectedSkills, setSelectedSkills] = useState(initialProfile?.skills || ['Logical Thinking', 'Problem Solving', 'Numerical Ability', 'Programming']);
  const [selectedInterests, setSelectedInterests] = useState(initialProfile?.interests || ['Technology', 'Engineering', 'Computers']);

  const [customSubject, setCustomSubject] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustom = (value, list, setList, setValue) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue('');
    }
  };

  const loadPreset = (presetData) => {
    setName(presetData.name);
    setSelectedSubjects(presetData.subjects);
    setSelectedSkills(presetData.skills);
    setSelectedInterests(presetData.interests);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      subjects: selectedSubjects,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Class 10 AI Career Assessment
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tell Us About Your Strengths & Preferences
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Select your favourite subjects, skills, and areas of interest below. Our AI engine will analyze your inputs to recommend your ideal stream, courses, and career paths.
        </p>
      </div>

      {/* Preset Profiles Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            ⚡ Quick Test Profiles (1-Click Load)
          </span>
          <span className="text-[11px] text-slate-400">Loads sample student data</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROFILES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset.data)}
              className="px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-slate-700 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-2xs"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Student Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Profile</h3>
              <p className="text-xs text-slate-500">Enter your full name for personalized recommendation reports.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Patel"
              required
              className="w-full max-w-md px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Step 2: Favourite Subjects */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Favourite Subjects</h3>
                <p className="text-xs text-slate-500">Which subjects do you enjoy learning the most?</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
              {selectedSubjects.length} Selected
            </span>
          </div>

          {/* Selectable Chips */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjects.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleItem(sub, selectedSubjects, setSelectedSubjects)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Add another subject..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddCustom(customSubject, selectedSubjects, setSelectedSubjects, setCustomSubject)}
              className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Step 3: Key Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Key Skills & Strengths</h3>
                <p className="text-xs text-slate-500">What are your strongest abilities and aptitudes?</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full">
              {selectedSkills.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.map((sk) => {
              const isSelected = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleItem(sk, selectedSkills, setSelectedSkills)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Areas of Interest */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Areas of Interest</h3>
                <p className="text-xs text-slate-500">What fields or topics excite your curiosity?</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full">
              {selectedInterests.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_INTERESTS.map((inst) => {
              const isSelected = selectedInterests.includes(inst);
              return (
                <button
                  key={inst}
                  type="button"
                  onClick={() => toggleItem(inst, selectedInterests, setSelectedInterests)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{inst}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Analyzing Career Path...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Career Recommendation</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
