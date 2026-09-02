import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const STREAMS_CATALOG = [
  { id: 'S01', name: 'Science (PCM)', domain: 'STEM & Tech', desc: 'Focuses on Physics, Chemistry, Mathematics & Computer Science leading into engineering & technology careers.' },
  { id: 'S02', name: 'Science (PCB)', domain: 'Medical & Bio', desc: 'Focuses on Physics, Chemistry, Biology & Healthcare leading into medicine, biotech, and life sciences.' },
  { id: 'S03', name: 'Science (PCMB)', domain: 'Interdisciplinary', desc: 'Combines both physical and biological sciences for biomedical engineering and bioinformatics pathways.' },
  { id: 'S04', name: 'Commerce with Mathematics', domain: 'Finance & Analytics', desc: 'Focuses on Accountancy, Economics, Business & Math for Chartered Accountancy, Investment Banking & Actuarial careers.' },
  { id: 'S05', name: 'Commerce without Mathematics', domain: 'Business Management', desc: 'Focuses on Business Management, Marketing, E-Commerce & Entrepreneurship pathways.' },
  { id: 'S06', name: 'Humanities & Social Sciences', domain: 'Social & Law', desc: 'Focuses on History, Political Science, Sociology, Psychology & Pre-Law foundations.' },
  { id: 'S07', name: 'Fine Arts & Design', domain: 'Creative & VFX', desc: 'Focuses on Graphic Design, UI/UX, 3D Animation, VFX, Architecture, and Visual Arts.' },
  { id: 'S08', name: 'Vocational & Applied Tech', domain: 'Applied Tech', desc: 'Focuses on Software/Web Dev, Electronics, Automobile & Mechatronics technical skills.' },
  { id: 'S09', name: 'Agriculture & Environment', domain: 'Agri-Tech', desc: 'Focuses on Agronomy, Horticulture, Agribusiness, and Environmental Sustainability.' },
  { id: 'S10', name: 'Legal & Administrative', domain: 'Law & Governance', desc: 'Focuses on Pre-Law foundation, Corporate Law, Litigation, Public Policy, and Civil Services.' },
  { id: 'S11', name: 'Paramedical & Allied Health', domain: 'Allied Healthcare', desc: 'Focuses on Physiotherapy, Medical Lab Tech, Radiography, and Nursing.' },
  { id: 'S12', name: 'Mass Media & Comm', domain: 'Media & Journalism', desc: 'Focuses on Journalism, Digital Film, Sound Engineering, Content Strategy, and PR.' },
];

export default function StreamsView({ onSelectStream }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          📚 Educational Streams & Pathways Catalog
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore all 12 Class 11-12 stream options available in Career Copilot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STREAMS_CATALOG.map((st) => (
          <div key={st.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  {st.id}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {st.domain}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-3">{st.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{st.desc}</p>
            </div>

            <button
              onClick={() => onSelectStream && onSelectStream(st.id)}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
