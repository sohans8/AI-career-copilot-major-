import React, { useEffect, useRef } from 'react';
import {
  Sparkles, CheckCircle2, AlertCircle, HelpCircle,
  BookOpen, TrendingUp, ShieldAlert, ArrowLeft,
  Target, Star, Award, ChevronRight, Zap
} from 'lucide-react';

// ─── Animated circular score ring ────────────────────────────────────────────
function ScoreRing({ score, size = 140 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const canvasRef = useRef(null);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white leading-none">{score}%</span>
        <span className="text-[10px] font-bold uppercase text-white/60 tracking-wider mt-0.5">Match</span>
      </div>
    </div>
  );
}

// ─── Status config ────────────────────────────────────────────────────────────
function getStatus(st) {
  switch (st) {
    case 'high_confidence':
      return { label: 'High Confidence', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', icon: CheckCircle2, dot: 'bg-emerald-500' };
    case 'moderate_confidence':
      return { label: 'Moderate Confidence', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', icon: Sparkles, dot: 'bg-indigo-500' };
    case 'conflicting_evidence':
      return { label: 'Conflicting Signals', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: AlertCircle, dot: 'bg-amber-500' };
    case 'needs_more_information':
      return { label: 'Needs More Info', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', icon: ShieldAlert, dot: 'bg-rose-500' };
    default:
      return { label: 'Analyzed', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', icon: Sparkles, dot: 'bg-slate-400' };
  }
}

// ─── Match bar ────────────────────────────────────────────────────────────────
function MatchBar({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-xl font-black" style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{ width: `${Math.round(value)}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
        />
      </div>
    </div>
  );
}

// ─── Main ResultsView ────────────────────────────────────────────────────────
export default function ResultsView({ activeResult, studentName, onEditAssessment }) {
  if (!activeResult) return null;

  const { student_profile, recommendation_metadata, recommendations } = activeResult;
  const topRec   = recommendations?.[0];
  const score    = topRec ? Math.round(topRec.score || topRec.overall_match_score || 84) : 84;
  const status   = recommendation_metadata?.recommendation_status || 'moderate_confidence';
  const uncertainty = recommendation_metadata?.uncertainty_score ?? 0.39;
  const followUp = recommendation_metadata?.follow_up_questions || [];
  const st = getStatus(status);
  const StatusIcon = st.icon;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-fade-in-up">

      {/* Top nav */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onEditAssessment}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Assessment
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa'}}>
          <Sparkles className="w-3.5 h-3.5" /> AI Career Recommendation
        </div>
      </div>

      {/* ── Hero result card ── */}
      <div className="relative rounded-[28px] overflow-hidden text-white"
        style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)'}}>
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Left: stream info */}
            <div className="space-y-4 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-900"
                  style={{background: 'linear-gradient(135deg, #f59e0b, #f97316)'}}>
                  🏆 Recommended Stream
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}>
                  <StatusIcon className="w-3 h-3" /> {st.label}
                </span>
              </div>

              {/* Stream name */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {topRec?.stream_name || 'Science (PCM)'}
                </h3>
                <p className="text-indigo-200 text-sm mt-2 max-w-lg leading-relaxed">
                  {topRec?.description || 'STEM pathway focusing on Physics, Chemistry, and Mathematics for Engineering and Technology.'}
                </p>
              </div>

              {/* Uncertainty */}
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Target className="w-3.5 h-3.5" />
                <span>Uncertainty score: <strong className="text-white">{uncertainty}</strong></span>
              </div>

              {/* Tags */}
              {topRec?.explanation_factors?.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-indigo-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Right: score ring */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <ScoreRing score={score} size={140} />
              <div className="text-center">
                <p className="text-xs text-indigo-300 font-semibold">Stream Match</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alt recommendations ── */}
      {recommendations?.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Alternative Streams</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.slice(1, 3).map((rec, i) => (
              <div key={rec.stream_id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 card-lift">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shrink-0">
                  #{i + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{rec.stream_name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{Math.round(rec.overall_match_score || 0)}% match</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-slate-300" style={{ width: `${Math.round(rec.overall_match_score || 0)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Match breakdown ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-black text-slate-900">Why This Matches You</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MatchBar label="Subjects"  value={topRec?.subject_match_score  ?? 100} color="#4f46e5" icon={BookOpen} />
          <MatchBar label="Skills"    value={topRec?.skill_match_score    ?? 100} color="#7c3aed" icon={Star} />
          <MatchBar label="Interests" value={topRec?.interest_match_score ?? 100} color="#f97316" icon={Award} />
        </div>
      </div>

      {/* ── Recommended courses ── */}
      {topRec?.recommended_courses?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900">Recommended Courses</h3>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {topRec.recommended_courses.length} Courses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRec.recommended_courses.map((course) => (
              <div key={course.course_id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 card-lift">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg shadow-md shrink-0"
                    style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
                    🎓
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{course.course_id}</span>
                </div>
                <h4 className="font-black text-slate-900 text-base leading-snug">{course.course_name}</h4>
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Career Pathways</p>
                  {course.related_careers?.map((car) => (
                    <div key={car.career_id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: '#f97316'}} />
                      <span className="text-xs font-semibold text-slate-700 flex-1">{car.career_name}</span>
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-lg">{car.domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Follow-up questions ── */}
      {followUp.length > 0 && (
        <div className="rounded-3xl overflow-hidden"
          style={{background: 'linear-gradient(135deg, #1e1b4b, #312e81)'}}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{background: 'rgba(251,191,36,0.2)'}}>
                <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">🎯 Refine Your Recommendation</h3>
                <p className="text-xs text-indigo-300">Answer these to get a more precise result</p>
              </div>
            </div>
            <div className="space-y-3">
              {followUp.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
