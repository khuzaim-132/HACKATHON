import React from 'react';
import { ArrowRight, Building2, Building, UserCircle, CheckCircle2 } from 'lucide-react';

const Solutions = ({ onOpenLogin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight">
            Tailored <span className="text-blue-600">Solutions.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            CarePulse adapts to your organization's unique needs, from solo practitioners to large hospital networks.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            <SolutionCard 
              icon={<UserCircle className="text-blue-600" size={40} />}
              title="For Private Practices"
              points={["Unified Patient Portal", "Simple Billing", "E-Prescriptions"]}
            />
            <SolutionCard 
              icon={<Building2 className="text-indigo-600" size={40} />}
              title="For Multi-clinics"
              points={["Centralized Dashboard", "Cross-Clinic Scheduling", "Advanced Analytics"]}
            />
            <SolutionCard 
              icon={<Building className="text-emerald-600" size={40} />}
              title="For Hospitals"
              points={["Enterprise Integration", "Departmental Workflows", "HIPAA Compliance"]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10">Scale your practice.</h2>
          <button 
            onClick={onOpenLogin}
            className="px-12 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 mx-auto"
          >
            Request Custom Solution <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

const SolutionCard = ({ icon, title, points }) => (
  <div className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
    <div className="mb-10">{icon}</div>
    <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{title}</h3>
    <ul className="space-y-4">
      {points.map((point) => (
        <li key={point} className="flex items-center gap-3 text-slate-600 font-bold">
          <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Solutions;
