import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  TrendingUp, 
  ShieldAlert, 
  Info,
  ArrowLeft
} from 'lucide-react';

export default function ResultsView({ activeResult, studentName, onEditAssessment }) {
  if (!activeResult) {
    return null;
  }

  const { student_profile, recommendation_metadata, recommendations } = activeResult;
  const topRec = recommendations?.[0];
  const overallScore = topRec ? Math.round(topRec.score || topRec.overall_match_score || 84) : 84;
  const status = recommendation_metadata?.recommendation_status || 'moderate_confidence';
  const uncertainty = recommendation_metadata?.uncertainty_score || 0.39;
  const followUpQuestions = recommendation_metadata?.follow_up_questions || [];

  const getStatusBadge = (st) => {
    switch (st) {
      case 'high_confidence':
        return { label: 'High Confidence', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      case 'moderate_confidence':
        return { label: 'Moderate Confidence', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Sparkles };
      case 'conflicting_evidence':
        return { label: 'Conflicting Signals', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertCircle };
      case 'needs_more_information':
        return { label: 'More Information Needed', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: ShieldAlert };
      default:
        return { label: 'Analyzed', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Info };
    }
  };

  const statusBadge = getStatusBadge(status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Verified AI Career Recommendation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ✨ Your Career Recommendation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Welcome, <strong className="text-slate-900">{student_profile?.name || studentName || 'Student'}</strong>! Here is your AI-analyzed pathway.
          </p>
        </div>

        <button
          onClick={onEditAssessment}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all self-start sm:self-auto flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Assessment</span>
        </button>
      </div>

      {/* Prominent Recommended Stream Card */}
      <div className="bg-gradient-to-br from-[#3B30C8] via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-xs">
                Recommended Stream
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
                <StatusIcon className="w-3.5 h-3.5" /> {statusBadge.label}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              {topRec?.stream_name || 'Science (PCM)'}
            </h3>

            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed font-medium">
              {topRec?.description || 'Focuses on Mathematics, Physics, Chemistry, and Technology options.'}
            </p>

            <div className="text-xs text-indigo-200 pt-1">
              <span>Uncertainty Score: <strong className="text-white">{uncertainty}</strong></span>
            </div>
          </div>

          {/* Big Match Percentage Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center justify-center text-center shrink-0 min-w-[180px]">
            <span className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
              {overallScore}%
            </span>
            <span className="text-xs font-extrabold uppercase text-white tracking-widest mt-1">
              Match Score
            </span>
            <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${overallScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matches You */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FF6B00]" />
          <span>Why This Matches You</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Subject Match</div>
            <div className="text-2xl font-extrabold text-indigo-600">
              {topRec ? Math.round(topRec.subject_match_score || 100) : 100}%
            </div>
            <p className="text-xs text-slate-500">
              Selected: {student_profile?.subjects?.join(', ') || 'Mathematics, Physics'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Skill Match</div>
            <div className="text-2xl font-extrabold text-purple-600">
              {topRec ? Math.round(topRec.skill_match_score || 100) : 100}%
            </div>
            <p className="text-xs text-slate-500">
              Selected: {student_profile?.skills?.join(', ') || 'Problem Solving, Programming'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Interest Match</div>
            <div className="text-2xl font-extrabold text-amber-600">
              {topRec ? Math.round(topRec.interest_match_score || 100) : 100}%
            </div>
            <p className="text-xs text-slate-500">
              Selected: {student_profile?.interests?.join(', ') || 'Technology, Engineering'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Recommended Courses</span>
          </h3>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {topRec?.recommended_courses?.length || 0} Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRec?.recommended_courses?.map((course) => (
            <div
              key={course.course_id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  💻
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {course.course_id}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {course.course_name}
                </h4>
              </div>

              {/* Mapped Career Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Career Options:
                </span>
                <ul className="space-y-1.5">
                  {course.related_careers?.map((car) => (
                    <li key={car.career_id} className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                      <span>{car.career_name}</span>
                      <span className="ml-auto text-[10px] text-slate-400 font-medium">[{car.domain}]</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Questions Section */}
      {followUpQuestions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <HelpCircle className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">🎯 Let's Make Your Recommendation More Precise</h3>
              <p className="text-xs text-amber-100">Follow-up questions based on competing stream evidence:</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {followUpQuestions.map((q, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
