import React, { useState } from 'react';
import { Compass, Search, Sparkles } from 'lucide-react';

export const CAREERS_BY_DOMAIN = {
  Technology: [
    { name: 'Software Engineer', desc: 'Designs, builds, and maintains software applications and complex computer systems.' },
    { name: 'Data Scientist', desc: 'Analyzes structured & unstructured data using ML models to extract predictive insights.' },
    { name: 'Cybersecurity Analyst', desc: 'Protects networks, computer systems, and data infrastructure from cyber attacks.' },
    { name: 'Cloud Solutions Architect', desc: 'Designs scalable cloud infrastructure architectures for enterprise platforms.' },
    { name: 'AI / ML Research Engineer', desc: 'Develops deep learning models and artificial intelligence algorithm solutions.' }
  ],
  Engineering: [
    { name: 'Robotics Engineer', desc: 'Builds autonomous robotic hardware systems and intelligent automation controllers.' },
    { name: 'Mechanical Engineer', desc: 'Designs mechanical machinery, thermal systems, and physical industrial components.' },
    { name: 'Civil Engineer', desc: 'Plans, designs, and manages infrastructure construction projects (bridges, roads, buildings).' },
    { name: 'Electrical Engineer', desc: 'Develops electrical grids, circuits, microelectronics, and power systems.' },
    { name: 'Aerospace Engineer', desc: 'Designs aircraft, spacecraft, satellite systems, and missile technologies.' }
  ],
  Healthcare: [
    { name: 'Doctor / Physician', desc: 'Diagnoses medical conditions and administers therapeutic treatments to patients.' },
    { name: 'Surgeon', desc: 'Performs operative procedures to treat injuries, diseases, and physical deformities.' },
    { name: 'Dentist', desc: 'Diagnoses and treats oral health diseases, teeth issues, and maxillofacial conditions.' },
    { name: 'Pharmacist', desc: 'Prepares and dispenses medicinal drugs while providing pharmacological guidance.' },
    { name: 'Clinical Psychologist', desc: 'Provides psychotherapeutic assessment and treatment for mental health conditions.' }
  ],
  Finance: [
    { name: 'Chartered Accountant', desc: 'Manages corporate financial auditing, taxation strategy, and accounting governance.' },
    { name: 'Investment Banker', desc: 'Facilitates corporate mergers, acquisitions, equity capital raising, and bond underwriting.' },
    { name: 'Financial Analyst', desc: 'Evaluates financial performance, equity markets, and corporate investment opportunities.' },
    { name: 'Actuary', desc: 'Uses mathematical statistics and probability to model financial risk in insurance and finance.' }
  ],
  Creative: [
    { name: 'Graphic Designer', desc: 'Creates visual concepts, digital illustrations, and branding communications.' },
    { name: 'UI/UX Designer', desc: 'Designs digital user experiences, interactive web interfaces, and product workflows.' },
    { name: 'Animator & VFX Artist', desc: 'Creates 3D computer animations, visual effects, and digital motion graphics.' }
  ]
};

export default function CareersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');

  const domains = ['All', ...Object.keys(CAREERS_BY_DOMAIN)];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            🧭 Explore Career Pathways
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse 200+ career options mapped directly to Class 11-12 streams.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search careers..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap gap-2">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setActiveDomain(dom)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeDomain === dom
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(CAREERS_BY_DOMAIN)
          .filter(([dom]) => activeDomain === 'All' || activeDomain === dom)
          .flatMap(([dom, items]) => 
            items
              .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.desc.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(car => ({ ...car, domain: dom }))
          )
          .map((car, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {car.domain}
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{car.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{car.desc}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
