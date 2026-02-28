import React from 'react';
import { ArrowRight, Brain, Users, Calendar, Sparkles } from 'lucide-react';

const Product = ({ onOpenLogin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-10">
            <Sparkles size={16} />
            <span>Next-Gen Healthcare OS</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.9] md:leading-[1.1]">
            Our <span className="text-blue-600">Product.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform for modern healthcare. We've built the tools so you can focus on saving lives.
          </p>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="text-blue-600" size={32} />}
              title="AI Diagnosis"
              description="Medical-grade AI models that help doctors identify patterns and potential risks in seconds."
              color="blue"
            />
            <FeatureCard 
              icon={<Users className="text-indigo-600" size={32} />}
              title="Patient Management"
              description="A unified view of patient history, reports, and medications in a beautiful, intuitive interface."
              color="indigo"
            />
            <FeatureCard 
              icon={<Calendar className="text-emerald-600" size={32} />}
              title="Smart Scheduling"
              description="Automated appointment booking with smart conflict resolution and automated reminders."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-slate-900 rounded-[40px] p-12 md:p-20 overflow-hidden text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Experience the future today.</h2>
            <button 
              onClick={onOpenLogin}
              className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl flex items-center gap-3 mx-auto"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="p-10 rounded-[40px] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-500">
    <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center bg-${color}-50`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default Product;
