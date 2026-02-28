import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserSubscription } from '../services/userService';
import { useNavigate } from 'react-router-dom';

const Pricing = ({ onOpenLogin }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSelectPlan = async (planTitle) => {
    const plan = planTitle.toLowerCase();
    
    if (plan === 'starter') {
      onOpenLogin(); // Redirect/Open login as requested
      return;
    }

    if (!user) {
      onOpenLogin();
      return;
    }

    setLoadingPlan(planTitle);
    try {
      const res = await updateUserSubscription(user.uid, plan);
      if (res.success) {
        alert(`Success! You have successfully upgraded to the ${planTitle} plan.`);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.9] md:leading-[1.1]">
            Transparent <span className="text-blue-600">Pricing.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that's right for your practice. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard 
              title="Starter"
              price="$49"
              description="Ideal for solo clinics."
              features={["Up to 500 Patients", "Basic Scheduling", "Email Support"]}
              onSelect={() => handleSelectPlan('Starter')}
            />
            <PricingCard 
              title="Professional"
              price="$99"
              description="The power of AI for growth."
              features={["Unlimited Patients", "AI Diagnosis Assistant", "Priority Support"]}
              highlight={true}
              onSelect={() => handleSelectPlan('Professional')}
              loading={loadingPlan === 'Professional'}
            />
            <PricingCard 
              title="Enterprise"
              price="Custom"
              description="Customized for hospitals."
              features={["Multi-department Access", "On-Premise Options", "24/7 Account Manager"]}
              onSelect={() => handleSelectPlan('Enterprise')}
              loading={loadingPlan === 'Enterprise'}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-[40px] p-12 text-center border border-slate-100">
            <h2 className="text-3xl font-black mb-6">Need a custom plan?</h2>
            <button 
              onClick={onOpenLogin}
              className="text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto"
            >
              Contact our sales team <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const PricingCard = ({ title, price, description, features, onSelect, loading, highlight = false }) => (
  <div className={`p-10 rounded-[48px] border ${
    highlight ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105' : 'bg-white text-slate-900 border-slate-100'
  } transition-all duration-500`}>
    <h3 className="text-2xl font-black mb-2 tracking-tight">{title}</h3>
    <p className={highlight ? 'text-slate-400' : 'text-slate-500'}>{description}</p>
    <div className="my-10">
      <span className="text-5xl font-black">{price}</span>
      {price !== "Custom" && <span className="text-lg font-bold opacity-60">/mo</span>}
    </div>
    <ul className="space-y-4 mb-10">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-3 font-bold text-sm">
          <Check size={18} className={highlight ? 'text-blue-400' : 'text-blue-600'} />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onSelect}
      disabled={loading}
      className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
        highlight ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-900 text-white hover:bg-slate-800'
      } disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {loading && <Loader2 className="animate-spin" size={20} />}
      <span>{loading ? 'Processing...' : `Choose ${title}`}</span>
    </button>
  </div>
);

export default Pricing;
