import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink } from 'lucide-react';

export const CAREERS_BY_DOMAIN = {
  Technology: {
    color: '#4f46e5', emoji: '💻',
    careers: [
      { name: 'Software Engineer',        desc: 'Designs, builds, and maintains software applications and complex systems.' },
      { name: 'Data Scientist',           desc: 'Analyzes data using ML models to extract predictive insights.' },
      { name: 'Cybersecurity Analyst',    desc: 'Protects networks and systems from cyber attacks.' },
      { name: 'Cloud Solutions Architect',desc: 'Designs scalable cloud infrastructure for enterprise platforms.' },
      { name: 'AI / ML Research Engineer',desc: 'Develops deep learning models and AI algorithm solutions.' },
    ],
  },
  Engineering: {
    color: '#0891b2', emoji: '⚙️',
    careers: [
      { name: 'Robotics Engineer',   desc: 'Builds autonomous robotic systems and intelligent automation controllers.' },
      { name: 'Mechanical Engineer', desc: 'Designs machinery, thermal systems, and industrial components.' },
      { name: 'Civil Engineer',      desc: 'Plans and manages infrastructure construction projects.' },
      { name: 'Electrical Engineer', desc: 'Develops electrical grids, circuits, and power systems.' },
      { name: 'Aerospace Engineer',  desc: 'Designs aircraft, spacecraft, and satellite systems.' },
    ],
  },
  Healthcare: {
    color: '#059669', emoji: '🩺',
    careers: [
      { name: 'Doctor / Physician',  desc: 'Diagnoses medical conditions and administers treatments.' },
      { name: 'Surgeon',             desc: 'Performs operative procedures to treat injuries and diseases.' },
      { name: 'Dentist',             desc: 'Diagnoses and treats oral health diseases and conditions.' },
      { name: 'Pharmacist',          desc: 'Prepares and dispenses medicinal drugs with guidance.' },
      { name: 'Clinical Psychologist',desc: 'Provides psychotherapeutic assessment and mental health treatment.' },
    ],
  },
  Finance: {
    color: '#d97706', emoji: '📈',
    careers: [
      { name: 'Chartered Accountant', desc: 'Manages financial auditing, taxation, and accounting governance.' },
      { name: 'Investment Banker',    desc: 'Facilitates corporate mergers, acquisitions, and capital raising.' },
      { name: 'Financial Analyst',    desc: 'Evaluates financial performance and corporate investment opportunities.' },
      { name: 'Actuary',              desc: 'Models financial risk using statistics and probability theory.' },
    ],
  },
  Creative: {
    color: '#e11d48', emoji: '🎨',
    careers: [
      { name: 'Graphic Designer',    desc: 'Creates visual concepts, illustrations, and branding communications.' },
      { name: 'UI/UX Designer',      desc: 'Designs digital user experiences and interactive interfaces.' },
      { name: 'Animator & VFX Artist',desc: 'Creates 3D animations, visual effects, and motion graphics.' },
    ],
  },
  Law: {
    color: '#1d4ed8', emoji: '⚖️',
    careers: [
      { name: 'Corporate Lawyer',   desc: 'Advises companies on legal matters, contracts, and compliance.' },
      { name: 'Civil Services (IAS)',desc: 'Administers government policy and public services at district/state level.' },
      { name: 'Public Prosecutor',  desc: 'Represents the state in criminal cases in courts of law.' },
    ],
  },
};

export default function CareersView() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const domains = ['All', ...Object.keys(CAREERS_BY_DOMAIN)];

  const allCareers = Object.entries(CAREERS_BY_DOMAIN).flatMap(([domain, { color, emoji, careers }]) =>
    careers.map(c => ({ ...c, domain, color, emoji }))
  );

  const filtered = allCareers.filter(c => {
    const matchDomain = activeFilter === 'All' || c.domain === activeFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">🧭 Career Explorer</h2>
          <p className="text-sm text-slate-500 mt-1">Browse {allCareers.length}+ career options mapped to Class 11–12 streams</p>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search careers..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Domain filter pills */}
      <div className="flex flex-wrap gap-2">
        {domains.map(dom => {
          const isActive = activeFilter === dom;
          const domData = CAREERS_BY_DOMAIN[dom];
          return (
            <button
              key={dom}
              onClick={() => setActiveFilter(dom)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all"
              style={isActive ? {
                background: domData?.color || '#1e293b',
                color: '#fff',
                boxShadow: `0 4px 14px ${domData?.color || '#1e293b'}44`,
              } : {
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
              }}
            >
              {domData?.emoji && <span>{domData.emoji}</span>}
              {dom}
            </button>
          );
        })}
      </div>

      {/* Career grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((car, idx) => (
          <div key={idx} className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden card-lift p-6 space-y-3">
            {/* Top strip */}
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${car.color}15` }}>
                {car.emoji}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                style={{ background: `${car.color}12`, color: car.color }}>
                {car.domain}
              </span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">{car.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{car.desc}</p>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold pt-1" style={{ color: car.color }}>
              <Sparkles className="w-3 h-3" />
              <span>AI Matched Career</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">No careers found for "{search}"</p>
          <button onClick={() => { setSearch(''); setActiveFilter('All'); }}
            className="mt-3 text-xs text-indigo-500 hover:underline font-semibold">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
