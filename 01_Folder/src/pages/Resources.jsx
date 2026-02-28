import React from 'react';
import { BookOpen, Code2, Headphones, ArrowUpRight } from 'lucide-react';

const Resources = ({ onOpenLogin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 text-center bg-slate-50">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight">
          Help <span className="text-blue-600">Resources.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Everything you need to get the most out of CarePulse. Documentation, API guides, and personal support.
        </p>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <ResourceLink 
              icon={<BookOpen className="text-blue-600" size={32} />}
              title="Documentation"
              description="Browse through our detailed guides and tutorials to master the platform."
            />
            <ResourceLink 
              icon={<Code2 className="text-indigo-600" size={32} />}
              title="API Reference"
              description="Integrate your custom medical software with our robust API system."
            />
            <ResourceLink 
              icon={<Headphones className="text-emerald-600" size={32} />}
              title="Support Center"
              description="Contact our dedicated support team for any technical assistance."
            />
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-24 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-slate-900 rounded-[48px] p-20 text-white">
          <h2 className="text-4xl font-black mb-8">Ready to dive in?</h2>
          <button 
            onClick={onOpenLogin}
            className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl inline-block"
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

const ResourceLink = ({ icon, title, description }) => (
  <div className="group p-10 rounded-[40px] border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
    <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center justify-between">
      {title} <ArrowUpRight className="text-slate-300 group-hover:text-blue-600" size={20} />
    </h3>
    <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
  </div>
);

export default Resources;
