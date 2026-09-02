import React from 'react';
import { Sparkles, Trophy, Award, CheckCircle2, ChevronRight, BookOpen, Compass } from 'lucide-react';

export default function RightPanel({ activeResult, onSelectCourse, selectedCourseId }) {
  const topRec = activeResult?.recommendations?.[0];
  const overallScore = topRec ? Math.round(topRec.score || topRec.overall_match_score || 89) : 89;
  const streamName = topRec ? topRec.stream_name : 'Science (PCM)';
  const courses = topRec?.recommended_courses || [
    {
      course_id: 'C001',
      course_name: 'Science - PCM with Computer Science',
      related_careers: [
        { career_id: 'CAR001', career_name: 'Software Engineer', domain: 'Technology' },
        { career_id: 'CAR002', career_name: 'Data Scientist', domain: 'Technology' },
        { career_id: 'CAR003', career_name: 'Cybersecurity Analyst', domain: 'Technology' }
      ]
    },
    {
      course_id: 'C002',
      course_name: 'Science - PCM with Informatics Practices',
      related_careers: [
        { career_id: 'CAR001', career_name: 'Software Engineer', domain: 'Technology' },
        { career_id: 'CAR009', career_name: 'Database Administrator', domain: 'Technology' },
        { career_id: 'CAR010', career_name: 'Computer Systems Analyst', domain: 'Technology' }
      ]
    },
    {
      course_id: 'C003',
      course_name: 'Science - PCM with Applied Mathematics',
      related_careers: [
        { career_id: 'CAR002', career_name: 'Data Scientist', domain: 'Technology' },
        { career_id: 'CAR044', career_name: 'Actuary', domain: 'Finance' },
        { career_id: 'CAR038', career_name: 'Financial Analyst', domain: 'Finance' }
      ]
    }
  ];

  // Calculate SVG stroke parameters for circular arc gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <aside className="w-full xl:w-80 shrink-0 bg-slate-50/70 border-t xl:border-t-0 xl:border-l border-slate-100 p-5 rounded-3xl xl:rounded-none flex flex-col justify-between space-y-6">
      <div>
        {/* Student Profile Overview */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              AP
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">
                {activeResult?.student_profile?.name || 'Aarav Patel'}
              </h4>
              <p className="text-xs text-slate-500 font-medium">Class 10 Student</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        {/* Circular Gauge Card (Matching Reference UI Design) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {streamName} Match
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{overallScore}%</span>
              <span className="text-[10px] font-bold uppercase text-indigo-600">Match Score</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-2 font-medium">
            High alignment with STEM, Problem Solving & Tech.
          </p>
        </div>

        {/* Vertical Course / Career Cards Stack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended Courses ({courses.length})
            </h4>
            <span className="text-xs font-semibold text-indigo-600">Explore</span>
          </div>

          {courses.map((course, idx) => {
            const isSelected = selectedCourseId === course.course_id || (!selectedCourseId && idx === 0);
            return (
              <div
                key={course.course_id}
                onClick={() => onSelectCourse && onSelectCourse(course.course_id)}
                className={`p-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden border ${
                  isSelected
                    ? 'bg-[#3B30C8] text-white border-indigo-600 shadow-lg shadow-indigo-500/20 transform translate-x-1'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className={`font-bold text-xs leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {course.course_name}
                      </h5>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {course.related_careers?.length || 3} Mapped Careers
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                </div>

                {/* Micro Career Preview */}
                <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                  {course.related_careers?.slice(0, 2).map((car) => (
                    <span
                      key={car.career_id}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/15 text-indigo-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {car.career_name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/60 text-amber-900 flex items-center gap-3">
        <Award className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-xs font-medium leading-tight">
          Validated by Career Copilot AI engine for Class 10 students.
        </p>
      </div>
    </aside>
  );
}
