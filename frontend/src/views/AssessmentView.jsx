import React, { useState } from 'react';
import { Sparkles, Check, BookOpen, Brain, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { POPULAR_SUBJECTS, POPULAR_SKILLS, POPULAR_INTERESTS } from '../data/optionsData';

export default function AssessmentView({ studentName, onSubmit, loading }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: studentName,
      subjects: selectedSubjects,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Favourite Subjects */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#FF6B00] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">📚 Favourite Subjects</h3>
                <p className="text-xs text-slate-500">Which subjects do you enjoy learning the most?</p>
              </div>
            </div>
            {selectedSubjects.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                {selectedSubjects.length} Selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {POPULAR_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjects.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleItem(sub, selectedSubjects, setSelectedSubjects)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#3B30C8] text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 2: Key Skills & Strengths */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">🧠 Key Skills & Strengths</h3>
                <p className="text-xs text-slate-500">What are your strongest abilities and aptitudes?</p>
              </div>
            </div>
            {selectedSkills.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full">
                {selectedSkills.length} Selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {POPULAR_SKILLS.map((sk) => {
              const isSelected = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleItem(sk, selectedSkills, setSelectedSkills)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-md shadow-purple-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-purple-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 3: Areas of Interest */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">❤️ Areas of Interest</h3>
                <p className="text-xs text-slate-500">What fields or topics excite your curiosity?</p>
              </div>
            </div>
            {selectedInterests.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full">
                {selectedInterests.length} Selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {POPULAR_INTERESTS.map((inst) => {
              const isSelected = selectedInterests.includes(inst);
              return (
                <button
                  key={inst}
                  type="button"
                  onClick={() => toggleItem(inst, selectedInterests, setSelectedInterests)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-orange-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{inst}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Analyzing your profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>✨ Generate Career Recommendation →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
