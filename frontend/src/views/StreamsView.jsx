import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

export const STREAMS_CATALOG = [
  { id: 'S01', name: 'Science (PCM)',              domain: 'STEM & Tech',        emoji: '⚗️',  color: '#4f46e5', desc: 'Physics, Chemistry, Mathematics & Computer Science → Engineering & Technology careers.' },
  { id: 'S02', name: 'Science (PCB)',              domain: 'Medical & Bio',       emoji: '🔬',  color: '#059669', desc: 'Physics, Chemistry, Biology & Healthcare → Medicine, Biotech, Life Sciences.' },
  { id: 'S03', name: 'Science (PCMB)',             domain: 'Interdisciplinary',   emoji: '🧬',  color: '#7c3aed', desc: 'Combined physical & biological sciences → Biomedical Engineering & Bioinformatics.' },
  { id: 'S04', name: 'Commerce with Mathematics',  domain: 'Finance & Analytics', emoji: '📊',  color: '#d97706', desc: 'Accountancy, Economics, Business & Math → CA, Investment Banking, Actuarial.' },
  { id: 'S05', name: 'Commerce without Maths',     domain: 'Business Mgmt',       emoji: '💼',  color: '#f97316', desc: 'Business Management, Marketing, E-Commerce & Entrepreneurship pathways.' },
  { id: 'S06', name: 'Humanities & Social Sci.',   domain: 'Social & Law',        emoji: '⚖️',  color: '#0891b2', desc: 'History, Political Science, Sociology, Psychology & Pre-Law foundations.' },
  { id: 'S07', name: 'Fine Arts & Design',         domain: 'Creative & VFX',      emoji: '🎨',  color: '#e11d48', desc: 'Graphic Design, UI/UX, 3D Animation, VFX, Architecture, Visual Arts.' },
  { id: 'S08', name: 'Vocational & Applied Tech',  domain: 'Applied Tech',        emoji: '🔧',  color: '#64748b', desc: 'Software/Web Dev, Electronics, Automobile & Mechatronics technical skills.' },
  { id: 'S09', name: 'Agriculture & Environment',  domain: 'Agri-Tech',           emoji: '🌱',  color: '#16a34a', desc: 'Agronomy, Horticulture, Agribusiness, and Environmental Sustainability.' },
  { id: 'S10', name: 'Legal & Administrative',     domain: 'Law & Governance',    emoji: '🏛️',  color: '#1d4ed8', desc: 'Pre-Law, Corporate Law, Litigation, Public Policy, and Civil Services.' },
  { id: 'S11', name: 'Paramedical & Allied Health',domain: 'Allied Healthcare',   emoji: '🩺',  color: '#be185d', desc: 'Physiotherapy, Medical Lab Tech, Radiography, and Nursing.' },
  { id: 'S12', name: 'Mass Media & Comm.',         domain: 'Media & Journalism',  emoji: '📡',  color: '#b45309', desc: 'Journalism, Digital Film, Sound Engineering, Content Strategy, PR.' },
];

export default function StreamsView({ onSelectStream }) {
  const [search, setSearch] = useState('');

  const filtered = STREAMS_CATALOG.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) || s.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">📚 Stream Catalog</h2>
          <p className="text-sm text-slate-500 mt-1">Explore all 12 Class 11–12 academic pathways</p>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search streams..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((st) => (
          <div key={st.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden card-lift flex flex-col">
            {/* Top color strip */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${st.color}, ${st.color}88)` }} />

            <div className="p-6 flex flex-col flex-1 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${st.color}14` }}>
                  {st.emoji}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${st.color}14`, color: st.color }}>
                    {st.domain}
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{st.id}</p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-base leading-snug">{st.name}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.desc}</p>
              </div>

              <button
                onClick={() => onSelectStream && onSelectStream(st.id)}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                style={{ background: `${st.color}12`, color: st.color, border: `1px solid ${st.color}25` }}
                onMouseEnter={e => { e.currentTarget.style.background = st.color; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${st.color}12`; e.currentTarget.style.color = st.color; }}
              >
                Explore Courses <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">No streams match "{search}"</p>
        </div>
      )}
    </div>
  );
}
