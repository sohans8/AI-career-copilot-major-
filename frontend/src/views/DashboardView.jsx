import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Compass, Award, ShieldAlert } from 'lucide-react';
import { PRESET_PROFILES } from '../data/presetProfiles';

export default function DashboardView({ activeResult, onTakeAssessment, onLoadPreset, onViewResults }) {
  const topRec = activeResult?.recommendations?.[0];
  const overallScore = topRec ? Math.round(topRec.score || topRec.overall_match_score || 89) : 89;
  const streamName = topRec ? topRec.stream_name : 'Science (PCM)';
  const status = activeResult?.recommendation_metadata?.recommendation_status || 'moderate_confidence';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI Stream & Career Pathway
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover Your Ideal Career Pathway After Class 10
          </h2>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Enter your favourite subjects, skills, and areas of interest. Our AI/ML engine analyzes 12 stream options and 200+ career pathways to guide your next steps.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onTakeAssessment}
              className="px-5 py-3 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>✨ Take Career Assessment</span>
            </button>

            {activeResult && (
              <button
                onClick={onViewResults}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur"
              >
                <span>View Full Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Test Presets (Requested for smooth user experience) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
              Quick Test Profiles
            </h3>
            <p className="text-xs text-slate-500">Load verified sample student profiles to test recommendations instantly.</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            1-Click Load
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {PRESET_PROFILES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.data)}
              className="p-3.5 text-left rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {preset.title}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${preset.color}`}>
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {preset.data.subjects.slice(0, 3).join(', ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Streams Grid (Matching Reference Layout Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
            <span className="text-[#FF6B00]">Your Streams</span> & Courses
          </h3>
          <button 
            onClick={onViewResults}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            See All Analysis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Primary Recommendation */}
          <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/80 rounded-2xl p-5 border border-indigo-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  #1
                </span>
                <span className="text-xs font-extrabold text-indigo-700 bg-white px-2.5 py-1 rounded-full shadow-xs border border-indigo-100">
                  {overallScore}% Match
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mt-3">{streamName}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Top match driven by your strong skills & favourite subjects.
              </p>

              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Match Strength</span>
                  <span className="text-indigo-600 font-bold">{overallScore}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-indigo-100">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${overallScore}%` }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={onViewResults}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Courses & Careers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Secondary Recommendation */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  #2
                </span>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  {Math.max(overallScore - 25, 55)}% Match
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-3">
                {topRec ? (activeResult?.recommendations?.[1]?.stream_name || 'Science (PCMB)') : 'Science (PCMB)'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Interdisciplinary pathway offering engineering & healthcare options.
              </p>

              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Match Strength</span>
                  <span className="text-slate-700 font-bold">{Math.max(overallScore - 25, 55)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${Math.max(overallScore - 25, 55)}%` }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={onViewResults}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Details</span>
            </button>
          </div>

          {/* Card 3: Alternative Stream */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  #3
                </span>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  {Math.max(overallScore - 40, 40)}% Match
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base mt-3">
                {topRec ? (activeResult?.recommendations?.[2]?.stream_name || 'Vocational Technologies') : 'Vocational Technologies'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Applied hands-on technologies & technical specialization.
              </p>

              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Match Strength</span>
                  <span className="text-slate-700 font-bold">{Math.max(overallScore - 40, 40)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${Math.max(overallScore - 40, 40)}%` }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={onViewResults}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Analysis Chart Box (Matching Reference Warm Peach Container #FFFBEB) */}
      <div className="bg-[#FFFBEB] rounded-3xl p-6 border border-amber-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span>Career Match Analysis Breakdown</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Normalized breakdown across Subject, Skill, Interest, and Overall match metrics.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span> Skills
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Interests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span> Subjects
            </span>
          </div>
        </div>

        {/* Visual Progress Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-amber-100">
            <div className="text-xs font-bold text-slate-400 uppercase">Skill Match</div>
            <div className="text-2xl font-extrabold text-purple-700 mt-1">
              {topRec ? Math.round(topRec.skill_match_score || 100) : 100}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${topRec ? Math.round(topRec.skill_match_score || 100) : 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-amber-100">
            <div className="text-xs font-bold text-slate-400 uppercase">Interest Match</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {topRec ? Math.round(topRec.interest_match_score || 100) : 100}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${topRec ? Math.round(topRec.interest_match_score || 100) : 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-amber-100">
            <div className="text-xs font-bold text-slate-400 uppercase">Subject Match</div>
            <div className="text-2xl font-extrabold text-indigo-700 mt-1">
              {topRec ? Math.round(topRec.subject_match_score || 100) : 100}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${topRec ? Math.round(topRec.subject_match_score || 100) : 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-amber-100">
            <div className="text-xs font-bold text-slate-400 uppercase">Overall Match</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {overallScore}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: `${overallScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
